import { Box } from "@material-ui/core";
import NodeFooter from "./Footers/Footer";
import DetailsFactory from './factory';
import { useSelector } from 'react-redux'
import Breadcrumbs from "./Details/Views/Breadcrumbs";
import { subject_key, protocols_key, contributors_key } from '../../constants';

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
  var latestNodeVisited = nodeSelected;
  while ( latestNodeVisited.graph_node.parent !== undefined ) {
    path.push(latestNodeVisited.graph_node.parent.id);
    latestNodeVisited = {
      tree_node: undefined,
      graph_node: latestNodeVisited.graph_node.parent
    };
  };

  otherDetails = path.reverse().map( singleNode => {
    const graph_node = window.datasets[nodeSelected.dataset_id].splinter.nodes.get(singleNode);
    const new_node = {
      dataset_id: nodeSelected.dataset_id,
      graph_node: graph_node,
      tree_node: graph_node.tree_reference
    }
    if (new_node.graph_node.id !== subject_key
      && new_node.graph_node.id !== contributors_key
      && new_node.graph_node.id !== protocols_key) {
      links.pages.push({
        id: singleNode,
        title: graph_node.name,
        href: '#'
      });
      return factory.createDetails(new_node).getDetail()
    }
    return <> </>;
  });
  links.current = {
    id: nodeSelected.graph_node.id,
    text: nodeSelected.graph_node.name
  };

  return (
    <Box className={"secondary-sidebar" + (props.open ? " in" : "")}>
      <Box className="secondary-sidebar_breadcrumb" sx={{mt : "1rem"}}>
        <Breadcrumbs close={false} links={links} />
      </Box>
      {/**{ nodeDetails.getHeader() }*/}
      { otherDetails }
      { nodeDetails.getDetail() }
      <NodeFooter />
    </Box>
  );
};
export default NodeDetailView;
