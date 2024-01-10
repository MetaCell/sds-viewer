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
    "Group": {
        "image": "./images/graph/group.svg",
        "key": "Group",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "To be filled"
            }
        ]
    },
    "Dataset": {
        "image": "./images/graph/dataset.svg",
        "key": "Dataset",
        "properties": [
            {
                "type": "dc",
                "key": "title",
                "property": "title",
                "label": "Title",
                "visible" : true
            },
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "Label",
                "visible" : true
            },
            {
                "type": "dc",
                "key": "description",
                "property": "description",
                "label": "Description",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "contentsWereUpdatedAtTime",
                "property": "latestUpdate",
                "label": "Contents Updated On",
                "visible" : true
            },
            {
                "type": "isAbout",
                "key": "",
                "property": "isAbout",
                "label": "About",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "protocolEmploysTechnique",
                "property": "protocolEmploysTechnique",
                "label": "Protocol Employs Technique",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "errorIndex",
                "property": "errorIndex",
                "label": "Error Index",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasDatasetTemplateSchemaVersion",
                "property": "hasDatasetTemplateSchemaVersion",
                "label": "Template Schema Version",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasExperimentalModality",
                "property": "hasExperimentalModality",
                "label": "Experimental Modality",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasExperimentalApproach",
                "property": "hasExperimentalApproach",
                "label": "Experimental Approach",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasDoi",
                "property": "hasDoi",
                "label": "DOI",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasAdditionalFundingInformation",
                "property": "hasAdditionalFundingInformation",
                "label": "Additional Funding Information",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "statusOnPlatform",
                "property": "statusOnPlatform",
                "label": "Status On Platform",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasLicense",
                "property": "hasLicense",
                "label": "License",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "URI Human",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "curationIndex",
                "property": "curationIndex",
                "label": "Curation Index",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasAwardNumber",
                "property": "hasAwardNumber",
                "label": "Award Number",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasExpectedNumberOfSamples",
                "property": "hasExpectedNumberOfSamples",
                "label": "Expected Number of Samples",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasExpectedNumberOfSubjects",
                "property": "hasExpectedNumberOfSubjects",
                "label": "Expected Number of Subjects",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasResponsiblePrincipalInvestigator",
                "property": "hasResponsiblePrincipalInvestigator",
                "label": "Responsible Principal Investigator",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasUriApi",
                "property": "hasUriApi",
                "label": "URI API",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasProtocol",
                "property": "hasProtocol",
                "label": "Protocol",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "URI Human",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasNumberOfContributors",
                "property": "hasNumberOfContributors",
                "label": "Number of Contributors",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasNumberOfDirectories",
                "property": "hasNumberOfDirectories",
                "label": "Number of Directories",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasNumberOfFiles",
                "property": "hasNumberOfFiles",
                "label": "Number of Files",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasNumberOfPerformances",
                "property": "hasNumberOfPerformances",
                "label": "Number of Performances",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasNumberOfSamples",
                "property": "hasNumberOfSamples",
                "label": "Number of Samples",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasNumberOfSubjects",
                "property": "hasNumberOfSubjects",
                "label": "Number of Subjects",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasPathErrorReport",
                "property": "hasPathErrorReport",
                "label": "Path Error Report",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasSizeInBytes",
                "property": "hasSizeInBytes",
                "label": "Size In Bytes",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "milestoneCompletionDate",
                "property": "milestoneCompletionDate",
                "label": "Milestone Completion Date",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "speciesCollectedFrom",
                "property": "speciesCollectedFrom",
                "label": "Species Collected From",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "submissionIndex",
                "property": "submissionIndex",
                "label": "Submission Index",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "unclassifiedIndex",
                "property": "unclassifiedIndex",
                "label": "Unclassified Index",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "wasCreatedAtTime",
                "property": "wasCreatedAtTime",
                "label": "Created At",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "wasUpdatedAtTime",
                "property": "wasUpdatedAtTime",
                "label": "Updated Last On",
                "visible" : true
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
                "key": "hasAgeMin",
                "property": "hasAgeMin",
                "label": "to be filled"
            },
            {
                "type": "TEMP",
                "key": "hasAgeMax",
                "property": "hasAgeMax",
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
            },
            {
                "type": "TEMP",
                "key": "publishedURI",
                "property": "publishedURI",
                "label": "to be filled"
            },
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
            {
                "type": "TEMP",
                "key": "hasAffiliation",
                "property": "hasAffiliation",
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
        group: {
            "type": "Group"
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
