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
            },
            {
                "type" : "owl",
                "key" : "versionInfo",
                "property" : "versionInfo",
                "label" : "Version"
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
                "key": "relativePath",
                "property": "relativePath",
                "label": "Name",
                "visible" : true
            },
            {
                "type": "rdfs",
                "key": "name",
                "property": "name",
                "label": "Name",
                "visible" : true
            },
            {
                "type": "rdfs",
                "key": "mimetype",
                "property": "mimetype",
                "label": "Mimetype",
                "visible" : true
            },
            {
                "type": "rdfs",
                "key": "status",
                "property": "status",
                "label": "Status",
                "visible" : true
            },
            {
                "type": "rdfs",
                "key": "timestamp_updated",
                "property": "timestamp_updated",
                "label": "Updated On",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "publishedURI",
                "property": "publishedURI",
                "label": "Find in SPARC Portal",
                "visible" : true
            }
        ]
    },
    "Group": {
        "image": "./images/graph/group.svg",
        "key": "Group",
        "properties": [
            {
                "type": "TEMP",
                "key": "name",
                "property": "name",
                "label": "Name",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "subjects",
                "property": "subjects",
                "label": "Number of Subjects",
                "visible" : true
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
                "label": "Title",
                "visible" : true,
                "link" : {
                    "property" : "hasUriPublished",
                    "asText" : true
                }
            },
            {
                "type": "dc",
                "key": "title",
                "property": "title",
                "label": "Label",
                "visible" : false
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
                "key": "hasUriPublished",
                "property": "hasUriPublished",
                "label": "Published URI",
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
                "visible" : true,
                "link" : {
                    "property" : "hasUriPublished",
                    "asText" : true
                }
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
                "label": "Pensieve Link",
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
                "visible" : false
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
                "label": "Pennsieve Dataset Link",
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
                "visible" : false
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
                "key": "basename",
                "property": "basename",
                "label": "Basename",
                "visible" : true
            },
            {
                "type": "rdfs",
                "key": "timestamp_updated",
                "property": "timestamp_updated",
                "label": "Updated On",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "mimetype",
                "property": "mimetype",
                "label": "Mimetype",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "size",
                "property": "size",
                "label": "Size",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "uri_human",
                "property": "uri_human",
                "label": "URI Link",
                "visible" : false
            },
            {
                "type": "TEMP",
                "key": "uri_api",
                "property": "uri_api",
                "label": "URI API",
                "visible" : false
            },
            {
                "type": "TEMP",
                "key": "status",
                "property": "status",
                "label": "Status",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "publishedURI",
                "property": "publishedURI",
                "label": "Find in SPARC Portal",
                "visible" : true
            }
        ]
    },
    "Subject": {
        "image": "./images/graph/folder.svg",
        "key": "Subject",
        "properties": [
            {
                "type": "TEMP",
                "key": "localId",
                "property": "localId",
                "label": "Label",
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
                "key": "hasAgeCategory",
                "property": "hasAgeCategory",
                "label": "Age Category",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasAge",
                "property": "hasAge",
                "label": "Age",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasAgeMin",
                "property": "hasAgeMin",
                "label": "Age Min",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasAgeMax",
                "property": "hasAgeMax",
                "label": "Age Max",
                "visible" : true
            },
            {
                "type": "sparc",
                "key": "hasBiologicalSex",
                "property": "hasBiologicalSex",
                "label": "Biological Sex",
                "visible" : true,
                "isGroup" : true
            },
            {
                "type": "sparc",
                "key": "specimenHasIdentifier",
                "property": "specimenHasIdentifier",
                "label": "Specimen has Identifier",
                "visible" : true,
                "isGroup" : false
            },
            {
                "type": "sparc",
                "key": "animalSubjectIsOfSpecies",
                "property": "animalSubjectIsOfSpecies",
                "label": "Subject Species",
                "visible" : true,
                "isGroup" : true
            },
            {
                "type": "sparc",
                "key": "animalSubjectIsOfStrain",
                "property": "animalSubjectIsOfStrain",
                "label": "Subject Strain",
                "visible" : true,
                "isGroup" : true
            },
            {
                "type": "TEMP",
                "key": "hasAssignedGroup",
                "property": "hasAssignedGroup",
                "label": "Assigned Group",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasGenotype",
                "property": "hasGenotype",
                "label": "Genotype",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "experimental_file",
                "property": "experimental_file",
                "label": "Experimental File",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "reference_atlas",
                "property": "reference_atlas",
                "label": "Reference Atlas",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasFolderAboutIt",
                "property": "hasFolderAboutIt",
                "label": "Folder About It",
                "visible" : true
            },            
            {
                "type": "TEMP",
                "key": "hasDerivedInformationAsParticipant",
                "property": "hasDerivedInformationAsParticipant",
                "label": "Derived Information as Participant",
                "visible" : false
            },
            {
                "type": "TEMP",
                "key": "participantInPerformanceOf",
                "property": "participantInPerformanceOf",
                "label": "Participant In Performance Of",
                "visible" : true
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
    "Performance": {
        "image": "./images/graph/folder.svg",
        "key": "Performance",
        "properties": [
            {
                "type": "TEMP",
                "key": "localId",
                "property": "localId",
                "label": "Label",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "participantInPerformanceOf",
                "property": "participantInPerformanceOf",
                "label": "Participant In Performance Of",
                "visible" : true
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
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "Label",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "Human URI",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasFolderAboutIt",
                "property": "hasFolderAboutIt",
                "label": "Find in SPARC Portal",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "wasDerivedFromSubject",
                "property": "derivedFrom",
                "label": "Derived from Subject",
                "visible" : false
            },
            {
                "type": "TEMP",
                "key": "localId",
                "property": "localId",
                "label": "Local ID",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasAssignedGroup",
                "property": "hasAssignedGroup",
                "label": "Assigned Group",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasDerivedInformationAsParticipant",
                "property": "hasDerivedInformationAsParticipant",
                "label": "Derived Information as Participant",
                "visible" : false
            },
            {
                "type": "TEMP",
                "key": "hasDigitalArtifactThatIsAboutIt",
                "property": "hasDigitalArtifactThatIsAboutIt",
                "label": "Digital Artifact",
                "visible" : true
            },
            {
                "type": "TEMPRAW",
                "key": "wasExtractedFromAnatomicalRegion",
                "property": "wasExtractedFromAnatomicalRegion",
                "label": "Extracted From Anatomical Region",
                "visible" : true
            },
            {
                "type": "TEMPRAW",
                "key": "sample_anatomical_location",
                "property": "sample_anatomical_location",
                "label": "Sample Anatomical Location",
                "visible" : true
            },
            {
                "type": "TEMPRAW",
                "key": "sample_type",
                "property": "sample_type",
                "label": "Sample Type",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "participantInPerformanceOf",
                "property": "participantInPerformanceOf",
                "label": "Participant in Performance Of",
                "visible" : true
            }
        ]
    },
    "Person": {
        "image": "./images/graph/user.svg",
        "key": "Person",
        "properties": [
            {
                "type": "rdfs",
                "key": "label",
                "property": "label",
                "label": "Name",
                "visible" : true
            },
            {
                "type": "sparc",
                "key": "lastName",
                "property": "lastName",
                "label": "Last Name",
                "visible" : false
            },
            {
                "type": "sparc",
                "key": "firstName",
                "property": "firstName",
                "label": "First Name",
                "visible" : false
            },
            {
                "type": "TEMP",
                "key": "middleName",
                "property": "middleName",
                "label": "Middle Name",
                "visible" : false
            },
            {
                "type": "sparc",
                "key": "hasORCIDId",
                "property": "hasORCIDId",
                "label": "ORCID Id",
                "visible" : false
            },
            {
                "type": "TEMP",
                "key": "hasAffiliation",
                "property": "hasAffiliation",
                "label": "Affiliation",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasDataRemoteUserId",
                "property": "hasDataRemoteUserId",
                "label": "Data Remote User ID",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "contributorTo",
                "property": "contributorTo",
                "label": "Contributor To",
                "visible" : true
            }
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
                "label": "Label",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "protocolHasNumberOfSteps",
                "property": "protocolHasNumberOfSteps",
                "label": "Number of Steps",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasUriHuman",
                "property": "hasUriHuman",
                "label": "Human URI",
                "visible" : true
            },
            {
                "type": "TEMP",
                "key": "hasDoi",
                "property": "hasDoi",
                "label": "DOI",
                "visible" : true,
                "link" : {
                    "property" : "hasUriPublished"
                }
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
    "NamedIndividual": {
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
        },
        Protocol: {
            "type": "Protocol"
        },
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
        },
        Protocol: {
            "type": "Protocol"
        },
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
