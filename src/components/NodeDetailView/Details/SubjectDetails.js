import React from "react";
import {
    Box,
    Typography,
    List,
    ListItemText,
} from "@material-ui/core";
import SimpleChip from './Views/SimpleChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import Links from './Views/Links';
import { iterateSimpleValue, simpleValue } from './utils';
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

    const DETAILS_LIST = [
        {
            title: 'Weight Unit',
            value: node.graph_node.attributes?.weightUnit
        },
        {
            title: 'Weight Value',
            value: node.graph_node.attributes?.weightValue
        }
    ];

    return (
        <Box id={idDetails}>
            <Box className="tab-content">
                <SimpleLabelValue label={'Label'} value={title} heading={'Subject Details'} />

                { iterateSimpleValue('Age Category', node?.graph_node?.attributes?.hasAgeCategory) }
                { (node.graph_node.attributes?.ageValue && node.graph_node.attributes?.ageUnit)
                    ? simpleValue('Age', node.graph_node.attributes?.ageValue + ' ' + node.graph_node.attributes?.ageUnit)
                    : (node.graph_node.attributes?.ageBaseUnit && node.graph_node.attributes?.ageBaseValue)
                        ? simpleValue('Age', node.graph_node.attributes?.ageBaseValue + ' ' + node.graph_node.attributes?.ageBaseUnit)
                        : <> </>
                }

                <Box className="tab-content-row">
                    <List component="nav" aria-label="main">
                        {
                            DETAILS_LIST?.map((item, index) => {
                                if (item.value !== undefined) {
                                    return (<ListItemText key={`detail_list_${index}`}>
                                                <Typography component="label">{item?.title}</Typography>
                                                <Typography>{item?.value}</Typography>
                                        </ListItemText>);
                                } else {
                                    return <></>
                                }
                            })
                        }
                    </List>
                </Box>

                { iterateSimpleValue('Biological Sex', node?.graph_node?.attributes?.biologicalSex) }
                {
                    <Box className="tab-content-row">
                        <Links href={node?.graph_node?.attributes?.hasDerivedInformationAsParticipant} title="Derived information as participant" />
                    </Box>
                }
                {
                    <Box className="tab-content-row">
                        <Links href={node?.graph_node?.attributes?.participantInPerformanceOf} title="Participant in performance of" />
                    </Box>
                }
                { iterateSimpleValue('Specimen identifier', node?.graph_node?.attributes?.specimenHasIdentifier) }

                { node.graph_node?.attributes?.subjectSpecies && node.graph_node?.attributes?.subjectSpecies.length > 0
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Species</Typography>
                            <SimpleChip chips={node.graph_node?.attributes?.subjectSpecies} />
                        </Box>)
                    : <> </>
                }
                { node.graph_node?.attributes?.subjectStrain && node.graph_node?.attributes?.subjectStrain.length > 0
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Strains</Typography>
                            <SimpleChip chips={node.graph_node?.attributes?.subjectStrain} />
                        </Box>)
                    : <> </>
                }
                { node.graph_node?.attributes?.hasAssignedGroup && node.graph_node?.attributes?.hasAssignedGroup.length > 0
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Assigned Groups</Typography>
                            <SimpleChip chips={node.graph_node?.attributes?.hasAssignedGroup} />
                        </Box>)
                    : <> </>
                }
            </Box>
        </Box>
    );
};

export default SubjectDetails;
