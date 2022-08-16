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
        label = node?.graph_node.attributes?.label[0];
        title = node?.graph_node.attributes?.title[0];
        description = node?.graph_node.attributes?.description[0];
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node?.tree_node) {
        label = node?.tree_node?.basename;
        idDetails = node?.tree_node?.id + detailsLabel;
    // the below is the case where we have data only from the graph
    } else {
        idDetails = node.graph_node?.id + detailsLabel;
        label = node.graph_node?.attributes?.label[0];
    }

    let latestUpdate = "Not defined."
    if (node?.graph_node?.attributes?.latestUpdate !== undefined) {
        latestUpdate = new Date(node.graph_node.attributes?.latestUpdate[0])
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
                { title !== ""
                    ? (<>
                            <SimpleLabelValue label={'Title'} value={title} heading={'Dataset Details'} />
                            <SimpleLabelValue label={'Label'} value={label} />
                        </>)
                    : (<SimpleLabelValue label={'Label'} value={label} heading={'Dataset Details'} />)
                }
                : (<SimpleLabelValue label={'Description'} value={description} />)
                <SimpleLabelValue label={'Updated On'} value={latestUpdate.toString()} />
                <Box className="tab-content-row">
                    <Typography component="label">About</Typography>
                    <SimpleChip chips={node.graph_node.attributes?.isAbout} />
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

                { node.graph_node.attributes?.hasUriHuman !== undefined
                    ? (<Box className="tab-content-row">
                            <Typography component="label">Links</Typography>
                            <Links key={`detail_links_dataset`} href={node.graph_node.attributes?.hasUriHuman[0]} title="Dataset" />
                            <Links key={`detail_protocol_technique`} href={node.graph_node.attributes?.protocolEmploysTechnique} title="Protocol Technique" />
                        </Box>)
                    : <> </>
                }
            </Box>
        </Box>
    );
};

export default DatasetDetails;
