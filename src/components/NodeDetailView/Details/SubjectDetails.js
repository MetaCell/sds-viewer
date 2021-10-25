import React from "react";
import {
    Box,
    Typography,
} from "@material-ui/core";
import SimpleChip from './Views/SimpleChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import Links from './Views/Links';
import { iterateSimpleValue } from './utils';
import { detailsLabel } from '../../../constants';

const SubjectDetails = (props) => {
    const { node } = props;

    let title = "";
    let idDetails = "";
    // both tree and graph nodes are present, extract data from both
    if (node.tree_node && node.graph_node) {
        idDetails = node?.tree_node?.id + detailsLabel;
        title = node?.tree_node?.basename;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node?.graph_node) {
        idDetails = node?.graph_node?.id + detailsLabel;
        title = node.graph_node.name;
    // the below is the case where we have data only from the graph
    } else {
        idDetails = node.tree_node.id + detailsLabel;
        title = node.tree_node.basename;
    }

    const populateAttributeArray = (array, prop) => {
        array = prop.map( item => {
            return item;
        })
    }

    let species = [];
    let strains = [];
    let assignedGroups = [];
    if (node.graph_node?.attributes?.hasAssignedGroup !== undefined) {
        populateAttributeArray(assignedGroups, node.graph_node.attributes.hasAssignedGroup);
    }
    if (node.graph_node?.attributes?.subjectSpecies !== undefined) {
        populateAttributeArray(species, node.graph_node.attributes.subjectSpecies);
    }
    if (node.graph_node?.attributes?.subjectStrain !== undefined) {
        populateAttributeArray(strains, node.graph_node.attributes.subjectStrain);
    }

    return (
        <Box id={idDetails}>
            <Box className="tab-content">
                <SimpleLabelValue label={'Label'} value={title} heading={'Subject Details'} />

                { iterateSimpleValue('Age', node?.graph_node?.attributes?.age) }
                { iterateSimpleValue('Age Category', node?.graph_node?.attributes?.hasAgeCategory) }
                { iterateSimpleValue('Biological Sex', node?.graph_node?.attributes?.biologicalSex) }
                { <Box className="tab-content-row">
                    <Links href={node?.graph_node?.attributes?.hasDerivedInformationAsParticipant} title="Derived information as participant" />
                  </Box>
                }
                { <Box className="tab-content-row">
                    <Links href={node?.graph_node?.attributes?.participantInPerformanceOf} title="Participant in performance of" />
                  </Box>
                }
                { iterateSimpleValue('Specimen identifier', node?.graph_node?.attributes?.specimenHasIdentifier) }

                { species.length > 0
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Species</Typography>
                            <SimpleChip chips={species} />
                        </Box>)
                    : <> </>
                }
                { strains.length > 0
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Strains</Typography>
                            <SimpleChip chips={strains} />
                        </Box>)
                    : <> </>
                }
                { assignedGroups.length > 0
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Assigned Groups</Typography>
                            <SimpleChip chips={assignedGroups} />
                        </Box>)
                    : <> </>
                }
            </Box>
        </Box>
    );
};

export default SubjectDetails;
