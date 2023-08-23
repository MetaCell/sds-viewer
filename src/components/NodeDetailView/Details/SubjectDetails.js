import React from "react";
import {
    Box,
    Typography,
    List,
    ListItemText,
} from "@material-ui/core";
import SimpleChip from './Views/SimpleChip';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import Links from './Views/Links';
import { iterateSimpleValue, simpleValue } from './utils';
import { detailsLabel } from '../../../constants';

const SubjectDetails = (props) => {
    const { node } = props;
    node.graph_node.dataset_id = node.dataset_id;
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

    const getGroupNode = (groupName, node)=> {
        let n = node.graph_node.parent;
        let match = false;
        while ( n && !match ) {
            if ( n.name === groupName ) {
              match = true;
            }else {
              n = n.parent;
            }
        }

        n.dataset_id = node.dataset_id;

        return n;
    }

    return (
        <Box id={idDetails}>
            <Box className="tab-content">
                { node.graph_node.attributes?.hasUriHuman && node.graph_node.attributes?.hasUriHuman[0] !== ""
                    ? (<Box className="tab-content-row">
                            <Typography component="h3">{"Subject Details"}</Typography>
                            <Typography component="label">Label</Typography>
                            <Links key={`label_href_link`} href={node.graph_node.attributes?.hasUriHuman[0]} title={title} />
                        </Box>)
                    : (( <Box className="tab-content-row">
                            <Typography component="label">Subject Details</Typography>
                            <SimpleLinkedChip chips={[{ value : title}]} node={node.graph_node} />
                        </Box>))
                }

                { node.graph_node?.attributes?.hasAgeCategory
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Age Category</Typography>
                            <SimpleLinkedChip chips={[{ value : node.graph_node?.attributes?.hasAgeCategory}]} node={getGroupNode(node.graph_node?.attributes?.hasAgeCategory[0], node)}/>
                        </Box>)
                    : <> </>
                }
                { (node.graph_node.attributes?.ageValue && node.graph_node.attributes?.ageUnit)
                    ? simpleValue('Age', node.graph_node.attributes?.ageValue + ' ' + node.graph_node.attributes?.ageUnit)
                    : (node.graph_node.attributes?.ageBaseUnit && node.graph_node.attributes?.ageBaseValue)
                        ? simpleValue('Age', node.graph_node.attributes?.ageBaseValue + ' ' + node.graph_node.attributes?.ageBaseUnit)
                        : <> </>
                }

                { (node.graph_node.attributes?.weightUnit && node.graph_node.attributes?.weightValue)
                    ? simpleValue('Weight', node.graph_node.attributes?.weightValue + ' ' + node.graph_node.attributes?.weightUnit)
                    : <> </>
                }

                { node.graph_node?.attributes?.biologicalSex
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Biological Sex</Typography>
                            <SimpleLinkedChip chips={[{ value : node.graph_node?.attributes?.biologicalSex}]} node={getGroupNode(node.graph_node?.attributes?.biologicalSex[0], node)} />
                        </Box>)
                    : <> </>
                }
                { iterateSimpleValue('Specimen identifier', node?.graph_node?.attributes?.specimenHasIdentifier) }
                { node.graph_node?.attributes?.subjectSpecies
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Species</Typography>
                            <SimpleLinkedChip chips={[{ value : node.graph_node?.attributes?.subjectSpecies}]} node={getGroupNode(node.graph_node?.attributes?.subjectSpecies[0], node)} />
                        </Box>)
                    : <> </>
                }
                { node.graph_node?.attributes?.subjectStrain
                    ? ( <Box className="tab-content-row">
                            <Typography component="label">Strains</Typography>
                            <SimpleLinkedChip chips={[{ value : node.graph_node?.attributes?.subjectStrain}]} node={getGroupNode(node.graph_node?.attributes?.subjectStrain[0], node)} />
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
