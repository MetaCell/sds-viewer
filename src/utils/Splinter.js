import NodesFactory from './nodesFactory';
import { rdfTypes, type_key, typesModel } from './graphModel';

const N3 = require('n3');
const TMP_FILE = ".tmp";

class Splinter {
    constructor(jsonFile, turtleFile) {
        this.factory = new NodesFactory();
        this.jsonFile = jsonFile;
        this.turtleFile = turtleFile;
        this.types = {};
        this.tree = undefined;
        this.tree_map = undefined;
        this.tree_parents_map = undefined;
        this.nodes = undefined;
        this.edges = undefined;
        this.root_id = undefined;
        this.forced_edges = undefined;
        this.forced_nodes = undefined;
        this.proxies_map = undefined;
        this.jsonData = {};
        this.turtleData = [];
        this.dataset_id = this.processDatasetId();
        this.store = new N3.Store();
    }


    initialiseNodesEdges() {
        this.edges = [];
        this.nodes = new Map();
        this.tree_map = new Map();
        this.tree_parents_map = new Map();
        this.proxies_map = new Map();
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

            const prefixCallback = function (prefix, iri) {
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

        let self = this;
        // Assign neighbors, to highlight links
        this.forced_edges.forEach(link => {
            const a = self.forced_nodes.find( node => node.id === link.source );
            const b = self.forced_nodes.find( node => node.id === link.target );
            !a.neighbors && (a.neighbors = []);
            !b.neighbors && (b.neighbors = []);
            a.neighbors.push(b);
            b.neighbors.push(a);
      
            !a.links && (a.links = []);
            !b.links && (b.links = []);
            a.links.push(link);
            b.links.push(link);
          });

        return {
            nodes: this.forced_nodes,
            links: this.forced_edges
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


    processDatasetId() {
        this.processJSON();
        return this.jsonData.data[0].dataset_id.replace('dataset:', '');
    }


    processJSON() {
        this.jsonData = this.extractJson()
    }


    async processDataset() {
        this.initialiseNodesEdges()
        await this.processTurtle();
        this.processJSON();
        this.create_graph();
        this.create_tree();
        this.mergeData();
        this.generateData()
    }


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
                tree_reference: null
            })
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
        return dataset_node.id;
    }


