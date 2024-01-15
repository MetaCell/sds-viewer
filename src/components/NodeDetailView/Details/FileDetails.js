import React from "react";
import {
    Box,
    Typography,
    List,
    ListItemText,
    Divider,
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';

const FileDetails = (props) => {
    const { node } = props;

    let title = "";
    let idDetails = "";
    // both tree and graph nodes are present, extract data from both
    if (node?.tree_node && node?.graph_node) {
        title = node.tree_node.basename;
        idDetails = node.tree_node.id + detailsLabel;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node.graph_node) {
        idDetails = node.graph_node.id + detailsLabel;
        title = node.graph_node.attributes?.label?.[0];
    // the below is the case where we have data only from the graph
    } else {
        title = node.tree_node.basename;
        idDetails = node.tree_node.id + detailsLabel;
    }

    let latestUpdate = "Not defined."
    if (node?.graph_node.attributes?.updated !== undefined) {
        latestUpdate = node?.attributes?.updated;
    }

    const DETAILS_LIST = [
        {
            title: 'Mimetype',
            value: node?.graph_node?.attributes?.mimetype
        },
        {
            title: 'Size Bytes',
            value: node?.graph_node?.attributes?.size
        }
    ];

    return (
        <Box className="secondary-sidebar_body" id={idDetails}>
            <Divider />
            <Box className="tab-content">
                { node.graph_node?.attributes?.identifier
                    ? (<Box className="tab-content-row">
                            <Typography component="h3">{"File Details"}</Typography>
                            <SimpleLabelValue label={'Label'} value={node.graph_node?.attributes?.identifier} />
                        </Box>)
                    : (<SimpleLabelValue label={'Label'} value={title} heading={'File Details'} />)
                }
                { node.graph_node?.attributes?.publishedURI && node.graph_node?.attributes?.publishedURI !== ""
                    ? (<Box className="tab-content-row">
                            <Typography component="label">Published Dataset File</Typography>
                            <Links key={`label_href_link`} href={node.graph_node?.attributes?.publishedURI} title={node.graph_node?.attributes?.identifier} />
                        </Box>)
                    : <></>
                }
                {latestUpdate ? 
                    <SimpleLabelValue label={'Updated On'} value={latestUpdate} />
                    : (<> </>)
                }
                { node?.tree_node?.uri_human !== undefined
                    ? (<Box className="tab-content-row">
                            <Links href={node?.tree_node?.uri_human} title="Human URI" />
                       </Box>)
                    : (<> </>)
                }

                { node?.tree_node?.checksums !== undefined
                    ? (<>
                            <SimpleLabelValue label={'Checksum'} value={node?.tree_node?.checksums[0].hex} />
                            <SimpleLabelValue label={'Checksum Algorithm'} value={node?.tree_node?.checksums[0].cypher} />
                        </>)
                    : (<> </>)
                }

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

                { node?.graph_node?.attributes?.hasUriHuman !== undefined
                    ? (<Box className="tab-content-row">
                            <Typography component="label">Links</Typography>
                            <Links key={`detail_links_dataset`} href={node?.graph_node?.attributes?.hasUriHuman[0]} title="Dataset" />
                        </Box>)
                    : <> </>
                }
            </Box>
        </Box>
    );
};

export default FileDetails;
