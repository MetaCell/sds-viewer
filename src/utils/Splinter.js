import NodesFactory from './nodesFactory';

import {
    rdfTypes,
    type_key,
    typesModel,
    RDF_TO_JSON_TYPES
} from './graphModel';

import config from './../config/app.json';

import {
    subject_key,
    performances_key,
    protocols_key,
    contributors_key, SUBJECTS_LEVEL, PROTOCOLS_LEVEL, CRONTRIBUTORS_LEVEL
} from '../constants';
import * as d3 from 'd3';

const N3 = require('n3');
const ttl2jsonld = require('@frogcat/ttl2jsonld').parse;

const TMP_FILE = ".tmp";

/*
 * Brief explanation of the Splinter module:
 *
 * This class is meant to take in input the json and turtle files that compose the sds datasets.
 * All the processing starts from the getGraph or getTree methods which call processDataset that does:
 *
 * # initialiseNodesEdges
 *   Initialise all the global vars, arrays and maps used to create the graph and tree.
 *
 * # processTurtle
 *   Through the library N3 it reads the turtle file to get triples of object-predicate-subject and the types.
 *
 * # processJSON
 *   Nothing fancy, just reading a json file.
 *
 * # create_graph
 *   It gets all the subjects that will be the nodes of our graph, it transform all the object as properties of the subjects,
 *   it cleans the array from empty nodes and then it calls organise_nodes() that reorganise the data per category based on the
 *   type of each node that will be casted using a factory and it arrange also the links between nodes accordingly.
 *   The factory defined in the same folder of this module, look at the code in case interested, it's quite simple.
 *
 * # create_tree
 *   It reads the json and create 2 maps, the tree_map where we keep each node by id.
 *   The second map, tree_parent_map, it is instead used to create the hierarchy since we store all the nodes by parent id, so
 *   once we get the tree root we can easily get the tree looking at the children of the root and then recursively we do the same
 *   until the children do not exists anymore in the tree_parent_map data structure, so that means we reached the end of that branch.
 *
 * # mergeData
 *   It links together the tree and the nodes of the graph, so that when we click on the graph we get the linked node on the tree
 *   and viceversa clicking on the tree. It also push some more data into the graph (the graph is generate from the turtle file)
 *   from the json file, since all the files that belongs to subjects and samples are stored in the json but we need to make them
 *   available also for the graph. This is where this operation is done.
 *
 * # generateData
 *   This is the last step where we take all the data created previously and manipulated to then create first of all the tree from
 *   the tree_parent_map. Once the tree is ready we then create the nodes for the graph and we fix the links broken at the mergeData
 *   step since some artificial nodes have been pushed into the nodes array that will be used for the graph.
 *
 */


class Splinter {
    constructor(jsonFile, turtleFile) {
        this.factory = new NodesFactory();
        this.jsonFile = jsonFile;
        this.turtleFile = turtleFile;
        this.types = {};
        this.jsonData = {};
        this.levelsMap = {};
        this.groups = {};
        this.turtleData = [];
        this.tree = undefined;
        this.nodes = undefined;
        this.edges = undefined;
        this.root_id = undefined;
        this.tree_map = undefined;
        this.proxies_map = undefined;
        this.forced_edges = undefined;
        this.forced_nodes = undefined;
        this.tree_parents_map = undefined;
        this.dataset_id = this.processDatasetId();
        this.store = new N3.Store();
        this.rdf_to_json = undefined;
        this.rdf_to_json_map = undefined;
    }

