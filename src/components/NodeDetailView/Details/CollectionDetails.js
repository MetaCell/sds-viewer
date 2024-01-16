import React from "react";
import {
    Box, Divider,
    Typography
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';

const CollectionDetails = (props) => {
    const { node } = props;

    let title = "";
    let idDetails = "";
    // both tree and graph nodes are present, extract data from both
    if (node?.tree_node && node?.graph_node) {
        title = node.graph_node?.name;
        idDetails = node.graph_node?.id + detailsLabel;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node?.tree_node) {
        title = node.tree_node?.basename;
        idDetails = node.tree_node?.id + detailsLabel;
    // the below is the case where we have data only from the graph
    } else {
        title = node.graph_node?.name;
        idDetails = node.graph_node?.id + detailsLabel;
    }

    return (
        <Box className="secondary-sidebar_body" id={idDetails}>
            <Divider />
            <Box className="tab-content">
                <SimpleLabelValue label={'Label'} value={title} heading={'Collection Details'} />
                { node.graph_node?.attributes?.publishedURI && node.graph_node?.attributes?.publishedURI !== ""
                    ? (<Box className="tab-content-row">
                            <Typography component="label">SPARC Portal Link</Typography>
                            <Links key={`label_href_link`} href={node.graph_node?.attributes?.publishedURI} title={node.tree_node.basename} />
                        </Box>)
                    : <></>
                }
            </Box>
        </Box>
    );
};

export default CollectionDetails;
