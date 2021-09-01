import React from "react";
import { Box, Typography } from "@material-ui/core";
import Breadcrumbs from "../Details/Views/Breadcrumbs";
import VOLUME from "../../../images/volume.svg";
import vars from "../../../styles/constant";

const CollectionHeader = (props) => {
    const { node } = props;
    const headingStyle = {
        color: vars["volume"],
        textTransform: 'capitalize'
    }

    let links = {
        pages: [],
        current: null
    };
    let title = undefined;
    // both tree and graph nodes are present, extract data from both
    if (node.tree_node && node.graph_node) {
        const path = [...node.tree_node.path];
        links.current =  window.datasets[node.dataset_id].splinter.tree_map.get(path.shift()).text;
        path.map( item => {
            links.pages.unshift({
                title: window.datasets[node.dataset_id].splinter.tree_map.get(item).text,
                href: '/'
            })
            return item;
        });
        title = node.tree_node.text;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node.tree_node) {
        const path = [...node.tree_node.path];
        links.current =  window.datasets[node.dataset_id].splinter.tree_map.get(path.shift()).text;
        path.map( (item, index) => {
            links.pages.unshift({
                title: window.datasets[node.dataset_id].splinter.tree_map.get(item).text,
                href: '/'
            })
            return item;
        });
        title = node.tree_node.text;
    // the below is the case where we have data only from the graph
    } else {
        links.pages.push({
            title: "..",
            href: "/"
        });
        links.current = node.graph_node.name;
        title = node.graph_node.name;
    }

    return (
        <Box className="secondary-sidebar_header">
            <Breadcrumbs close={props.close} links={links} />
            <img src={VOLUME} alt="Volume" />
            <Typography component="h3" style={headingStyle}>
                {title}
            </Typography>
        </Box>
    );
};

export default CollectionHeader;
