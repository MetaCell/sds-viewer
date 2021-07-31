import NodesFactory from './nodesFactory';
import { graphModel, type_key } from './graphModel';

const N3 = require('n3');
const imgs = ['dataset.svg', 'nifti.svg', 'volume.svg'].map(src => {
    const img = new Image();
    img.src = `./images/${src}`;
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
        this.forced_edges = undefined;
        this.forced_nodes = undefined;
        this.jsonData = {};
        this.turtleData = [];
        this.dataset_id = this.processDatasetId();
        this.store = new N3.Store();
        // Temporary data
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
            }

            let prefixCallback = function (prefix, iri) {
                that.types[String(prefix)] = {
                    "type": prefix,
                    "iri": iri
                };
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
        if (this.nodes === undefined || this.edges === undefined) {
            await this.processDataset();
        }

        let _graph = {
            nodes: this.forced_nodes,
            links: this.forced_edges
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
    }


    get_type(quad) {
        if (quad.predicate.id === type_key) {
            return quad.object.value
        } else {
            return undefined;
        }
    }


    build_node(node) {
        if (this.nodes[String(node.id)] === undefined) {
            let type = 
            this.nodes[String(node.id)] = {
                id: node.id,
                types: [],
                name: node.value,
                proxies: [],
                properties: []
            };
        } else {
            console.log("Issue with the build node, this node is already present");
            console.log(node);
        }
    }


    update_node(quad, proxy) {
        // check if the node is blank
        if (N3.Util.isBlankNode(quad.subject)) {
            return;
        }
        // check if node to update exists in the list of nodes.
        if (this.nodes[String(quad.subject.id)] !== undefined) {
            if (quad.predicate.id === type_key) {
                this.nodes[String(quad.subject.id)].types.push({
                    predicate: quad.predicate.id,
                    type: quad.object.datatype !== undefined ? quad.object.datatype.id : quad.object.id,
                    value: quad.object.value
                });
            } else {
                this.nodes[String(quad.subject.id)].properties.push({
                    predicate: quad.predicate.id,
                    type: quad.object.datatype !== undefined ? quad.object.datatype.id : quad.object.id,
                    value: quad.object.value
                });
                if (proxy) {
                    this.nodes[String(quad.subject.id)].proxies.push(quad.object.id);
                }
            }
        } else {
            // if the node does not exist there should be referenced by a proxy inside another node.
            var found = true;
            for (const key in this.nodes) {
                if (this.nodes[key].proxies.indexOf(String(quad.subject.id)) !== -1) {
                    this.nodes[key].properties.push({
                        predicate: quad.predicate.id,
                        type: quad.object.datatype,
                        value: quad.object.value
                    });
                    this.nodes[key].proxies.push(quad.object.id);
                    found = false;
                }
            }
            if (found) {
                console.log("Houston, we have a problem!");
                console.log(quad);
            }
        }
    }


    link_nodes(quad) {
        // before to create the node check that:
        // 1. subject and object are nodes in our graph
        // 2. we are not self referencing the node with a property that we don't need
        if ((this.nodes[String(quad.object.id)] !== undefined) && (this.nodes[String(quad.subject.id)] !== undefined) && (quad.subject.id !== quad.object.id)) {
            this.edges.push({
                source: quad.subject.id,
                target: quad.object.id
            })
        } else {
            // if the conditions above are not satisfied we push this relationship as a proxy of another node already present
            this.update_node(quad, true);
        }
    }


    merge_ontology_dataset() {
        // As per title, ontology node is required so we merge this with the dataset node
        let dataset_node = undefined;
        let ontology_node = undefined;

        Object.keys(this.nodes).map(key => {
            this.nodes[key].img = imgs[0];
            for (const type of this.nodes[key].types) {
                if (type.type === graphModel.ontology.key) {
                    ontology_node = this.nodes[key];
                    break;
                }
                if (type.type === this.types.sparc.iri.id + graphModel.dataset.key) {
                    dataset_node = this.nodes[key];
                    break;
                }
            }
        });

        // merge the 2 nodes together
        this.nodes[String(dataset_node.id)].properties = this.nodes[String(dataset_node.id)].properties.concat(ontology_node.properties)
        this.nodes[String(dataset_node.id)].proxies = this.nodes[String(dataset_node.id)].proxies.concat(ontology_node.proxies)
        // the below might create a conflict since there might be only a single type 
        //this.nodes[String(dataset_node.id)].types = this.nodes[String(dataset_node.id)].types.concat(ontology_node.types)
        this.nodes[String(dataset_node.id)].level = 1;
        delete this.nodes[String(ontology_node.id)];
        // fix links that were pointing to the ontology
        this.edges.map(link => {
            if (link.source === ontology_node.id) {
                link.source = dataset_node.id
            }
            if (link.target === ontology_node.id) {
                link.target = dataset_node.id
            }
            return link;
        })
        return dataset_node.id;
    }


    organise_nodes(id) {
        // structure the graph per category
        let subjects = {
            id: "all_subjects",
            name: "Subjects",
            level: 2,
            img: () => {
                const img = new Image();
                img.src = graphModel.subject.image;
                return img;
            }
        };
        if (this.nodes[subjects.id] === undefined) {
            this.nodes[String(subjects.id)] = subjects;
            this.edges.push({
                source: id,
                target: subjects.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

        let protocols = {
            id: "all_protocols",
            name: "Protocols",
            level: 2,
            img: () => {
                const img = new Image();
                img.src = graphModel.protocol.image;
                return img;
            }
        };
        if (this.nodes[protocols.id] === undefined) {
            this.nodes[String(protocols.id)] = protocols;
            this.edges.push({
                source: id,
                target: protocols.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

        let contributors = {
            id: "all_contributors",
            name: "Contributors",
            level: 2,
            img: () => {
                const img = new Image();
                img.src = graphModel.contributor.image;
                return img;
            }
        };
        if (this.nodes[contributors.id] === undefined) {
            this.nodes[String(contributors.id)] = contributors;
            this.edges.push({
                source: id,
                target: contributors.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

        var factory = new NodesFactory();
        // cast all the nodes to the correct type
        this.forced_nodes = Object.keys(this.nodes).map(key => {
            this.nodes[key].img = imgs[0];
            for (const type of this.nodes[key].types) {
                for (const _class in graphModel) {
                    if (type.type === this.types.sparc.iri.id + graphModel[_class].type) {
                        this.fix_links(this.nodes[key], type.type);
                        return factory.createNode(this.nodes[key], type.type);
                    }
                }
            }
            return factory.createNode(this.nodes[key], "Unknown");
        });
        this.forced_edges = this.edges;
    }


    fix_links() {

    }


    create_graph() {
        // build nodes out of the subjects
        for (const node of this.store.getSubjects()) {
            if (!N3.Util.isBlankNode(node)) {
                this.build_node(node);
            }
        }

        // consume all the other nodes that will contain mainly literals/properties of the subject nodes
        for (const quad of this.turtleData) {
            if (N3.Util.isLiteral(quad.object) || quad.predicate.id === type_key) {
                // The object does not represent a node on his own but rather a property of the existing subject
                this.update_node(quad, false);
            } else {
                // I don't know yet what to do with this node
                this.link_nodes(quad);
            }
        }

        this.forced_nodes = Object.keys(this.nodes).map(key => {
            this.nodes[key].img = imgs[0];
            return this.nodes[key];
        });

        let dataset_node_id = this.merge_ontology_dataset();
        this.organise_nodes(dataset_node_id);
        console.log("ho finito con il graph");
    }
}

export default Splinter;
