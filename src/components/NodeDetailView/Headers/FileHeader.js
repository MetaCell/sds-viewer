import React from "react";
import { Box, Typography } from "@material-ui/core";
import FILE from "../../../images/nifti.svg";
import vars from "../../../styles/constant";

const FileHeader = (props) => {
    const { node } = props;
    const headingStyle = {
        color: vars["nifti"],
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
            <img src={FILE} alt="File" />
            <Typography component="h3" style={headingStyle}>
                {title}
            </Typography>
        </Box>
    );
};

export default FileHeader;
