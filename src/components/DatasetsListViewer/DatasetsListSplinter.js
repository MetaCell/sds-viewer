import NodesFactory from './../../utils/nodesFactory';

import {
    rdfTypes,
    type_key,
    typesModel
} from './../../utils/graphModel';

const N3 = require('n3');

const TMP_FILE = ".tmp";

class Splinter {
    constructor(jsonFile, turtleFile) {
        this.factory = new NodesFactory();
        this.turtleFile = turtleFile;
        this.types = {};
        this.levelsMap = {};
        this.turtleData = [];
        this.tree = undefined;
        this.nodes = undefined;
        this.edges = undefined;
        this.root_id = undefined;
        this.proxies_map = undefined;
        this.forced_nodes = undefined;
        this.store = new N3.Store();
    }

    /* Initialise global maps before to start data manipulation */
    initialiseNodesEdges() {
        this.edges = [];
        this.nodes = new Map();
        this.proxies_map = new Map();
    }

    extractTurtle() {
        var that = this;
        return new Promise(function(resolve, reject) {
            const parser = new N3.Parser();

            let callbackParse = function (err, quad, prefixes) {
                if (quad) {
                    that.store.addQuad(quad);
                    that.turtleData.push(quad);
                } else {
                    resolve(that.turtleData);
                }
            }

            const prefixCallback = function (prefix, iri) {
                that.types[String(prefix)] = {
                    "type": prefix,
                    "iri": iri
                };
            };
            parser.parse(that.turtleFile, callbackParse, prefixCallback);
        });
    }

    getTurtle() {
        return this.turtleData;
    }


