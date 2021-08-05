import NodesFactory from './nodesFactory';
import { rdfTypes, type_key, typesModel } from './graphModel';

const N3 = require('n3');

class Splinter {
    constructor(jsonFile, turtleFile) {
        this.jsonFile = jsonFile;
        this.turtleFile = turtleFile;
        this.types = {};
        this.tree_map = undefined;
        this.tree_parents_map = undefined;
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
        this.tree_map = new Map();
        this.tree_parents_map = new Map();
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
        this.create_tree();
    }


    get_type(node) {
        let typeFound = {
            type: typesModel.unknown.type,
            length: 0
        }
        for (const type of node.types) {
            if (type.type === this.types.owl.iri.id + "NamedIndividual") {
                for (const rdfType in this.types) {
                    if ((node.id.includes(this.types[rdfType].iri.id)) && (this.types[rdfType].iri.id.length > typeFound.length) && (typesModel.NamedIndividual[String(this.types[rdfType].type)] !== undefined)) {
                        typeFound.type = typesModel.NamedIndividual[String(this.types[rdfType].type)].type;
                        typeFound.length = this.types[rdfType].iri.id.length;
                    }
                }
            } else if (type.type === this.types.owl.iri.id + "Ontology") {
                typeFound.type = typesModel.ontology.type;
                typeFound.length = typesModel.ontology.length;
            } else if ((type.type.includes(this.types.sparc.iri.id)) && (typesModel.sparc[type.type.split(this.types.sparc.iri.id).pop()] !== undefined)) {
                let sparcType = type.type.split(this.types.sparc.iri.id).pop();
                typeFound.type = typesModel.sparc[sparcType].type;
                typeFound.length = typesModel.sparc[sparcType].length;
            }
        }
        return typeFound.type;
    }


