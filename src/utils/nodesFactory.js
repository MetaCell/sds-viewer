import { rdfTypes } from './graphModel';

function createImage(node) {
    const img = new Image();
    if ( node.type === rdfTypes.File.key ){
        const extension = node.name.split(".").pop();
        img.src = "./images/graph/files/" + extension + ".svg"
    } else {
        if ( node.type !== "Group" ) {
            img.src = (rdfTypes[String(node.type)]?.image !== "") ? rdfTypes[String(node.type)]?.image : rdfTypes.Unknown?.image
        }
    }
    return img;
}

function extractProperties(node, ttlTypes) {
    if (ttlTypes === undefined) {
        return;
    }
    for (const property of node.properties) {
        for (const type_property of rdfTypes[node.type].properties) {
            if (property.predicate === (ttlTypes[type_property.type]?.iri?.id + type_property.key)) {
                if (node.attributes[type_property.property] !== undefined) {
                    node.attributes[type_property.property].push(property.value);
                } else {
                    node.attributes[type_property.property] = [];
                    node.attributes[type_property.property].push(property.value);
                }
            }
        }
        
    }

    if (node.additional_properties) {
        for (const json_prop of rdfTypes[node.type].additional_properties) {
            let new_attribute = node.additional_properties;
            for (const step of json_prop.path) {
                if (new_attribute[step] !== undefined) {
                    new_attribute = new_attribute[step];
                } else {
                    new_attribute = undefined;
                    break;
                }
            }
            if (new_attribute !== undefined) {
                if (typeof new_attribute === 'object' && new_attribute !== null && new_attribute[json_prop.innerPath]) {
                    new_attribute = new_attribute[json_prop.innerPath];
                }

                node.attributes[json_prop.property] = [];
                if (json_prop.type === 'string') {
                    node.attributes[json_prop.property].push(new_attribute.replace(json_prop.trimType, ''));
                } else {
                    node.attributes[json_prop.property].push(parseFloat(new_attribute));
                }
            }

            if (node.additional_properties["TEMP:hasAgeMax"]) {
                let ageMaxObj = node.additional_properties["TEMP:hasAgeMax"];
                let ageValue = ageMaxObj["rdf:value"] || "";
                let ageUnit = ageMaxObj["TEMP:hasUnit"]?.["@id"]?.replace("unit:", "") || "";
                node.attributes.hasAgeMax =  [`${ageValue} ${ageUnit}`];
            }

            if (node.additional_properties["TEMP:hasAge"]) {
                let ageMaxObj = node.additional_properties["TEMP:hasAge"];
                let ageValue = ageMaxObj["rdf:value"] || "";
                let ageUnit = ageMaxObj["TEMP:hasUnit"]?.["@id"]?.replace("unit:", "") || "";
                node.attributes.hasAge = [`${ageValue} ${ageUnit}`];
            }
        
            if (node.additional_properties["TEMP:hasAgeMin"]) {
                let ageMinObj = node.additional_properties["TEMP:hasAgeMin"];
                let ageValue = ageMinObj["rdf:value"] || "";
                let ageUnit = ageMinObj["TEMP:hasUnit"]?.["@id"]?.replace("unit:", "") || "";
                node.attributes.hasAgeMin = [`${ageValue} ${ageUnit}`];
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
            case "Award":
                typed_node = new Award(node, ttlTypes);
                break;
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
            case "Performance":
                typed_node = new Performance(node, ttlTypes);
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
    extractProperties(node, ttlTypes);
    node.img = createImage(node);
    // compile node name based on the props extracted, if these are presents
    node.name = node.attributes?.firstName !== undefined
        ? node.attributes?.middleName !== undefined
            ? node.attributes?.lastName !== undefined
                ? node.attributes?.firstName + " " + node.attributes?.middleName + " " + node.attributes?.lastName
                : node.attributes?.firstName + " " + node.attributes?.middleName
            : node.attributes?.lastName !== undefined
                ? node.attributes?.firstName + " " + node.attributes?.lastName
                : node.attributes?.firstName
        : node.name;
    return node;
};


const Award = function (node, ttlTypes) {
    extractProperties(node, ttlTypes);
    node.img = createImage(node);
    var namesArray = node.name.split("/");
    node.name = namesArray[namesArray.length - 1];
    return node;
};

const Dataset = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    var namesArray = node.name.split(":");
    node.name = namesArray[namesArray.length - 1];
    return node;
};

const Protocol = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    var namesArray = node.name.split("/");
    node.name = namesArray[namesArray.length - 1];
    return node;
};

const Sample = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    if (node.attributes?.identifier !== undefined) {
        node.name = node.attributes?.identifier[0];
    } else {
        let namesArray = node.name.split("/");
        node.name = namesArray[namesArray.length - 1];
    }
    return node;
};

const Subject = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    if (node.attributes?.identifier !== undefined) {
        node.name = node.attributes?.identifier[0];
    } else {
        var namesArray = node.name.split("/");
        node.name = namesArray[namesArray.length - 1];
    }
    return node;
};

const Performance = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    if (node.attributes?.identifier !== undefined) {
        node.name = node.attributes?.identifier[0];
    } else {
        var namesArray = node.name.split("/");
        node.name = namesArray[namesArray.length - 1];
    }
    return node;
};

const File = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

const Person = function (node, ttlTypes) {
    extractProperties(node, ttlTypes);
    node.img = createImage(node);
    // compile node name based on the props extracted, if these are presents
    node.name = node.attributes?.firstName !== undefined
        ? node.attributes?.middleName !== undefined
            ? node.attributes?.lastName !== undefined
                ? node.attributes?.firstName + " " + node.attributes?.middleName + " " + node.attributes?.lastName
                : node.attributes?.firstName + " " + node.attributes?.middleName
            : node.attributes?.lastName !== undefined
                ? node.attributes?.firstName + " " + node.attributes?.lastName
                : node.attributes?.firstName
        : node.name;
    return node;
};

const Unknown = function (node, ttlTypes) {
    node.img = createImage(node);
    extractProperties(node, ttlTypes);
    return node;
};

export default NodesFactory;
