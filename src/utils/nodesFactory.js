var NodesFactory = function () {
    this.createNode = function (node, type) {
        var typed_node;

        if (type === "Collection") {
            typed_node = new Collection(node, type);
        } else if (type === "Contributor") {
            typed_node = new Contributor(node, type);
        } else if (type === "Dataset") {
            typed_node = new Dataset(node, type);
        } else if (type === "Protocol") {
            typed_node = new Protocol(node, type);
        } else if (type === "Sample") {
            typed_node = new Sample(node, type);
        } else if (type === "Subject") {
            typed_node = new Subject(node, type);
        } else if (type === "File") {
            typed_node = new File(node, type);
        } else if (type === "Unknown") {
            typed_node = new File(node, type);
        }

        return typed_node;
    }
}

const Collection = function (node, type) {
    node.type = type;
    return node;
};

const Contributor = function (node, type) {
    node.type = type;
    return node;
};

const Dataset = function (node, type) {
    node.type = type;
    return node;
};

const Protocol = function (node, type) {
    node.type = type;
    return node;
};

const Sample = function (node, type) {
    node.type = type;
    return node;
};

const Subject = function (node, type) {
    node.type = type;
    return node;
};

const File = function (node, type) {
    node.type = type;
    return node;
};

export default NodesFactory;