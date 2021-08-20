import { rdfTypes } from './graphModel';

function createImage(node) {
    // TODO: replace this with a decorator (maybe).
    const img = new Image();
    if ( node.type === rdfTypes.File.key ){
        const extension = node.name.split(".").pop();
        img.src = "./images/graph/files/" + extension + ".svg"
    } else {
        img.src = (rdfTypes[String(node.type)]?.image !== "") ? rdfTypes[String(node.type)].image : rdfTypes.Uknown.image
    }
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

        switch(node.type) {
            case "Collection":
                typed_node = new Collection(node, ttlTypes);
                break;
            case "Contributor":
                typed_node = new Contributor(node, ttlTypes);
                break;
            case "Dataset":
                typed_node = new Dataset(node, ttlTypes);
                break;
            case "Protocol":
                typed_node = new Protocol(node, ttlTypes);
                break;
            case "Sample":
                typed_node = new Sample(node, ttlTypes);
                break;
            case "Subject":
                typed_node = new Subject(node, ttlTypes);
                break;
            case "File":
                typed_node = new File(node, ttlTypes);
                break;
            case "Person":
                typed_node = new Person(node, ttlTypes);
                break;
            default:
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
