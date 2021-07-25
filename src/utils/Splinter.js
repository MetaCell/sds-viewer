const N3 = require('n3');
const graphModel = require("./graphModel.json");
const imgs = ['dataset.svg', 'nifti.svg', 'volume.svg']

class Splinter {
    constructor(jsonFile, turtleFile) {
        this.jsonFile = jsonFile;
        this.turtleFile = turtleFile;
        this.types = {};
        this.nodes = {};
        this.edges = [];
        this.jsonData = {};
        this.turtleData = [];
        this.dataset_id = this.processDatasetId();
        this.store = new N3.Store();
        this.graphRoot = undefined;
        const imgs = ['dataset.svg', 'nifti.svg', 'volume.svg'].map(src => {
            const img = new Image();
            img.src = `./images/${src}`;
            console.log("Image source ", img.src);
            return img;
        });
        this.graph = {
            nodes: [
                { id: 1 , name : "Dataset", img : imgs[0], level : 1 },
                { id: 2 , name : " Subject 2", img : imgs[1], level : 2 },
                { id: 3 , name : "Subject 3", img : imgs[1], level : 2 },
                { id: 4 , name : "Subject 4", img : imgs[1], level : 3 },
                { id: 5 , name : "Subject 5", img : imgs[1], level : 3 },
                { id: 6 , name : "File 1", img : imgs[1], level : 3 },
                { id: 7 , name : "File 2", img : imgs[1], level : 3 },
                { id: 8 , name : "File 3", img : imgs[1], level : 4 },
                { id: 9 , name : "File 4", img : imgs[1], level : 4 }
            ],
            links: [
                { source: 1, target: 2},
                { source: 1, target: 3},
                { source: 2, target: 4},
                { source: 2, target: 5},
                { source: 4, target: 8},
                { source: 4, target: 9},
                { source: 3, target: 6},
                { source: 3, target: 7}
            ]
        };
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
        this.processDataset();
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

    getGraph() {
        return this.graph;
    }

    getTree() {
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
                startNode: quad.subject.id,
                endNode: quad.object.id
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

module.exports = Splinter
