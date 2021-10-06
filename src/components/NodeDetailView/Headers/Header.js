import React from "react";
import { Box, Typography } from "@material-ui/core";
import HELP from "../../../images/help.svg";
import vars from "../../../styles/constant";

const PersonHeader = (props) => {
    const { node } = props;
    const headingStyle = {
        color: vars["dataset"],
        textTransform: 'capitalize'
    }

    let title = undefined;
    if (node.graph_node) {
      title = node.graph_node.name;
    } else if (node.tree_node) {
        title = node.tree_node.text;
    } else {
        title = "Unknown node";
    }

    return (
        <Box className="secondary-sidebar_header">
            {/* <Breadcrumbs close={props.close} links={links} /> */}
            <img src={HELP} alt="Contributor" />
            <Typography component="h3" style={headingStyle}>
                {title}
            </Typography>
        </Box>
    );
};

export default PersonHeader;