    organise_nodes(id) {
        // structure the graph per category
        const subject_key = "all_subjects";
        const protocols_key = "all_protocols";
        const contributors_key = "all_contributors";
        const subjects = {
            id: subject_key,
            name: "Subjects",
            type: typesModel.NamedIndividual.subject.type,
            properties: [],
            proxies: [],
            level: 2
        };
        if (this.nodes.get(subject_key) === undefined) {
            this.nodes.set(subject_key, subjects);
            this.edges.push({
                source: id,
                target: subjects.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

        const protocols = {
            id: protocols_key,
            name: "Protocols",
            type: typesModel.sparc.Protocol.type,
            properties: [],
            proxies: [],
            level: 2
        };
        if (this.nodes.get(protocols_key) ===  undefined) {
            this.nodes.set(protocols_key, protocols);
            this.edges.push({
                source: id,
                target: protocols.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

        const contributors = {
            id: contributors_key,
            name: "Contributors",
            type: typesModel.NamedIndividual.contributor.type,
            properties: [],
            proxies: [],
            level: 2
        };
        if (this.nodes.get(contributors_key) === undefined) {
            this.nodes.set(contributors_key, contributors);
            this.edges.push({
                source: id,
                target: contributors.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

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
            let target_node = this.nodes.get(link.target);
            if (link.source === id && link.target !== subject_key && target_node.type === rdfTypes.Subject.key) {
                link.source = subject_key;
                target_node.level = subjects.level + 1;
                this.nodes.set(target_node.id, target_node);
            } else if (link.source === id && link.target !== contributors_key && target_node.type === rdfTypes.Person.key) {
                link.source = contributors_key;
                target_node.level = contributors.level + 1;
                this.nodes.set(target_node.id, target_node);
            } else if (link.source === id && link.target !== protocols_key && target_node.type === rdfTypes.Protocol.key) {
                link.source = protocols_key;
                target_node.level = protocols.level + 1;
                this.nodes.set(target_node.id, target_node);
            } 
            return link;
        }).filter(link => {
            let target_node = this.nodes.get(link.target);
            if ((link.source === id && (target_node.type !== rdfTypes.Award.key) && (link.target !== contributors_key && link.target !== subject_key && link.target !== protocols_key))) {
                return false;
            }
            return true;
        });
        // TODO: move this along with the tree generation since they needs kind of together to link the nodes.
    }


    fix_links() {
        this.forced_nodes.forEach((node, index, array) => {
            if (node.type === rdfTypes.Sample.key) {
                if (node.attributes.derivedFrom !== undefined) {
                    array[index].level = this.nodes.get(node.attributes.derivedFrom).level + 1;
                    this.forced_edges.push({
                        source: node.attributes.derivedFrom,
                        target: node.id
                    });
                }
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

        let dataset_node_id = this.cast_nodes();
        this.organise_nodes(dataset_node_id);
    }


    create_tree() {
        for (const leaf of this.jsonData.data) {
            // TODO: the reference to the graph node should be added at this point since once
            // we push the object inside the map then we would not want to manipulate it again.
            this.tree_map.set(leaf.uri_api, leaf);
            // Fix the fact that the dataset node states that its parent is itself.
            if (leaf.parent_id === leaf.remote_id) {
                continue;
            }
            let children = this.tree_parents_map.get(leaf.parent_id);
            if (children) {
                this.tree_parents_map.set(leaf.parent_id, [...children, leaf]);
            } else {
                this.tree_parents_map.set(leaf.parent_id, [leaf]);
            }
        }
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
                const children = this.tree_parents_map.get(this.tree_map.get(value.attributes.hasFolderAboutIt).remote_id);
                children.forEach(child => {
                    !this.filterNode(child) && this.linkToNode(child, value);
                });
            }
        });
    }


    linkToNode(node, parent) {
        let level = parent.level; 
        if (parent.type === rdfTypes.Sample.key) {
         if (parent.attributes.derivedFrom !== undefined) {
            level = this.nodes.get(parent.attributes.derivedFrom).level + 1;
         }
        }
        const new_node = this.buildNodeFromJson(node, level);
        this.forced_edges.push({
            source: parent.id,
            target: new_node.id
        });
        this.nodes.set(new_node.id, new_node);
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
        };
        return this.factory.createNode(new_node, []);
    }


    generateData() {
        // generate the Graph
        this.forced_nodes = Array.from(this.nodes).map(([key, value]) => {
            let tree_node = this.tree_map.get(value.id);
            if (tree_node) {
                value.tree_reference = tree_node;
                tree_node.graph_reference = value;
                this.tree_map.set(value.id, tree_node);
            } else {
                value.proxies.every(proxy => {
                    tree_node = this.tree_map.get(proxy);
                    if (tree_node) {
                        value.tree_reference = tree_node;
                        tree_node.graph_reference = value;
                        this.tree_map.set(proxy, tree_node);
                        return false;
                    }
                    return true;
                })
            }
            return this.factory.createNode(value, this.types);
        })

        this.fix_links();

        var tree_root = this.tree_map.get(this.root_id);
        var children = this.tree_parents_map.get(tree_root.remote_id);
        this.tree_parents_map.delete(tree_root.remote_id);
        this.tree = {
            id: this.dataset_id,
            text: this.dataset_id + ' Dataset',
            parent: true,
            items: [
            ]
        }

        children.forEach(leaf => {
            this.build_leaf(leaf, this.tree.items);
        });
    }

    build_leaf(node, tree) {
        node.id = node.remote_id;
        node.text = node.basename;
        node.graph_reference = null;
        if (node.items === undefined) {
            node.items = [];
        }
        tree.push(node);

        var children = this.tree_parents_map.get(node.remote_id);
        if (children) {
            children.forEach(child => {
                this.build_leaf(child, node.items);
            });
        }

    }
}

export default Splinter;
