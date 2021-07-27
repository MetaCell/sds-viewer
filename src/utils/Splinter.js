const N3 = require('n3');
const graphModel = require("./graphModel.json");
const imgs = ['dataset.svg', 'nifti.svg', 'volume.svg'].map(src => {
    const img = new Image();
    img.src = `./images/${src}`;
    console.log("Image source ", img.src);
    return img;
});
const staticData = {
    nodes: [
        { id: "a" , name : "Dataset", img : imgs[0], level : 1 },
        { id: "b" , name : " Subject 2", img : imgs[1], level : 2 },
        { id: "c" , name : "Subject 3", img : imgs[1], level : 2 },
        { id: "d" , name : "Subject 4", img : imgs[1], level : 3 },
        { id: "e" , name : "Subject 5", img : imgs[1], level : 3 },
        { id: "f" , name : "File 1", img : imgs[1], level : 3 },
        { id: "g" , name : "File 2", img : imgs[1], level : 3 },
        { id: "h" , name : "File 3", img : imgs[1], level : 4 },
        { id: "i" , name : "File 4", img : imgs[1], level : 4 }
    ],
    links: [
        { source: "a", target: "b"},
        { source: "a", target: "c"},
        { source: "b", target: "d"},
        { source: "b", target: "e"},
        { source: "d", target: "h"},
        { source: "d", target: "i"},
        { source: "c", target: "f"},
        { source: "c", target: "g"}
    ]
};

class Splinter {
    constructor(jsonFile, turtleFile) {
        this.jsonFile = jsonFile;
        this.turtleFile = turtleFile;
        this.types = {};
        this.nodes = undefined;
        this.edges = undefined;
        this.jsonData = {};
        this.turtleData = [];
        this.dataset_id = this.processDatasetId();
        this.store = new N3.Store();
        this.graphRoot = undefined;
        this.graph = undefined;
        this.counter = 0;
        this.tree = {
            id: this.dataset_id,
            text: this.dataset_id + ' Dataset',
            parent: true,
            items: [
                {
                    id: '1_1_1',
                    text: 'NIFTI',
                    items: [],
                },
                {
                    id: '1_1_2',
                    text: 'Volume',
                    items: [
                        {
                            id: '1_1_2_1',
                            text: 'NIFTI',
                            price: 1200,
                        },
                        {
                            id: '1_1_2_2',
                            text: 'Matlab',
                            price: 1450,
                        },
                    ],
                },
                {
                    id: '1_1_3',
                    text: 'Matlab',
                    items: [],
                },
            ],
        }
    }

    initialiseNodesEdges() {
        this.nodes = {};
        this.edges = [];
        // this.tree = {};
    }

    extractJson() {
        if (typeof this.jsonFile === 'object' && this.jsonFile !== null) {
            return this.jsonFile;
        } else {
            return JSON.parse(this.jsonFile);
        }
    }

    extractTurtle() {
        var that = this;
        return new Promise(function(resolve, reject) {
            const parser = new N3.Parser();

            let callbackParse = function (err, quad, prefixes) {
                if (quad) {
                    that.store.addQuad(quad);
                    that.turtleData.push(quad);
                }
                if (prefixes) {
                    console.log(prefixes);
                }
            }

            let prefixCallback = function (prefix, iri) {
                that.types[String(iri.id)] = {
                    "type": prefix,
                    "iri": iri
                };

                if (graphModel[prefix] !== undefined) {
                    graphModel[prefix]["key"] = iri;
                }
            }
            var quadsArray = parser.parse(that.turtleFile, callbackParse, prefixCallback);
            resolve(quadsArray);
        });
    }

    getJson() {
        return this.jsonData;
    }

    getTurtle() {
        return this.turtleData;
    }

