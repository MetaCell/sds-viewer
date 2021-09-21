import React from "react";
import {
    Box,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';

const SampleDetails = (props) => {
    const { node } = props;

    let title = "";
    // both tree and graph nodes are present, extract data from both
    if (node.tree_node && node.graph_node) {
        title = node.tree_node.basename;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node.graph_node) {
        title = node.graph_node.attributes?.label[0];
    // the below is the case where we have data only from the graph
    } else {
        title = "Undefined Sample name";
    }

    return (
        <Box className="secondary-sidebar_body">
            <Box className="tab-content">
                <SimpleLabelValue label={'Label'} value={title} heading={'Details'} />
            </Box>
        </Box>
    );
};

export default SampleDetails;
