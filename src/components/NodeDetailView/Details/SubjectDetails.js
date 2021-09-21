import React from "react";
import {
    Box,
    Typography,
    List,
    ListItemText,
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleChip from './Views/SimpleChip';
import USER from "../../../images/user.svg";
import CustomChips from './Views/CustomChips';
import SimpleLabelValue from './Views/SimpleLabelValue';

const SubjectDetails = (props) => {
    const { node } = props;
    const nodes = window.datasets[node.dataset_id].splinter.nodes;

    let title = "";
    // both tree and graph nodes are present, extract data from both
    if (node.tree_node && node.graph_node) {
        title = node.tree_node.basename;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node.graph_node) {
        title = node.graph_node.name;
    // the below is the case where we have data only from the graph
    } else {
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
    if (node.graph_node.attributes?.hasAssignedGroup !== undefined) {
        populateAttributeArray(assignedGroups, node.graph_node.attributes?.hasAssignedGroup);
    }
    if (node.graph_node.attributes?.subjectSpecies !== undefined) {
        populateAttributeArray(species, node.graph_node.attributes?.subjectSpecies);
    }
    if (node.graph_node.attributes?.subjectStrain !== undefined) {
        populateAttributeArray(strains, node.graph_node.attributes?.subjectStrain);
    }

    return (
        <Box className="secondary-sidebar_body">
            <Box className="tab-content">
                <SimpleLabelValue label={'Label'} value={title} heading={'Details'} />
                { node?.graph_node?.attributes?.age !== undefined
                    ? (<SimpleLabelValue label={'Age'} value={node?.graph_node?.attributes?.age[0]} />)
                    : <> </>
                }
                { node?.graph_node?.attributes?.hasAgeCategory !== undefined
                    ? (<SimpleLabelValue label={'Age Category'} value={node?.graph_node?.attributes?.hasAgeCategory[0]} />)
                    : <> </>
                }
                { node?.graph_node?.attributes?.biologicalSex !== undefined
                    ? (<SimpleLabelValue label={'Biological Sex'} value={node?.graph_node?.attributes?.biologicalSex[0]} />)
                    : <> </>
                }

                { species > 0
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
                { node.graph_node.attributes?.hasAssignedGroup.length > 0
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Assigned Groups</Typography>
                            <SimpleChip chips={node.graph_node.attributes?.hasAssignedGroup} />
                        </Box>)
                    : <> </>
                }
            </Box>
        </Box>
    );
};

export default SubjectDetails;
