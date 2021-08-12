import { rdfTypes } from './graphModel';

function createImage(node) {
    // TODO: replace this with a decorator (maybe).
    const img = new Image();
    img.src = (rdfTypes[String(node.type)]?.image !== "") ? rdfTypes[String(node.type)].image : rdfTypes.Uknown.image
    return img;
}

function extractProperties(node, ttlTypes) {
    for (const property of node.properties) {
        for (const type_property of rdfTypes[node.type].properties) {
            if (property.predicate === (ttlTypes[type_property.type]?.iri?.id + type_property.key)) {
                node.attributes[type_property.property] = property.value;
            }
        }
    }

    if (node?.attributes?.identifier !== undefined) {
        node.name = node.attributes.identifier;
    }
}


var NodesFactory = function () {
    this.createNode = function (node, ttlTypes) {
        var typed_node;

        if (node.type === "Collection") {
            typed_node = new Collection(node, ttlTypes);
        } else if (node.type === "Contributor") {
            typed_node = new Contributor(node, ttlTypes);
        } else if (node.type === "Dataset") {
            typed_node = new Dataset(node, ttlTypes);
        } else if (node.type === "Protocol") {
            typed_node = new Protocol(node, ttlTypes);
        } else if (node.type === "Sample") {
            typed_node = new Sample(node, ttlTypes);
        } else if (node.type === "Subject") {
            typed_node = new Subject(node, ttlTypes);
        } else if (node.type === "File") {
            typed_node = new File(node, ttlTypes);
        } else if (node.type === "Person") {
            typed_node = new Person(node, ttlTypes);
        } else {
            typed_node = new Unknown(node, ttlTypes);
        }
        return typed_node;
    }
}

const Collection = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Contributor = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Dataset = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Protocol = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Sample = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Subject = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const File = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Person = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Unknown = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

export default NodesFactory;
