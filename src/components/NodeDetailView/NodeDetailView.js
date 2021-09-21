import React from "react";
import { Box } from "@material-ui/core";
import NodeFooter from "./Footers/Footer";
import DetailsFactory from './factory';
import { useSelector } from 'react-redux'
import Breadcrumbs from "./Details/Views/Breadcrumbs";

const NodeDetailView = (props) => {
  var otherDetails = undefined;
  const factory = new DetailsFactory();
  const nodeSelected = useSelector(state => state.sdsState.instance_selected);
  const nodeDetails = factory.createDetails(nodeSelected);
  let links = {
    pages: [],
    current: {
      id: undefined,
      text: ""
    }
  };
  var path = []
  if (nodeSelected.tree_node !== undefined && nodeSelected.tree_node !== null) {
    path = [...nodeSelected.tree_node.path]
    path.shift();
    otherDetails = path.map( singleNode => {
      const graph_node = window.datasets[nodeSelected.dataset_id].splinter.nodes.get(singleNode);
      const tree_node = window.datasets[nodeSelected.dataset_id].splinter.tree_map.get(singleNode);
      const new_node = {
        dataset_id: nodeSelected.dataset_id,
        graph_node: graph_node,
        tree_node: tree_node
      }
      links.pages.unshift({
        id: singleNode,
        title: tree_node.text,
        href: '#'
      });
      return factory.createDetails(new_node).getDetail()
    });
    links.current = {
      id: nodeSelected.tree_node.id,
      text: nodeSelected.tree_node.text
    };
  } else {
    path = [];
    var latestNodeVisited = nodeSelected;
    while ( latestNodeVisited.graph_node.parent !== undefined ) {
      path.push(latestNodeVisited.graph_node.parent.id);
      latestNodeVisited = {
        tree_node: undefined,
        graph_node: latestNodeVisited.graph_node.parent
      };
    };

    otherDetails = path.map( singleNode => {
      const graph_node = window.datasets[nodeSelected.dataset_id].splinter.nodes.get(singleNode);
      const tree_node = window.datasets[nodeSelected.dataset_id].splinter.tree_map.get(singleNode);
      const new_node = {
        dataset_id: nodeSelected.dataset_id,
        graph_node: graph_node,
        tree_node: tree_node
      }
      links.pages.unshift({
        id: singleNode,
        title: graph_node.name,
        href: '#'
      });
      return factory.createDetails(new_node).getDetail()
    });
    links.current = {
      id: nodeSelected.graph_node.id,
      text: nodeSelected.graph_node.name
    };
  }

  return (
    <Box className={"secondary-sidebar" + (props.open ? " in" : "")}>
      <Box className="secondary-sidebar_header">
        <Breadcrumbs close={false} links={links} />
      </Box>
      { nodeDetails.getAll() }
      { otherDetails }
      <NodeFooter />
    </Box>
  );
};
export default NodeDetailView;