    async getGraph() {
        //return this.graph;
        if (this.nodes === undefined || this.edges === undefined) {
            await this.processDataset();
        }
        let _links = this.edges.slice();
        let _nodes = Object.keys(this.nodes).map(key => {
            let _edges = _links.map(edge => {
                if (edge.source === key) {
                    edge.source = this.counter;
                }
                if (edge.target === key) {
                    edge.target = this.counter;
                }
                return edge;
            });
            this.nodes[key].name = this.nodes[key].label;
            this.nodes[key].ref = this.nodes[key].id;
            this.nodes[key].id = this.counter;
            this.nodes[key].img = imgs[0];
            _links = _edges;
            this.counter++;
            return this.nodes[key]
        });

        _links = _links.filter(item => !(isNaN(item.source) || isNaN(item.target)));

        let _graph = {
            nodes: _nodes,
            links: _links
        };

        return _graph;
    }

    async getTree() {
        if (this.tree === undefined) {
            await this.processDataset();
        }
        return this.tree;
    }

    getDatasetId() {
        return this.dataset_id;
    }

    async processTurtle() {
        await this.extractTurtle();
    }

    processDatasetId() {
        this.processJSON();
        return this.jsonData.data[0].dataset_id.replace('dataset:', '');
    }

    processJSON() {
        this.jsonData = this.extractJson()
    }

    mergeData() {
        console.log("to be implemented, merge data between json and turtle to create the graph (not sure is required)");
    }

    async processDataset() {
        this.initialiseNodesEdges()
        await this.processTurtle();
        this.processJSON();
        this.create_graph();
        console.log("let s check the graph!!!!");
    }

    get_type(quad) {
        if (quad.predicate.id === graphModel.type_key) {
            return quad.object.value
        } else {
            return undefined;
        }
    }

    build_node(node) {
        if (this.nodes[String(node.id)] === undefined) {
            this.nodes[String(node.id)] = {
                id: node.id,
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [],
                label: node.value,
                proxies: [],
                properties: []
            };
        }
    }

    update_node(quad, proxy) {
        // check if node to update exists in the list of nodes.
        if (this.nodes[String(quad.subject.id)] !== undefined) {
            if (quad.predicate.id === graphModel.type_key) {
                this.nodes[String(quad.subject.id)][quad.predicate.id].push({
                    predicate: quad.predicate.id,
                    type: quad.object.datatype !== undefined ? quad.object.datatype.id : quad.object.id,
                    value: quad.object.value
                })
            } else {
                this.nodes[String(quad.subject.id)].properties.push({
                    predicate: quad.predicate.id,
                    type: quad.object.datatype,
                    value: quad.object.value
                });
                if (proxy) {
                    this.nodes[String(quad.subject.id)].proxies.push(quad.object.id);
                }
            }
        } else {
            // if the node does not exist there should be referenced by a proxy inside another node.
            var found = false;
            for (const key in this.nodes) {
                if (this.nodes[key].proxies.indexOf(String(quad.subject.id)) !== -1) {
                    this.nodes[key].properties.push({
                        predicate: quad.predicate.id,
                        type: quad.object.datatype,
                        value: quad.object.value
                    });
                    this.nodes[key].proxies.push(quad.object.id);
                    found = true;
                }
            }
            if (found) {
                console.log("Houston, we have a problem!");
            }
        }
    }

    link_nodes(quad) {
        if (this.nodes[String(quad.object.id)] !== undefined) {
            this.edges.push({
                source: quad.subject.id,
                target: quad.object.id
            })
        } else {
            this.update_node(quad, true);
        }
    }

    create_graph() {
        for (const node of this.store.getSubjects()) {
            if (!N3.Util.isBlankNode(node)) {
                this.build_node(node);
            }
        }

        for (const quad of this.turtleData) {
            if (N3.Util.isLiteral(quad.object) || quad.predicate.id === graphModel.type_key) {
                // The object does not represent a node on his own but rather a property of the existing subject
                this.update_node(quad, false);
            } else {
                // I don't know yet what to do with this node
                this.link_nodes(quad);
            }
        }
    }
}

export default Splinter