    build_node(node) {
        if (this.nodes[String(node.id)] === undefined) {
            this.nodes[String(node.id)] = {
                id: node.id,
                attributes: {},
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
        if (this.nodes[String(quad.subject.id)]) {
            if (quad.predicate.id === type_key) {
                this.nodes[String(quad.subject.id)].types.push({
                    predicate: quad.predicate.id,
                    type: quad.object.datatype ? quad.object.datatype.id : quad.object.id,
                    value: quad.object.value
                });
            } else {
                this.nodes[String(quad.subject.id)].properties.push({
                    predicate: quad.predicate.id,
                    type: quad.object.datatype ? quad.object.datatype.id : quad.object.id,
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
            });
            this.update_node(quad, false);
        } else {
            // if the conditions above are not satisfied we push this relationship as a proxy of another node already present
            this.update_node(quad, true);
        }
    }


    cast_nodes() {
        // prepare 2 place holders for the dataset and ontology node, the ontology node is not required but
        // we might need to display some of its properties, so we merge them.
        let dataset_node = undefined;
        let ontology_node = undefined;

        // cast each node to the right type, also keep trace of the dataset and ontology nodes.
        var factory = new NodesFactory();
        for(const key in this.nodes) {
            this.nodes[key].type = this.get_type(this.nodes[key]);
            this.nodes[key] = factory.createNode(this.nodes[key], this.types);
            if (this.nodes[key].type === typesModel.NamedIndividual.dataset.type) {
                dataset_node = this.nodes[key];
            }
            if (this.nodes[key].type === typesModel.ontology.type) {
                ontology_node = this.nodes[key];
            }
        }

        // merge the 2 nodes together
        this.nodes[String(dataset_node.id)].properties = this.nodes[String(dataset_node.id)].properties.concat(ontology_node.properties)
        this.nodes[String(dataset_node.id)].proxies = this.nodes[String(dataset_node.id)].proxies.concat(ontology_node.proxies)
        // the below might create a conflict since there might be only a single type
        //this.nodes[String(dataset_node.id)].types = this.nodes[String(dataset_node.id)].types.concat(ontology_node.types)
        this.nodes[String(dataset_node.id)].level = 1;
        delete this.nodes[String(ontology_node.id)];
        // fix links that were pointing to the ontology
        let temp_edges = this.edges.map(link => {
            if (link.source === ontology_node.id) {
                link.source = dataset_node.id
            }
            if (link.target === ontology_node.id) {
                link.target = dataset_node.id
            }
            return link;
        })
        this.edges = temp_edges;
        return dataset_node.id;
    }


    organise_nodes(id) {
        // structure the graph per category
        var factory = new NodesFactory();
        const subject_key = "all_subjects";
        const protocols_key = "all_protocols";
        const contributors_key = "all_contributors";
        let subjects = {
            id: subject_key,
            name: "Subjects",
            type: typesModel.NamedIndividual.subject.type,
            properties: [],
            level: 2
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
            id: protocols_key,
            name: "Protocols",
            type: typesModel.sparc.Protocol.type,
            properties: [],
            level: 2
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
            id: contributors_key,
            name: "Contributors",
            type: typesModel.NamedIndividual.contributor.type,
            properties: [],
            level: 2
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

        this.forced_edges = this.edges.filter(link => {
            if ((link.target === id)
            || (link.target === link.source)
            || (this.nodes[link.source].level === this.nodes[link.target].level)) {
                return false;
            }
            return true;
        }).map(link => {
            if (link.source === id && link.target !== subject_key && this.nodes[link.target].type === rdfTypes.Subject.key) {
                link.source = subject_key;
                this.nodes[link.target].level = this.nodes[subject_key].level + 1;
            } else if (link.source === id && link.target !== contributors_key && this.nodes[link.target].type === rdfTypes.Person.key) {
                link.source = contributors_key;
                this.nodes[link.target].level = this.nodes[contributors_key].level + 1;
            } else if (link.source === id && link.target !== protocols_key && this.nodes[link.target].type === rdfTypes.Protocol.key) {
                link.source = protocols_key;
                this.nodes[link.target].level = this.nodes[protocols_key].level + 1;
            }
            return link;
        }).filter(link => {
            if ((link.source === id && (link.target !== contributors_key && link.target !== subject_key && link.target !== protocols_key))) {
                return false;
            }
            return true;
        });

        // TO FIX: the factory is ran twice for the groups nodes created since the img is not generated for them
        // either we generate the image when we do the node
        
        this.forced_nodes = Object.keys(this.nodes).map(key => {

            return factory.createNode(this.nodes[key], this.types);
        });
        this.fix_links();
    }


    fix_links() {
        for (const node of this.forced_nodes) {
            // loop all the samples
            if (node.type === rdfTypes.Sample.key) {
                if (node.attributes.derivedFrom !== undefined) {
                    node.level = this.nodes[node.attributes.derivedFrom].level + 1;
                    this.forced_edges.push({
                        source: node.attributes.derivedFrom,
                        target: node.id
                    });
                }
            }
        }
    }


    create_graph() {
        // build nodes out of the subjects
        for (const node of this.store.getSubjects()) {
            if (!N3.Util.isBlankNode(node)) {
                this.build_node(node);
            }
        }

        // consume all the other nodes that will contain mainly literals/properties of the subject nodes
        for (const [index, quad] of this.turtleData.entries()) {
            if (index === 169) {
                console.log("test");
            }
            if (N3.Util.isLiteral(quad.object) || quad.predicate.id === type_key) {
                // The object does not represent a node on his own but rather a property of the existing subject
                this.update_node(quad, false);
            } else {
                // I don't know yet what to do with this node
                this.link_nodes(quad);
            }
        }

        let dataset_node_id = this.cast_nodes();
        this.organise_nodes(dataset_node_id);
        console.log("test output");
    }


    create_tree() {
        for (const leaf of this.jsonData.data) {
            // TODO: the reference to the graph node should be added at this point since once
            // we push the object inside the map then we would not want to manipulate it again.
            this.tree_map.set(leaf.uri_api, leaf);
            let children = this.tree_parents_map.get(leaf.parent_id);
            if (children) {
                this.tree_parents_map.set(leaf.parent_id, [...children, leaf]);
            } else {
                this.tree_parents_map.set(leaf.parent_id, [leaf]);
            }
        }
        console.log("just a test");
    }
}

export default Splinter;
