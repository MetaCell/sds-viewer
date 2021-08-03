import { rdfTypes } from './graphModel';

// decorator
// function processNode(fn) {
//     return function (node) {

//         node.img = () => {
//             const img = new Image();
//             img.src = (rdfTypes[node.type].image !== undefined || rdfTypes[node.type].image !== "") ? rdfTypes[node.type].image : rdfTypes.Dataset.image
//             return img;
//         }

//         fn.call(this, node);
//     }
// };

function createImage(node) {
    // TODO: replace this with the decorator above.
    const img = new Image();
    if (rdfTypes[String(node.type)] === undefined) {
        console.log(node);
    }
    img.src = (rdfTypes[String(node.type)].image !== undefined || rdfTypes[String(node.type)].image !== "") ? rdfTypes[String(node.type)].image : rdfTypes.Uknown.image
    return img;
}


var NodesFactory = function () {
    this.createNode = function (node) {
        var typed_node;

        if (node.type === "Collection") {
            typed_node = new Collection(node);
        } else if (node.type === "Contributor") {
            typed_node = new Contributor(node);
        } else if (node.type === "Dataset") {
            typed_node = new Dataset(node);
        } else if (node.type === "Protocol") {
            typed_node = new Protocol(node);
        } else if (node.type === "Sample") {
            typed_node = new Sample(node);
        } else if (node.type === "Subject") {
            typed_node = new Subject(node);
        } else if (node.type === "File") {
            typed_node = new File(node);
        } else if (node.type === "Person") {
            typed_node = new Person(node);
        } else {
            typed_node = new Unknown(node);
        }

        return typed_node;
    }
}

const Collection = function (node) {
    node.img = createImage(node);
    return node;
};

const Contributor = function (node) {
    node.img = createImage(node);
    return node;
};

const Dataset = function (node) {
    node.img = createImage(node);
    return node;
};

const Protocol = function (node) {
    node.img = createImage(node);
    return node;
};

const Sample = function (node) {
    node.img = createImage(node);
    return node;
};

const Subject = function (node) {
    node.img = createImage(node);
    return node;
};

const File = function (node) {
    node.img = createImage(node);
    return node;
};

const Person = function (node) {
    node.img = createImage(node);
    return node;
};

const Unknown = function (node) {
    node.img = createImage(node);
    return node;
};

export default NodesFactory;
