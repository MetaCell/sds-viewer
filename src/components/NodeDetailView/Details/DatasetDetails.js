import React from "react";
import {
    Box,
    Typography,
    List,
    ListItemText,
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import USER from "../../../images/user.svg";
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';

const DatasetDetails = (props) => {
    const { node } = props;
    const nodes = window.datasets[node.dataset_id].splinter.nodes;

    let title = "";
    let label = "";
    let idDetails = "";
    let description = "";
    // both tree and graph nodes are present, extract data from both
    if (node?.tree_node && node?.graph_node) {
        idDetails = node.graph_node?.id + detailsLabel;
        label = node?.graph_node.attributes?.label?.[0];
        title = node?.graph_node.attributes?.title?.[0];
        description = node?.graph_node.attributes?.description?.[0];
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node?.tree_node) {
        label = node?.tree_node?.basename;
        idDetails = node?.tree_node?.id + detailsLabel;
    // the below is the case where we have data only from the graph
    } else {
        idDetails = node.graph_node?.id + detailsLabel;
        label = node.graph_node?.attributes?.label?.[0];
    }

    let latestUpdate = "Not defined."
    if (node?.graph_node?.attributes?.latestUpdate !== undefined) {
        latestUpdate = new Date(node.graph_node.attributes?.latestUpdate?.[0])
    }

    let contactPerson = [];
    if (node.graph_node.attributes?.hasResponsiblePrincipalInvestigator !== undefined) {
        node.graph_node.attributes?.hasResponsiblePrincipalInvestigator.map(user => {
            const contributor = nodes.get(user);
            contactPerson.push({
                name: contributor?.name,
                designation: 'Principal Investigator',
                img: USER
            });
            return user;
        });
    }

    if (node.graph_node.attributes?.hasContactPerson !== undefined) {
        node.graph_node.attributes?.hasContactPerson.map(user => {
            const contributor = nodes.get(user);
            contactPerson.push({
                name: contributor?.name,
                designation: 'Contributor',
                img: USER
            });
            return user;
        });
    }

    const DETAILS_LIST = [
        {
            title: 'Error Index',
            value: node.graph_node.attributes?.errorIndex
        },
        {
            title: 'Template Schema Version',
            value: node.graph_node.attributes?.hasDatasetTemplateSchemaVersion
        },
        {
            title: 'Experiment Modality',
            value: node.graph_node.attributes?.hasExperimentalModality
        }
    ];

    return (
        <Box id={idDetails}>
            <Box className="tab-content">
                <SimpleLabelValue label={'Title'} value={title} heading={'Dataset Details'} />
                { node.graph_node.attributes?.hasDoi && node.graph_node.attributes?.hasDoi?.[0] !== ""
                    ? (<Box className="tab-content-row">
                            <Typography component="label">Label</Typography>
                            <Links key={`label_href_link`} href={node.graph_node.attributes?.hasDoi?.[0]} title={label} />
                        </Box>)
                    : (<SimpleLabelValue label={'Label'} value={label} />)
                }
                <SimpleLabelValue label={'Description'} value={description} />

                <SimpleLabelValue label={'Updated On'} value={latestUpdate.toString()} />

                <Box className="tab-content-row">
                    <Typography component="label">About</Typography>
                    <SimpleLinkedChip chips={node.graph_node.attributes?.isAbout} />
                </Box>

                <Box className="tab-content-row">
                    <Typography component="label">Protocol Techniques</Typography>
                    <SimpleLinkedChip chips={node.graph_node.attributes?.protocolEmploysTechnique} />
                </Box>

                <Box className="tab-content-row">
                    <List component="nav" aria-label="main">
                        {
                            DETAILS_LIST?.map((item, index) => (
                                <ListItemText key={`detail_list_${index}`}>
                                    <Typography component="label">{item?.title}</Typography>
                                    <Typography>{item?.value}</Typography>
                                </ListItemText>
                            ))
                        }
                    </List>
                </Box>

                { node.graph_node.attributes?.hasExperimentalApproach !== undefined
                    ? (<SimpleLabelValue label={'Experimental Approach'} value={node.graph_node.attributes?.hasExperimentalApproach?.toString()} />
                    )
                    : <> </>
                }

                { node.graph_node.attributes?.hasDoi !== undefined
                    ? (<Box className="tab-content-row">
                            <Typography component="label">Links</Typography>
                            <Links key={`detail_links_dataset`} href={node.graph_node.attributes?.hasDoi?.[0]} title="Dataset" />
                        </Box>)
                    : <> </>
                }
                { node.graph_node.attributes?.hasAdditionalFundingInformation !== undefined
                    ? (<SimpleLabelValue label={'Additional Funding Information'} value={node.graph_node.attributes?.hasAdditionalFundingInformation} />
                    )
                    : <> </>
                }
                { node.graph_node.attributes?.statusOnPlatform !== undefined
                    ? (<SimpleLabelValue label={'Status on Platform'} value={node.graph_node.attributes?.statusOnPlatform} />
                    )
                    : <> </>
                }
                { node.graph_node.attributes?.hasLicense !== undefined
                    ? (<SimpleLabelValue label={'License'} value={node.graph_node.attributes?.hasLicense} />
                    )
                    : <> </>
                }
            </Box>
        </Box>
    );
};

export default DatasetDetails;
