import {Box} from "@material-ui/core";
import NodeFooter from "./Footers/Footer";
import DetailsFactory from './factory';
import Breadcrumbs from "./Details/Views/Breadcrumbs";
import { IconButton, Tooltip } from '@material-ui/core';
import { subject_key, protocols_key, contributors_key } from '../../constants';
import {TuneRounded} from "@material-ui/icons";
import { useSelector, useDispatch } from 'react-redux'
import { toggleSettingsPanelVisibility } from '../../redux/actions';

const NodeDetailView = (props) => {
  const dispatch = useDispatch();

  var otherDetails = undefined;
  const factory = new DetailsFactory();
  const nodeSelected = useSelector(state => state.sdsState.instance_selected);
  const showSettingsContent = useSelector(state => state.sdsState.settings_panel_visible);
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
  while ( latestNodeVisited?.graph_node?.parent !== undefined ) {
    path.push(latestNodeVisited?.graph_node?.parent?.id);
    latestNodeVisited = {
      tree_node: undefined,
      graph_node: latestNodeVisited?.graph_node?.parent
    };
  };

  otherDetails = path.reverse().map( singleNode => {
    const graph_node = window.datasets[nodeSelected.dataset_id].splinter.nodes.get(singleNode);
    const new_node = {
      dataset_id: nodeSelected.dataset_id,
      graph_node: graph_node,
      tree_node: graph_node.tree_reference
    }
    if (new_node?.graph_node?.id !== subject_key
      && new_node?.graph_node?.id !== contributors_key
      && new_node?.graph_node?.id !== protocols_key) {
      links.pages.push({
        id: singleNode,
        title: graph_node.name,
        href: '#'
      });
      return factory.createDetails(new_node).getDetail()
    }
    return <> </>;
  });
  if ( nodeSelected?.graph_node ){
    links.current = {
      id: nodeSelected?.graph_node?.id,
      text: nodeSelected?.graph_node?.name
    };
  }
  const toggleContent = () => {
    dispatch(toggleSettingsPanelVisibility(!showSettingsContent));
  };

  return (
    <Box className={"secondary-sidebar" + (props.open ? " in" : "")}>
      <Box className="secondary-sidebar_breadcrumb" sx={{mt : "1rem"}}>
        <Breadcrumbs close={false} links={links} />
      </Box>
      {
        showSettingsContent && nodeDetails.getSettings ? nodeDetails.getSettings() : null
      }
      {
        !showSettingsContent ?
            <>
          { otherDetails }
          {nodeDetails.getDetail()}
        </> : null
      }
      <NodeFooter />
      { !showSettingsContent && <Box className='overlay-button-container'>
      <Tooltip id="button-report" title="Open Metadata Settings">
        <IconButton className="overlay-button" onClick={toggleContent}><TuneRounded /></IconButton>
      </Tooltip>
      </Box> }
    </Box>
  );
};
export default NodeDetailView;
