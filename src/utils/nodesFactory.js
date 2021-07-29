var NodesFactory = function () {
    this.createEmployee = function (node) {
        var typed_node;

        if (node.type === "collection") {
            typed_node = new Collection(node);
        } else if (node.type === "contributor") {
            typed_node = new Contributor(node);
        } else if (node.type === "dataset") {
            typed_node = new Dataset(node);
        } else if (node.type === "protocol") {
            typed_node = new Protocol(node);
        } else if (node.type === "sample") {
            typed_node = new Sample(node);
        } else if (node.type === "subject") {
            typed_node = new Subject(node);
        } else if (node.type === "file") {
            typed_node = new File(node);
        }

        return typed_node;
    }
}

const Collection = function (node) {
    let new_node = {
        type: "collection"
    };
    return new_node;
};

const Contributor = function (node) {
    let new_node = {
        type: "contributor"
    };
    return new_node;
};

const Dataset = function (node) {
    let new_node = {
        type: "dataset"
    };
    return new_node;
};

const Protocol = function (node) {
    let new_node = {
        type: "protocol"
    };
    return new_node;
};

const Sample = function (node) {
    let new_node = {
        type: "sample"
    };
    return new_node;
};

const Subject = function (node) {
    let new_node = {
        type: "subject"
    };
    return new_node;
};

const File = function (node) {
    let new_node = {
        type: "file"
    };
    return new_node;
};

export default NodesFactory;