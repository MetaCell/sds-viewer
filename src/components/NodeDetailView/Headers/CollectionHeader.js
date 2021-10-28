import React from "react";
import { Box, Typography } from "@material-ui/core";
import VOLUME from "../../../images/volume.svg";
import vars from "../../../styles/constant";

const CollectionHeader = (props) => {
    const { node } = props;
    const headingStyle = {
        color: vars["volume"],
        textTransform: 'capitalize'
    }

    let title = undefined;
    if (node.tree_node && node.graph_node) {
        title = node.tree_node.text;
    } else if (node.tree_node) {
        title = node.tree_node.text;
    } else {
        title = node.graph_node.name;
    }

    return (
        <Box className="secondary-sidebar_header">
            <img src={VOLUME} alt="Volume" />
            <Typography component="h3" style={headingStyle}>
                {title}
            </Typography>
        </Box>
    );
};

export default CollectionHeader;
