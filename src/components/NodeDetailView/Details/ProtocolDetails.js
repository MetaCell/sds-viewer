import React from "react";
import {
    Box,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';
import { iterateSimpleValue } from './utils';
import { detailsLabel } from '../../../constants';

const ProtocolDetails = (props) => {
    const { node } = props;

    let title = "";
    let idDetails = "";
    // both tree and graph nodes are present, extract data from both
    if (node?.tree_node && node?.graph_node) {
        idDetails = node.tree_node.id + detailsLabel;
        title = node.tree_node.basename;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node?.graph_node) {
        idDetails = node.graph_node.id + detailsLabel;
        title = node.graph_node.attributes?.label[0];
    // the below is the case where we have data only from the graph
    } else {
        idDetails = node.tree_node.id + detailsLabel;
        title = "Undefined protocol";
    }

    return (
        <Box id={idDetails}>
            <Box className="tab-content">
                <SimpleLabelValue label={'Label'} value={title} heading={'Protocol Details'} />
                { iterateSimpleValue('Number of steps', node?.graph_node?.attributes?.protocolHasNumberOfSteps) }
            </Box>
        </Box>
    );
};

export default ProtocolDetails;
