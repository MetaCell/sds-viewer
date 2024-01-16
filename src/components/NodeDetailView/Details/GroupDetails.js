import React from "react";
import {
    Box,
    Divider,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';

const GroupDetails = (props) => {
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
                <SimpleLabelValue label={'# of Subjects '} value={node?.graph_node?.subjects} heading={node?.graph_node?.name} />
            </Box>
        </Box>
    );
};

export default GroupDetails;