    /* Initialise global maps before to start data manipulation */
    initialiseNodesEdges() {
        this.edges = [];
        this.nodes = new Map();
        this.tree_map = new Map();
        this.proxies_map = new Map();
        this.tree_parents_map = new Map();
        this.tree_parents_map2 = new Map();
        this.rdf_to_json_map = new Map();
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

    convertRDFToJson () {
        this.rdf_to_json = ttl2jsonld(this.turtleFile);
        this.rdf_to_json['@graph'].forEach(node => {
            let found = false;
            let toTrim = '';
            if (Array.isArray(node['@type'])) {
                found = RDF_TO_JSON_TYPES.some( item => {
                    if (node['@type'].includes(item.key)) {
                        toTrim = item.toTrim;
                        return true;
                    }
                    return false;
                });
            } else {
                found = RDF_TO_JSON_TYPES.some( item => {
                    if (node['@type'] === item.key) {
                        toTrim = item.toTrim;
                        return true;
                    }
                    return false;
                });
            }
            if (found) {
                let id = this.types[toTrim].iri.id + node['@id'].replace(toTrim + ':', '');
                this.rdf_to_json_map.set(id, node);
            }
        });
    }


    getJson() {
        return this.jsonData;
    }


    getTurtle() {
        return this.turtleData;
    }

    updateLevels(n, previousLevel) {
        n?.map( node => {
            if ( node?.level > previousLevel ){
                this.updateLevels(node?.neighbors, node.level);
                node.level = node.level + 1;
            }
        });

        return;
    }

    async getGraph() {
        if (this.nodes === undefined || this.edges === undefined) {
            await this.processDataset();
        }
        let filteredNodes = [...new Set(this.forced_nodes?.filter( n => n.type !== rdfTypes.UBERON.key && n.type !== rdfTypes.Award.key && !(n.type === rdfTypes.Collection.key && n.children_counter === 0)))]
        filteredNodes = filteredNodes.filter( node => {
            if ( node.type === rdfTypes.Sample.key ) {
                if ( node.attributes.hasFolderAboutIt !== undefined ){
                    return true;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        })
        let cleanLinks = [];
        let that = this;

        // Count how many subjects each Group has
        filteredNodes?.forEach( n => {
            if ( n.type === rdfTypes.Subject.key ) {
                let keys = Object.keys(that.groups);
                keys.forEach( key => {
                    if ( n.attributes ) {
                        if ( n?.attributes[key] ) {
                            let groupKeys = Object.keys(that.groups[key]);
                            groupKeys.forEach( groupKey => {
                                const attrVal = n?.attributes[key][0];
                                const attrName = typeof attrVal === 'object' ? attrVal.value : attrVal;
                                if ( attrName === groupKey ) {
                                    const groupNodes = filteredNodes?.filter(n => n.name == groupKey);
                                    groupNodes?.forEach( groupNode => {
                                        if ( n?.id?.includes(groupNode.id) ) {
                                            groupNode.subjects += 1;
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
        })

        // Assign neighbors, to highlight links
        this.forced_edges.forEach(link => {
            // Search for existing links
            let existingLing = cleanLinks.find( l => l.source === link.source && l.target === link.target );
            if ( !existingLing ) {
                const a = this.nodes.get( link.source );
                const b = this.nodes.get( link.target );
                const awardEmpty = ( a?.type !== rdfTypes.Award.key && b?.type !== rdfTypes.Award.key );
                const collectionEmpty = ((a?.type === rdfTypes.Collection.key && a.children_counter < 1 ) || ( b?.type === rdfTypes.Collection.key && b.children_counter < 1));
                const sampleEmpty = ((a?.type === rdfTypes.Sample.key && a.children_counter < 1 ) || ( b?.type === rdfTypes.Sample.key && b.children_counter < 1))
                const sameLevels = a?.level === b?.level;
                if ( a && b && awardEmpty && !collectionEmpty && !sampleEmpty && !sameLevels) {
                    !a.neighbors && (a.neighbors = []);
                    !b.neighbors && (b.neighbors = []);
                    if ( !a.neighbors.find( n => n.id === b.id )){
                        a.neighbors.push(b);
                    }
                    if ( !b.neighbors.find( n => n.id === a.id )){
                        b.neighbors.push(a);
                    }
                    
                    !a.links && (a.links = []);
                    !b.links && (b.links = []);
                    a.links.push(link);
                    b.links.push(link);
                    if ( !link.source.id ) {
                        link.source = this.nodes.get(link.source)
                    }
        
                    if ( !link.target.id ) {
                        link.target = this.nodes.get(link.target)
                    }
                    cleanLinks.push(link);
                }
            }
        });

        let newCleanLinks = cleanLinks.filter(link => {

            const collectionEmpty = ((link?.target?.type === rdfTypes.Collection.key && link?.target?.neighbors?.length <= 1 ) || ( link?.source?.type === rdfTypes.Collection.key && link?.source?.neighbors?.length <= 1));
            if ( collectionEmpty ) {
                return false;
            }
            return true;
        });

        // After computing links, add link information to subject and sample attributes
        this.nodes.forEach((n, k) => {
            if (n.type === rdfTypes.Subject.key || n.type === rdfTypes.Sample.key) {
                const attrs = n.attributes || {};
                Object.keys(attrs).forEach(attr => {
                    const arr = attrs[attr];
                    if (Array.isArray(arr)) {
                        attrs[attr] = arr.map(a => typeof a === 'object' ? a : that.replaceNode(a));
                    }
                });
                this.nodes.set(k, n);
            }
        });

        return {
            nodes: filteredNodes,
            links: newCleanLinks,
            levelsMap : this.levelsMap
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


    /* Entry point for the whole conversion and graph/tree creation */
    async processDataset() {
        this.initialiseNodesEdges()
        await this.processTurtle();
        this.convertRDFToJson();
        this.processJSON();
        this.create_graph();
        this.create_tree();
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
            } if (type.type === this.types.owl.iri.id + "Class") {
                for (const rdfType in this.types) {
                    if ((node.id.includes(this.types[rdfType].iri.id)) && (this.types[rdfType].iri.id.length > typeFound.length) && (typesModel.Class[String(this.types[rdfType].type)] !== undefined)) {
                        typeFound.type = typesModel.Class[String(this.types[rdfType].type)].type;
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
            } else if ( type.type.includes("/sparc/Performance")) {
                typeFound.type = typesModel.NamedIndividual.performance.type;
            } else if ( type.type.includes("/sparc/Site")) {
                typeFound.type = typesModel.NamedIndividual.site.type;
            }
        }
        return typeFound.type;
    }


    build_node(node) {
        const graph_node = this.nodes.get(node.id);
        const additional_properties = this.rdf_to_json_map.get(node.id);
        if (graph_node) {
            console.error("Issue with the build node, this node is already present");
            console.error(node);
        } else {
            this.nodes.set(node.id, {
                id: node.id,
                attributes: {publishedURI : ""},
                types: [],
                name: node.value,
                proxies: [],
                properties: [],
                tree_reference: null,
                children_counter: 0,
                collapsed: false,
                childLinks : [],
                additional_properties: additional_properties,
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

    replaceNode(a) {
        if (a && typeof a === 'object') {
            return a;
        }
        let newNode = { value: a };
        if (typeof a === 'string') {
            const node = this.nodes.get(a);
            if (node) {
                newNode = { value: a, link: node?.id };
            } else if (a.startsWith('http') || (!a.includes(' ') && a.includes(':'))) {
                newNode = { value: a, link: a };
            }
        }
        return newNode;
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
        let updatedAbout = [];
        dataset_node.level = 1;
        let that = this;
        dataset_node?.attributes?.isAbout?.forEach((a) => {
            if (
                typeof a === 'string' && (
                    a.startsWith('http') ||
                    a.includes(rdfTypes.NCBITaxon.key) ||
                    a.includes(rdfTypes.PATO.key) ||
                    a.includes(rdfTypes.UBERON.key) ||
                    a.includes(rdfTypes.RRID.key)
                )
            ) {
                updatedAbout.push(that.replaceNode(a));
            } else {
                updatedAbout.push({ value: a });
            }
        });
        dataset_node.attributes.isAbout = updatedAbout;

        let updateTechniques = [];
        dataset_node.attributes.protocolEmploysTechnique?.forEach((a) => {
            if (
                typeof a === 'string' && (
                    a.startsWith('http') ||
                    a.includes(rdfTypes.NCBITaxon.key) ||
                    a.includes(rdfTypes.PATO.key) ||
                    a.includes(rdfTypes.UBERON.key) ||
                    a.includes(rdfTypes.RRID.key)
                )
            ) {
                let node = this.nodes.get(a);
                if (node) {
                    updateTechniques.push({ value: node?.attributes?.label?.[0], link: node?.id });
                } else {
                    updateTechniques.push({ value: a, link: a });
                }
            } else {
                updateTechniques.push({ value: a });
            }
        });
        dataset_node.attributes.protocolEmploysTechnique = updateTechniques;
        this.nodes.set(dataset_node.id, dataset_node);
        this.nodes.delete(ontology_node.id);
        // fix links that were pointing to the ontology
        let temp_edges = this.edges?.map(link => {
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

    organise_subjects(target_node, link, groups, k, type){
        let parent = this.nodes.get(k);
        let keys = Object.keys(config.groups.order);
        keys.forEach(key => {
            let group = config.groups.order[key];
            if (target_node.attributes[key]?.[0]) {
                // attributes may already be objects from previous passes
                const raw = target_node.attributes[key][0];
                const originalValue = typeof raw === "object" ? raw.value : raw;

                let source = this.nodes.get(originalValue);
                let label = originalValue;
                if (source !== undefined) {
                    label = source.attributes.label[0];
                }

                const groupID = parent.id + "_" + ("" + label).replace(/\s/g, "");
                if (this.nodes.get(groupID) === undefined) {
                    const groupNode = {
                        id: groupID,
                        name: label,
                        type: typesModel.NamedIndividual.group.type,
                        properties: key,
                        parent: parent,
                        proxies: [],
                        level: parent.level + 1,
                        tree_reference: null,
                        children_counter: 0,
                        collapsed: false,
                        childLinks: [],
                        samples: 0,
                        subjects: 0,
                        publishedURI: "",
                        dataset_id: this.dataset_id
                    };
                    let nodeF = this.factory.createNode(groupNode);
                    const img = new Image();
                    img.src = group.icon;
                    nodeF.img = img;
                    this.nodes.set(groupID, nodeF);
                    groups.push({
                        source: parent.id,
                        target: nodeF.id
                    });
                    this.groups[key] ? this.groups[key][nodeF.name] = nodeF : this.groups[key] = {[nodeF.name]: nodeF};
                    parent = groupNode;
                } else {
                    parent = this.nodes.get(groupID);
                }

                // preserve the original identifier so chips can expose links
                target_node.attributes[key][0] = this.replaceNode(originalValue);

            } else {
                console.error("The group node already exists!", group.tag);
            }
        });
        link.source = parent.id;
        target_node.level = parent.level + 1;
        target_node.attributes.publishedURI = ""
        target_node.id = parent.id + target_node.name;
        target_node.parent = parent;
        target_node.childLinks = [];
        target_node.collapsed = target_node.type === type;
        this.nodes.set(target_node.id, target_node);
    }

    organise_nodes(parent) {
        // structure the graph per category
        const id = parent.id;
        const subjects = {
            id: subject_key,
            name: "Subjects",
            type: rdfTypes.Group.key,
            properties: [],
            parent : parent,
            proxies: [],
            level: SUBJECTS_LEVEL,
            tree_reference: null,
            children_counter: 0,
            collapsed : false,
            childLinks : []
        };
        if (this.nodes.get(subject_key) === undefined) {
            this.nodes.set(subject_key, this.factory.createNode(subjects, this.types));
            const img = new Image();
            img.src =  "./images/graph/group.svg";
            subjects.img = img; 
            this.edges.push({
                source: id,
                target: subjects.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

        const performances = {
            id: performances_key,
            name: "Performances",
            type: rdfTypes.Performance.key,
            properties: [],
            parent : parent,
            proxies: [],
            level: SUBJECTS_LEVEL,
            tree_reference: null,
            children_counter: 0,
            collapsed : false,
            childLinks : []
        };
        if (this.nodes.get(performances_key) === undefined) {
            this.nodes.set(performances_key, this.factory.createNode(performances, this.types));
            const img = new Image();
            img.src =  "./images/graph/group.svg";
            performances.img = img; 
            this.edges.push({
                source: id,
                target: performances.id
            })
        } else {
            console.error("The performances node already exists!");
        }

        const protocols = {
            id: protocols_key,
            name: "Protocols",
            type: typesModel.sparc.Protocol.type,
            properties: [],
            parent : parent,
            proxies: [],
            level: PROTOCOLS_LEVEL,
            tree_reference: null,
            children_counter: 0,
            collapsed : false,
            childLinks : []
        };
        if (this.nodes.get(protocols_key) ===  undefined) {
            this.nodes.set(protocols_key, this.factory.createNode(protocols));
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
            parent : parent,
            proxies: [],
            level: CRONTRIBUTORS_LEVEL,
            tree_reference: null,
            children_counter: 0,
            collapsed : false,
            childLinks : []
        };
        if (this.nodes.get(contributors_key) === undefined) {
            this.nodes.set(contributors_key, this.factory.createNode(contributors));
            this.edges.push({
                source: id,
                target: contributors.id
            })
        } else {
            console.error("The subjects node already exists!");
        }

        let groups = [];
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
                this.organise_subjects(target_node, link, groups, subject_key, typesModel.NamedIndividual.subject.type);
            } else if (link.source === id && link.target !== performances_key && target_node.type === rdfTypes.Performance.key) {
                this.organise_subjects(target_node, link, groups, performances_key, typesModel.NamedIndividual.performance.type);
            } else if (link.source === id && link.target !== contributors_key && target_node.type === rdfTypes.Person.key) {
                link.source = contributors_key;
                target_node.level = contributors.level + 1;
                target_node.parent = contributors;
                this.nodes.set(target_node.id, target_node);
            } else if (link.source === id && link.target !== protocols_key && target_node.type === rdfTypes.Protocol.key) {
                link.source = protocols_key;
                target_node.level = protocols.level + 1;
                target_node.parent = protocols;
                this.nodes.set(target_node.id, target_node);
            } else if (link.source === id && target_node.type === rdfTypes.Sample.key ) {
                const sourceId = target_node.attributes.derivedFromSample?.length ?
                    target_node.attributes.derivedFromSample[0] :
                    target_node.attributes.derivedFromSubject?.[0];
                if (sourceId) {
                    link.source = sourceId;
                }
                const parentSample = target_node.attributes.derivedFromSample?.[0] ?
                    this.nodes.get(target_node.attributes.derivedFromSample[0]) : undefined;
                if (parentSample) {
                    target_node.level = parentSample.level + 1;
                    target_node.parent = parentSample;
                } else {
                    target_node.level = subjects.level + 2;
                    target_node.parent = this.nodes.get(subject_key);
                }
                this.nodes.set(target_node.id, target_node);
            } else if (link.source === id && target_node.type === rdfTypes.Site.key ) {
                link.source = target_node.attributes.onSample[0];
                target_node.level = subjects.level + 3;
                target_node.parent = this.nodes.get(target_node.attributes.onSample[0]);
                this.nodes.set(target_node.id, target_node);
            }
            let source_node = this.nodes.get(link.source);
            if ( source_node?.childLinks ) {
                source_node.childLinks = [];
                source_node.children_counter++;
                this.nodes.set(source_node.id, source_node);
            }
            return link;
        }).filter(link => {
            let target_node = this.nodes.get(link.target);
            if ((link.source === id && (target_node.type !== rdfTypes.Award.key) && (link.target !== contributors_key && link.target !== subject_key && link.target !== performances_key && link.target !== protocols_key))) {
                return false;
            }
            return true;
        });

        this.forced_edges = this.forced_edges.concat(groups);
    }


    fix_links() {
        const datasetNode = this.nodes.get(this.root_id) || Array.from(this.nodes.values())[0];
        const basePublishedURI = datasetNode?.attributes?.hasUriPublished?.[0] || datasetNode?.attributes?.hasUriHuman?.[0] || "";
        const baseHumanURI = datasetNode?.attributes?.hasUriHuman?.[0] || "";
        let nodesToRemove = [];

        this.forced_nodes.forEach((node, index, array) => {
            if (node.type === rdfTypes.Dataset.key) {
                if (node.attributes?.hasProtocol !== undefined) {
                    let source = this.nodes.get(node.attributes.hasProtocol[0]);
                    if ( source !== undefined ) {
                        node.attributes.hasProtocol[0] = source.attributes.hasDoi?.[0];
                    }
                }
            }
            
            if (node.type === rdfTypes.Sample.key) {
                const subjectParent = node.attributes.derivedFromSubject?.[0];
                const sampleParent = node.attributes.derivedFromSample?.[0];

                if (sampleParent && subjectParent) {
                    this.edges = this.edges.filter(link => !(link.source === node.id && link.target === subjectParent));
                    this.forced_edges = this.forced_edges.filter(link => !(link.source === subjectParent && link.target === node.id));
                    delete node.attributes.derivedFromSubject;
                }

                const sourceId = sampleParent || subjectParent;
                if (sourceId !== undefined) {
                    let source = this.nodes.get(sourceId);
                    if ( source !== undefined ) {
                        source.children_counter++
                        array[index].level = source.level + 1;
                        array[index].parent = source;
                        this.nodes.set(node.id, array[index]);
                        this.forced_edges = this.forced_edges.filter(link => !(link.source === sourceId && link.target === node.id));
                        this.forced_edges.push({
                            source: sourceId,
                            target: node.id
                        });
                    }
                }

                if (node.attributes?.hasFolderAboutIt !== undefined) {
                    node.attributes.hasFolderAboutIt =
                        [basePublishedURI +
                        "?datasetDetailsTab=files&path=files/" +
                        node.tree_reference?.dataset_relative_path];
                }
            }

            if (node.type === rdfTypes.Subject.key) {
                if (node.attributes?.animalSubjectIsOfStrain !== undefined) {
                    let source = this.nodes.get(node.attributes.animalSubjectIsOfStrain[0]);
                    if ( source !== undefined ) {
                        node.attributes.animalSubjectIsOfStrain[0] = source.attributes.label[0];
                    }
                }
                if (node.attributes?.animalSubjectIsOfSpecies !== undefined) {
                    let source = this.nodes.get(node.attributes.animalSubjectIsOfSpecies[0]);
                    if ( source !== undefined ) {
                        node.attributes.animalSubjectIsOfSpecies[0] = source.attributes.label[0];
                    }
                }
                if (node.attributes?.hasBiologicalSex !== undefined) {
                    let source = this.nodes.get(node.attributes.hasBiologicalSex[0]);
                    if ( source !== undefined ) {
                        node.attributes.hasBiologicalSex[0] = source.attributes.label[0];
                    }
                }

                if (node.additional_properties["TEMP:hasAgeMax"]) {
                    let ageMaxObj = node.additional_properties["TEMP:hasAgeMax"];
                    let ageValue = ageMaxObj["rdf:value"] || "";
                    let ageUnit = ageMaxObj["TEMP:hasUnit"]?.["@id"]?.replace("unit:", "") || "";
                    node.attributes.hasAgeMax = [`${ageValue} ${ageUnit}`];
                }

                if (node.additional_properties["TEMP:hasAge"]) {
                    let ageMaxObj = node.additional_properties["TEMP:hasAge"];
                    let ageValue = ageMaxObj["rdf:value"] || "";
                    let ageUnit = ageMaxObj["TEMP:hasUnit"]?.["@id"]?.replace("unit:", "") || "";
                    node.attributes.hasAge =[`${ageValue} ${ageUnit}`];
                }
        
                // Extract Age Min
                if (node.additional_properties["TEMP:hasAgeMin"]) {
                    let ageMinObj = node.additional_properties["TEMP:hasAgeMin"];
                    let ageValue = ageMinObj["rdf:value"] || "";
                    let ageUnit = ageMinObj["TEMP:hasUnit"]?.["@id"]?.replace("unit:", "") || "";
                    node.attributes.hasAgeMin = [`${ageValue} ${ageUnit}`];
                }                             

                if (node.attributes?.hasDerivedInformationAsParticipant !== undefined && node.attributes?.participantInPerformanceOf !== undefined) {
                    let source = this.nodes.get(node.attributes.participantInPerformanceOf[0]);
                    if ( source !== undefined ) {
                        node.attributes.hasDerivedInformationAsParticipant[0] = source.attributes.hasUriHuman[0];
                    }
                }

                if (node.attributes?.participantInPerformanceOf !== undefined) {
                    let source = this.nodes.get(node.attributes.participantInPerformanceOf[0]);
                    if ( source !== undefined ) {
                        node.attributes.participantInPerformanceOf[0] = source.attributes.hasUriHuman[0];
                    }
                }

                if (node.attributes?.hasFolderAboutIt !== undefined) {
                    node.attributes.hasFolderAboutIt = 
                        [basePublishedURI + 
                        "?datasetDetailsTab=files&path=files/" +
                        node.tree_reference?.dataset_relative_path];
                }
            }

            if (node.type === rdfTypes.File.key) {
                if (node?.tree_reference?.uri_human  !== undefined) {
                    node.tree_reference.uri_human = baseHumanURI;
                }

                if (node.attributes?.relativePath !== undefined) {
                    node.attributes.dataset_id = this.dataset_id;
                    node.attributes.publishedURI = 
                        basePublishedURI + 
                        "?datasetDetailsTab=files&path=files/" +
                        node.attributes?.relativePath.substr(0, node.attributes?.relativePath.lastIndexOf("/"));
                }
            }

            if (node.type === rdfTypes.Collection.key) {
                if (node?.tree_reference?.uri_human  !== undefined) {
                    node.tree_reference.uri_human = baseHumanURI;
                }

                if (node.attributes?.relativePath !== undefined) {
                    node.attributes.publishedURI = 
                        basePublishedURI + 
                        "?datasetDetailsTab=files&path=files/" +
                        node.attributes?.relativePath;  
                }
            }

            if (node.type === rdfTypes.RRID.key || node.type === rdfTypes.NCBITaxon?.key || node.type === rdfTypes.PATO?.key) {
                nodesToRemove.unshift(index);
            }

            if ( node.level !== undefined ) {
                if ( this.levelsMap[node.level] ) {
                    this.levelsMap[node.level] = [...this.levelsMap[node.level], node];
                } else {
                    this.levelsMap[node.level] = [node];
                }
            }
        });

        nodesToRemove.forEach(element => {
            this.forced_nodes.splice(element, 1);
        })
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

        this.nodes.forEach((node) => {
            if (node.type === rdfTypes.Site.key) {
                const siteNode = node;
                const nameSplit = siteNode.name?.split("/");
                siteNode.name = nameSplit[nameSplit.length - 1]
                // Find the sample node id from the node's additional_properties (from JSON-LD)
                let onSample = siteNode.attributes?.["onSample"]?.[0];

                if (onSample) {
                    // Find the corresponding sample node and create an edge if it exists
                    const sampleNode = Array.from(this.nodes.values()).find(n =>
                        n.id === onSample || n.attributes?.uri === onSample
                    );
                    if (sampleNode) {
                        this.edges.push({
                            source: sampleNode.id,
                            target: siteNode.id
                        });
                    }
                }
            }
        });
    }


    create_tree() {
        for (const leaf of this.jsonData.data) {
            this.tree_map.set(leaf.uri_api, leaf);
            if (leaf.parent_id === leaf.remote_id) {
                continue;
            }
            let children = this.tree_parents_map.get(leaf.parent_id);
            if (children) {
                this.tree_parents_map.set(leaf.parent_id, [...children, leaf]);
                this.tree_parents_map2.set(leaf.parent_id, [...children, leaf]);
            } else {
                this.tree_parents_map.set(leaf.parent_id, [leaf]);
                this.tree_parents_map2.set(leaf.parent_id, [leaf]);
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
                value.attributes.hasFolderAboutIt.forEach(folder => {
                    let jsonNode = this.tree_map.get(folder);
                    const splitName = jsonNode.dataset_relative_path.split('/');
                    const lastPath = splitName[splitName.length - 1];
                    const localId = value.attributes?.localId?.[0];
                    const proxyTarget = this.proxies_map.get(jsonNode.remote_id);

                    // Skip if this folder already proxies to the current node
                    if (proxyTarget && proxyTarget === value.id) {
                        // Make sure the tree node references the existing graph node
                        let treeEntry = this.tree_map.get(jsonNode.uri_api);
                        if (treeEntry) {
                            treeEntry.graph_reference = value;
                            value.tree_reference = treeEntry;
                            this.tree_map.set(jsonNode.uri_api, treeEntry);
                            this.tree_map.set(jsonNode.remote_id, treeEntry);
                            this.tree_map.set(value.id, treeEntry);
                        }
                        const dupChildren = this.tree_parents_map2.get(jsonNode.remote_id);
                        dupChildren?.forEach(child => {
                            if (!this.filterNode(child)) {
                                this.linkToNode(child, value);
                            }
                        });
                        return;
                    }

                    if (localId && (lastPath === localId || jsonNode.basename === localId)) {
                        let treeEntry = this.tree_map.get(jsonNode.uri_api);
                        if (treeEntry) {
                            treeEntry.graph_reference = value;
                            value.tree_reference = treeEntry;
                            this.tree_map.set(jsonNode.uri_api, treeEntry);
                            this.tree_map.set(jsonNode.remote_id, treeEntry);
                            this.tree_map.set(value.id, treeEntry);
                        }
                    }

                    let newName = jsonNode.dataset_relative_path;

                    let parentNode = value;
                    let newNode = this.buildFolder(jsonNode, newName, parentNode);

                    if ( value.type === rdfTypes.Sample.key) {
                        newNode.remote_id = jsonNode.basename + '_' + newName.replace(/\//g, '_');
                        newNode.uri_api = newNode.remote_id
                        // this.tree_parents_map2.delete(jsonNode.remote_id);
                    }


                    const children = this.tree_parents_map2.get(newNode.parent_id) || [];
                    let sampleChildren = [];
                    let folderChildren = [];
                    children.forEach(child => {
                        const childIsSample = [...this.nodes.values()].some(n =>
                            n.type === rdfTypes.Sample.key &&
                            n.attributes?.hasFolderAboutIt?.includes(child.remote_id)
                        );
                        if (childIsSample) {
                            child.parent_id = value.id;
                            sampleChildren.push(child);
                        } else {
                            child.parent_id = newNode.uri_api;
                            child.collapsed = true;
                            folderChildren.push(child);
                        }
                    });

                    if (sampleChildren.length > 0) {
                        const existing = this.tree_parents_map2.get(value.id) || [];
                        this.tree_parents_map2.set(value.id, [...existing, ...sampleChildren]);
                    }

                    if (!this.filterNode(newNode) && (this.nodes.get(newNode.remote_id)) === undefined) {
                        this.linkToNode(newNode, parentNode);
                    }

                    const existingFolderChildren = this.tree_parents_map2.get(newNode.uri_api) || [];
                    const updatedChildren = folderChildren === undefined ? existingFolderChildren : [...existingFolderChildren, ...folderChildren];
                    this.tree_parents_map2.set(newNode.uri_api, updatedChildren);
                    this.tree_parents_map2.delete(newNode.parent_id);
                    folderChildren.forEach(child => {
                        if (!this.filterNode(child)) {
                            this.linkToNode(child, this.nodes.get(newNode.remote_id));
                        }
                    });
                    const existingFolderChildrenMain = this.tree_parents_map.get(newNode.uri_api) || [];
                    const updatedChildrenMain = folderChildren === undefined ? existingFolderChildrenMain : [...existingFolderChildrenMain, ...folderChildren];
                    this.tree_parents_map.set(newNode.uri_api, updatedChildrenMain);
                    this.tree_parents_map.delete(newNode.parent_id);

                    this.tree_map.set(newNode.uri_api, newNode);

                    const parentChildren = this.tree_parents_map.get(parentNode.id) || [];
                    this.tree_parents_map.set(parentNode.id, [...parentChildren, newNode]);
                    const parentChildren2 = this.tree_parents_map2.get(parentNode.id) || [];
                    this.tree_parents_map2.set(parentNode.id, [...parentChildren2, newNode]);

                    const prevChildren = this.tree_parents_map.get(jsonNode.parent_id) || [];
                    this.tree_parents_map.set(jsonNode.parent_id, prevChildren.filter(c => c.remote_id !== jsonNode.remote_id));
                    const prevChildren2 = this.tree_parents_map2.get(jsonNode.parent_id) || [];
                    this.tree_parents_map2.set(jsonNode.parent_id, prevChildren2.filter(c => c.remote_id !== jsonNode.remote_id));
                })
            }
        });
    }

    buildFolder(item, newName) {
        let copiedItem = {...item};
        copiedItem.parent_id = copiedItem.remote_id;
        copiedItem.uri_api = copiedItem.remote_id;
        copiedItem.basename = newName;
        return copiedItem;
    }


    linkToNode(node, parent) {
        let level = parent?.level;
        if (parent?.type === rdfTypes.Sample.key) {
            const parentSource = parent.attributes.derivedFromSample?.length ?
                parent.attributes.derivedFromSample[0] :
                parent.attributes.derivedFromSubject?.[0];
            if (parentSource !== undefined) {
                level = this.nodes.get(parentSource)?.level + 1;
            }
        } else if (parent?.type === rdfTypes.Site.key) {
            const parentSource = parent.attributes.derivedFromSample?.length ?
                parent.attributes.derivedFromSample[0] :
                parent.attributes.derivedFromSubject?.[0];
            if (parentSource !== undefined) {
                level = this.nodes.get(parentSource)?.level + 1;
            }
        }
        const new_node = this.buildNodeFromJson(node, level);
        if (!parent) {
            return;
        }
        if (!new_node) {
            const existingId = this.proxies_map.get(node.remote_id);
            const existingNode = this.nodes.get(existingId);
            if (existingNode) {
                parent.children_counter++;
                this.forced_edges.push({
                    source: parent?.id,
                    target: existingNode?.id
                });
                var children = this.tree_parents_map2.get(node.remote_id);
                if (children?.length > 0) {
                    children.forEach(child => {
                        !this.filterNode(child) && this.linkToNode(child, existingNode);
                    });
                }
            }
            return;
        }
        parent.children_counter++;
        new_node.parent = parent;
        new_node.id = parent.id + new_node.id;
        this.forced_edges.push({
            source: parent?.id,
            target: new_node?.id
        });
        new_node.childLinks = [];
        if (!this.nodes.get(new_node.id)) {
            this.nodes.set(new_node.id, this.factory.createNode(new_node));
            var children = this.tree_parents_map2.get(node.remote_id);
            if (children?.length > 0) {
                children.forEach(child => {
                    !this.filterNode(child) && this.linkToNode(child, new_node);
                });
            }
        }
    }


    buildNodeFromJson(item, level) {
        const node_id = this.proxies_map.get(item.remote_id);
        if (node_id) {
            return undefined;
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
                publishedURI : ""
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
        // generate the tree
        var tree_root = this.tree_map.get(this.root_id);
        var children = this.tree_parents_map.get(tree_root?.remote_id);
        this.tree_parents_map?.delete(tree_root?.remote_id);
        this.tree = this.generateLeaf(tree_root);
        children?.forEach(leaf => {
            this.build_leaf(leaf, this.tree);
        });

        // generate the Graph
        const datasetNode = this.nodes.get(this.root_id) || Array.from(this.nodes.values())[0];
        const basePublishedURI = datasetNode?.attributes?.hasUriPublished?.[0] || datasetNode?.attributes?.hasUriHuman?.[0] || "";
        const baseHumanURI = datasetNode?.attributes?.hasUriHuman?.[0] || "";
        this.forced_nodes = Array.from(this.nodes).map(([key, value]) => {
            const id = value?.id?.match(/https?:\/\/[^\s]+/)?.[0] || "";
            let tree_node = this.tree_map.get(id);
            if (tree_node) {
                value.tree_reference = tree_node;
                tree_node.publishedURI = 
                    basePublishedURI + 
                    "?datasetDetailsTab=files&path=files/" +
                    tree_node?.dataset_relative_path.substr(0, tree_node?.dataset_relative_path.lastIndexOf("/"));
                this.nodes.set(key, value);
                tree_node.graph_reference = value;
                this.tree_map.set(value.id, tree_node);
            } else {
                value.proxies.every(proxy => {
                    tree_node = this.tree_map.get(proxy);
                    if (tree_node) {
                        tree_node.publishedURI = 
                            basePublishedURI + 
                            "?datasetDetailsTab=files&path=files/" +
                            tree_node?.dataset_relative_path.substr(0, tree_node?.dataset_relative_path.lastIndexOf("/"));
                        value.tree_reference = tree_node;
                        this.nodes.set(key, value);
                        tree_node.graph_reference = value;
                        this.tree_map.set(proxy, tree_node);
                        return false;
                    }
                    return true;
                })
            }
            return value;
        })

        this.fix_links();
        //this.identify_childless_parents();
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
        if ( node ) {
            node.id = node?.uri_api
            node.parent = true;
            node.text = parent !== undefined ? node?.basename : this.dataset_id;
            node.type = node.mimetype === "inode/directory" ? rdfTypes.Collection.key : rdfTypes.File.key;
            node.path = (parent !== undefined && parent.path !== undefined) ? [node.id, ...parent.path] : [node.id];
            if (!node.items) {
                node.items = [];
            }
            node.graph_reference = this.findReference(node.remote_id);
            if ( node.graph_reference === undefined ) {
                node.graph_reference = this.findReference(node.uri_api);
            }
            if ( node.graph_reference === undefined ) {
                const fn = (hashMap, str) => [...hashMap.keys()].find(k => k.includes(str))
                const graph_reference = fn(this.nodes, node.id)

                if ( graph_reference ) {
                    node.graph_reference = this.findReference(graph_reference);
                }
            }
            this.tree_map.set(node.id, node);
            const newNode = {
                id: node.uri_api,
                text: node.text,
                items: node.items,
                graph_reference: node?.graph_reference?.id,
                path: node.path
            }
            return newNode;
        } else {
            return {}
        }
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
