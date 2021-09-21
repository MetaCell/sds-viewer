import React from "react";
import {
    Box,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';

const PersonDetails = (props) => {
    const { node } = props;

    let title = "";
    // both tree and graph nodes are present, extract data from both
    if (node.tree_node && node.graph_node) {
        title = node.graph_node.name;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node.tree_node) {
        title = node.tree_node.basename;
    // the below is the case where we have data only from the graph
    } else {
        title = node.graph_node.name;
    }

    return (
        <Box className="secondary-sidebar_body">
            <Box className="tab-content">
                <SimpleLabelValue label={'Name'} value={title.toString()} heading={'Details'} />
            </Box>
        </Box>
    );
};

export default PersonDetails;