    async getGraph() {
        if (this.nodes === undefined || this.edges === undefined) {
            await this.processDataset();
        }

        return {
            nodes: this.forced_nodes
        };
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

    /* Entry point for the whole conversion and graph/tree creation */
    async processDataset() {
        this.initialiseNodesEdges()
        await this.processTurtle();
        this.create_graph();
        this.mergeData();
        this.generateData()
    }


    /* Creates a map of types that will be used by the graphModel.js in order to extract values from each type */
    get_type(node) {
        const typeFound = {
            type: typesModel.unknown.type,
            length: 0
        }
        for (const type of node?.types) {
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
        const graph_node = this.nodes.get(node.id);
        if (graph_node) {
            console.error("Issue with the build node, this node is already present");
            console.error(node);
        } else {
            this.nodes.set(node.id, {
                id: node.id,
                attributes: {},
                types: [],
                name: node.value,
                proxies: [],
                properties: [],
                tree_reference: null,
                children_counter: 0
            });
        }
    }


    update_node(quad, proxy) {
        // check if the node is blank
        if (N3.Util.isBlankNode(quad.subject)) {
            return;
        }
        let graph_node = this.nodes.get(quad.subject.id);
        // check if node to update exists in the list of nodes.
        if (graph_node) {
            if (quad.predicate.id === type_key) {
                graph_node.types = [...graph_node.types, {
                    predicate: quad.predicate.id,
                    type: quad.object.datatype ? quad.object.datatype.id : quad.object.id,
                    value: quad.object.value
                }];
                this.nodes.set(quad.subject.id, graph_node);
            } else {
                graph_node.properties = [...graph_node.properties, {
                    predicate: quad.predicate.id,
                    type: quad.object.datatype ? quad.object.datatype.id : quad.object.id,
                    value: quad.object.value
                }];
                if (proxy) {
                    graph_node.proxies = [...graph_node.proxies, quad.object.id];
                    this.proxies_map.set(quad.object.id, quad.subject.id);
                }
                this.nodes.set(quad.subject.id, graph_node);
            }
        } else {
            // if the node does not exist there should be referenced by a proxy inside another node.
            var found = true;
            this.nodes.forEach((value, key) => {
                if (value.proxies.indexOf(String(quad.subject.id)) !== -1) {
                    value.properties = [...value.properties, {
                        predicate: quad.predicate.id,
                        type: quad.object.datatype,
                        value: quad.object.value
                    }];
                    value.proxies = [...value.proxies, quad.object.id];
                    this.proxies_map.set(quad.object.id, key);
                    this.nodes.set(key, value);
                    found = false;
                }
            });
            if (found) {
                // if we end up here it means we have a node with links to ids or proxy, so we do not know
                // where this node should go.
                console.error("Houston, we have a problem!");
                console.error(quad);
            }
        }
    }


    link_nodes(quad) {
        // before to create the node check that:
        // 1. subject and object are nodes in our graph
        // 2. we are not self referencing the node with a property that we don't need
        const source = this.nodes.get(quad.subject.id);
        const target = this.nodes.get(quad.object.id);
        if (source && target && (quad.subject.id !== quad.object.id)) {
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
        this.nodes.forEach((value, key) => {
            value.type = this.get_type(value);
            const typedNode = this.factory.createNode(value, this.types);
            if (typedNode.type !== rdfTypes.Unknown.key) {
                this.nodes.set(key, typedNode);
            } else {
                this.nodes.delete(key);
                this.edges = this.edges.filter(link => {
                    if (link.source !== key && link.target !== key) {
                        return true;
                    }
                    return false;
                })
            }
            if (value.type === typesModel.NamedIndividual.dataset.type) {
                dataset_node = value;
            }
            if (value.type === typesModel.ontology.type) {
                ontology_node = value;
            }
        });
        // save the dataset id used for the uri_api later with the tree
        this.root_id = dataset_node.id;
        // merge the 2 nodes together
        dataset_node.properties = dataset_node.properties.concat(ontology_node.properties);
        dataset_node.proxies = dataset_node.proxies.concat(ontology_node.proxies);
        dataset_node.level = 1;
        this.nodes.set(dataset_node.id, dataset_node);
        this.nodes.delete(ontology_node.id);
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
        return dataset_node;
    }

    organise_nodes(parent) {
        // structure the graph per category
        const id = parent.id;

        this.forced_edges = this.edges.filter(link => {
            if ((link.target === link.source)
            || (this.nodes.get(link.source).level === this.nodes.get(link.target).level)) {
                return false;
            }
            return true;
        }).map(link => {
            if (link.target === id) {
                var temp = link.target;
                link.target = link.source;
                link.source = temp;
            }
            let source_node = this.nodes.get(link.source);
            source_node.children_counter++;
            this.nodes.set(source_node.id, source_node);
            return link;
        }).filter(link => {
            let target_node = this.nodes.get(link.target);
            if (target_node.type === rdfTypes.Dataset.key){
                return true;
            }
            return false;
        });
    }

    identify_childless_parents() {
        this.forced_nodes.forEach((node, index, array) => {
            if ((node.type === rdfTypes.Sample.key || node.type === rdfTypes.Subject.key) && (node.children_counter === 0)) {
                node.img.src = "./images/graph/question_mark.svg"
            }
        });
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
            if (N3.Util.isLiteral(quad.object) || quad.predicate.id === type_key) {
                // The object does not represent a node on his own but rather a property of the existing subject
                this.update_node(quad, false);
            } else {
                // I don't know yet what to do with this node
                this.link_nodes(quad);
            }
        }


        let dataset_node = this.cast_nodes();
        this.organise_nodes(dataset_node);
    }

    /**
     * Exclude certain nodes
     * @param {*} node
     * @returns
     */
    filterNode = (node) => {
        return node.basename.includes(TMP_FILE)
    }


    mergeData() {
        this.nodes.forEach((value, key) => {
            if (value.attributes !== undefined && value.attributes.hasFolderAboutIt !== undefined) {
                const children = this.tree_parents_map.get(this.tree_map.get(value.attributes.hasFolderAboutIt[0])?.remote_id);
                children?.forEach(child => {
                    !this.filterNode(child) && this.linkToNode(child, value);
                });
            }
        });
    }


    linkToNode(node, parent) {
        let level = parent.level;
        if (parent.type === rdfTypes.Sample.key) {
            if (parent.attributes.derivedFrom !== undefined) {
                level = this.nodes.get(parent.attributes.derivedFrom[0]).level + 1;
            }
        }
        parent.children_counter++;
        const new_node = this.buildNodeFromJson(node, level);
        new_node.parent = parent;
        this.forced_edges.push({
            source: parent.id,
            target: new_node.id
        });
        this.nodes.set(new_node.id, this.factory.createNode(new_node));
        var children = this.tree_parents_map.get(node.remote_id);
        if (children?.length > 0) {
            children.forEach(child => {
                !this.filterNode(child) && this.linkToNode(child, new_node);
            });
        }
    }


    buildNodeFromJson(item, level) {
        const node_id = this.proxies_map.get(item.uri_api);
        if (node_id) {
            return this.nodes.get(node_id);
        }
        const new_node = {
            id: item.uri_api,
            level: level + 1,
            attributes: {
                identifier: item.basename,
                relativePath: item.dataset_relative_path,
                size: item.size_bytes,
                mimetype: item.mimetype,
                updated: item.timestamp_updated,
                status: item.status,
            },
            types: [],
            name: item.basename,
            proxies: [],
            properties: [],
            type: item.mimetype === "inode/directory" ? "Collection" : "File",
            tree_reference: null,
            children_counter: 0
        };
        return this.factory.createNode(new_node, []);
    }


    generateData() {
        this.forced_nodes = Array.from(this.nodes).map(([key, value]) => {
                value.proxies.every(proxy => {
                    return true;
                })
            
            return value;
        })
    }

    build_leaf(node, parent) {
        var newChild = this.generateLeaf(node, parent);
        parent.items.push(newChild);

        var children = this.tree_parents_map.get(node.remote_id);
        this.tree_parents_map.delete(node.remote_id);
        if (children) {
            children.forEach(child => {
                this.build_leaf(child, newChild);
            });
        }
    }

    generateLeaf(node, parent) {
        node.id = node.uri_api
        node.parent = true;
        node.text = parent !== undefined ? node.basename : this.dataset_id;
        node.type = node.mimetype === "inode/directory" ? rdfTypes.Collection.key : rdfTypes.File.key;
        node.path = (parent !== undefined && parent.path !== undefined) ? [node.id, ...parent.path] : [node.id];
        if (!node.items) {
            node.items = [];
        }
        node.graph_reference = this.findReference(node.uri_api);
        this.tree_map.set(node.id, node);
        const newNode = {
            id: node.uri_api,
            text: node.text,
            items: node.items,
            graph_reference: node?.graph_reference?.id,
            path: node.path
        }
        return newNode;
    }

    findReference(id) {
        var reference = this.nodes.get(id);
        if (reference === undefined) {
            this.nodes.forEach((value, key) => {
                if (value.proxies.indexOf(String(id)) !== -1) {
                    reference = value;
                }
            });
        }
        return reference;
    }
}

export default Splinter;
