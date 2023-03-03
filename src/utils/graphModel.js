export const type_key = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";


export const RDF_TO_JSON_TYPES = [
    {key: 'sparc:Subject', toTrim: 'subject'}
];


export const rdfTypes = {
    "Ontology": {
        "image": "./images/graph/database.svg",
        "key": "Ontology",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "Award": {
        "image": "./images/graph/files/default_file.svg",
        "key": "Award",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "Collection": {
        "image": "./images/graph/folder.svg",
        "key": "Collection",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "Dataset": {
        "image": "./images/graph/dataset.svg",
        "key": "Dataset",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            },
            {
                "type": "dc",
                "key": "title",
                "property": "title",
                "label": "To be filled"
            },
            {
                "type": "dc",
                "key": "description",
                "property": "description",
                "label": "To be filled"
            },
            {
                "type": "isAbout",
                "key": "",
                "property": "isAbout",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "contentsWereUpdatedAtTime",
                "property": "latestUpdate",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "errorIndex",
                "property": "errorIndex",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasAwardNumber",
                "property": "hasAwardNumber",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasDoi",
                "property": "hasDoi",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasDatasetTemplateSchemaVersion",
                "property": "hasDatasetTemplateSchemaVersion",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasExperimentalModality",
                "property": "hasExperimentalModality",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasResponsiblePrincipalInvestigator",
                "property": "hasResponsiblePrincipalInvestigator",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriApi",
                "property": "hasUriApi",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasProtocol",
                "property": "hasProtocol",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "protocolEmploysTechnique",
                "property": "protocolEmploysTechnique",
                "label": "To be filled"
            }
        ]
    },
    "File": {
        "image": "./images/graph/files/default_file.svg",
        "key": "File",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "Subject": {
        "image": "./images/graph/folder.svg",
        "key": "Subject",
        "properties": [
            {
                "type": "sparc",
                "key": "animalSubjectIsOfSpecies",
                "property": "subjectSpecies",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasFolderAboutIt",
                "property": "hasFolderAboutIt",
                "label": "Folder that contains collection and files about the sample"
            },
            {
                "type": "sparc",
                "key": "animalSubjectIsOfStrain",
                "property": "subjectStrain",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasAge",
                "property": "age",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasAgeCategory",
                "property": "hasAgeCategory",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasAssignedGroup",
                "property": "hasAssignedGroup",
                "label": "to be filled"
            },
            {
                "type": "sparc",
                "key": "hasBiologicalSex",
                "property": "biologicalSex",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "localId",
                "property": "identifier",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasDerivedInformationAsParticipant",
                "property": "hasDerivedInformationAsParticipant",
                "label": "to be filled"
            },
            {
                "type": "sparc",
                "key": "specimenHasIdentifier",
                "property": "specimenHasIdentifier",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "participantInPerformanceOf",
                "property": "participantInPerformanceOf",
                "label": "to be filled"
            },
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ],
        "additional_properties": [
            {
                "label": "Age unit",
                "property": "ageUnit",
                "path": [ "TEMP:hasAge", "TEMP:hasUnit", "@id" ],
                "trimType": "unit:",
                "type": "string"
            },
            {
                "label": "Age value",
                "property": "ageValue",
                "path": [ "TEMP:hasAge", "rdf:value" ],
                "innerPath": "@value",
                "trimType": "",
                "type": "digit"
            },
            {
                "label": "Age base unit",
                "property": "ageBaseUnit",
                "path": [ "TEMP:hasAge", "TEMP:asBaseUnits", "TEMP:hasUnit", "@id" ],
                "trimType": "unit:",
                "type": "string"
            },
            {
                "label": "Age base value",
                "property": "ageBaseValue",
                "path": [ "TEMP:hasAge", "TEMP:asBaseUnits", "rdf:value" ],
                "innerPath": "@value",
                "trimType": "",
                "type": "digit"
            },
            {
                "label": "Weight unit",
                "property": "weightUnit",
                "path": [ "sparc:animalSubjectHasWeight", "TEMP:hasUnit", "@id" ],
                "trimType": "unit:",
                "type": "string"
            },
            {
                "label": "Weight value",
                "property": "weightValue",
                "path": [ "sparc:animalSubjectHasWeight", "rdf:value", "@value" ],
                "trimType": "",
                "type": "digit"
            }
        ]
    },
    "Sample": {
        "image": "./images/graph/folder.svg",
        "key": "Sample",
        "properties": [
            {
                "type": "TEMP",
                "key": "hasFolderAboutIt",
                "property": "hasFolderAboutIt",
                "label": "Folder that contains collection and files about the sample"
            },
            {
                "type": "TEMP",
                "key": "wasDerivedFromSubject",
                "property": "derivedFrom",
                "label": "Derived from the subject"
            },
            {
                "type": "TEMP",
                "key": "localId",
                "property": "identifier",
                "label": "Unique instance identifier"
            },
            {
                "type": "TEMP",
                "key": "hasAssignedGroup",
                "property": "hasAssignedGroup",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasDerivedInformationAsParticipant",
                "property": "hasDerivedInformationAsParticipant",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasDigitalArtifactThatIsAboutIt",
                "property": "hasDigitalArtifactThatIsAboutIt",
                "label": "Unique instance identifier"
            },
            {
                "type": "TEMP",
                "key": "participantInPerformanceOf",
                "property": "participantInPerformanceOf",
                "label": "Unique instance identifier"
            },
            {
                "type": "TEMPRAW",
                "key": "wasExtractedFromAnatomicalRegion",
                "property": "wasExtractedFromAnatomicalRegion",
                "label": "Unique instance identifier"
            },
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "Person": {
        "image": "./images/graph/user.svg",
        "key": "Person",
        "properties": [
            {
                "type": "sparc",
                "key": "firstName",
                "property": "firstName",
                "label": "To be filled"
            },
            {
                "type": "sparc",
                "key": "lastName",
                "property": "lastName",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "middleName",
                "property": "middleName",
                "label": "To be filled"
            },
        ]
    },
    "Protocol": {
        "image": "./images/graph/files/default_file.svg",
        "key": "Protocol",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "protocolHasNumberOfSteps",
                "property": "protocolHasNumberOfSteps",
                "label": "To be filled"
            }
        ]
    },
    "RRID": {
        "image": "./images/graph/files/default_file.svg",
        "key": "RRID",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "NCBITaxon": {
        "image": "./images/graph/files/default_file.svg",
        "key": "NCBITaxon",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "PATO": {
        "image": "./images/graph/files/default_file.svg",
        "key": "PATO",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "UBERON": {
        "image": "./images/graph/files/default_file.svg",
        "key": "UBERON",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "To be filled"
            }
        ]
    },
    "Unknown": {
        "image": "./images/graph/files/default_file.svg",
        "key": "Unknown",
        "properties": []
    }
};


export const typesModel = {
    "NamedIndividual": {
        ORCID: {
            "type": "Person"
        },
        awards: {
            "type": "Award"
        },
        collection: {
            "type": "Collection"
        },
        contributor: {
            "type": "Person"
        },
        dataset: {
            "type": "Dataset"
        },
        sample: {
            "type": "Sample"
        },
        subject: {
            "type": "Subject",
        },
        RRID: {
            "type": "RRID",
        }
    },
    "Class": {
        NCBITaxon: {
            "type": "NCBITaxon",
        },
        PATO: {
            "type": "PATO",
        },
        UBERON: {
            "type": "UBERON",
        }
    },
    "sparc": {
        Protocol: {
            "type": "Protocol",
            "length": 999
        },
    },
    "ontology": {
        "type": "Ontology",
        "length": 999
    },
    "unknown": {
        "type": "Unknown",
        "length": 0
    }
};
