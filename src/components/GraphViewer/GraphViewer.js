import * as d3 from 'd3-force-3d'
import Menu from '@material-ui/core/Menu';
import { IconButton, Tooltip,Typography, Box, Link, MenuItem, CircularProgress } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import LayersIcon from '@material-ui/icons/Layers';
import HelpIcon from '@material-ui/icons/Help';
import RefreshIcon from '@material-ui/icons/Refresh';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import BugReportIcon from '@material-ui/icons/BugReport';
import { selectInstance } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';
import {detailsLabel, GRAPH_SOURCE} from '../../constants';
import { rdfTypes, typesModel } from '../../utils/graphModel';
import { getPrunedTree,paintNode, collapseSubLevels, GRAPH_COLORS, TOP_DOWN, LEFT_RIGHT, RADIAL_OUT,
  ZOOM_SENSITIVITY,ZOOM_DEFAULT, ONE_SECOND } from '../../utils/GraphViewerHelper';
import config from "./../../config/app.json";
import AddRoundedIcon from '@material-ui/icons/AddRounded';
import RemoveRoundedIcon from '@material-ui/icons/RemoveRounded';
import {ViewTypeIcon} from "../../images/Icons";

const styles = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  margin: 'auto',
  color: "#11bffe",
  size: "55rem"
}

const GraphViewer = (props) => {
  const dispatch = useDispatch();

  const graphRef = React.useRef(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedLayout, setSelectedLayout] = React.useState(LEFT_RIGHT);
  const [layoutAnchorEl, setLayoutAnchorEl] = React.useState(null);
  const open = Boolean(layoutAnchorEl);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({ nodes : [], links : []});
  const nodeSelected = useSelector(state => state.sdsState.instance_selected.graph_node);
  const groupSelected = useSelector(state => state.sdsState.group_selected.graph_node);
  const [collapsed, setCollapsed] = React.useState(true);
  const [previouslySelectedNodes, setPreviouslySelectedNodes] = useState(new Set());

  const handleLayoutClick = (event) => {
    setLayoutAnchorEl(event.currentTarget);
  };

  const handleLayoutClose = () => {
    setLayoutAnchorEl(null);
  };

  const handleLayoutChange = (target) => {
    handleLayoutClose()
    setSelectedLayout(target);
    setForce();
  };

  const handleNodeLeftClick = (node, event) => {
    if ( node.type === rdfTypes.Subject.key || node.type === rdfTypes.Sample.key || node.type === rdfTypes.Collection.key ) {
      node.collapsed = !node.collapsed;
      collapseSubLevels(node, node.collapsed, { links : 0 });
      const updatedData = getPrunedTree(props.graph_id, selectedLayout.layout);
      setData(updatedData);
    } 
    handleNodeHover(node);

    if ( node?.id !== selectedNode?.id ) {
      dispatch(selectInstance({
        dataset_id: props.graph_id,
        graph_node: node.id,
        tree_node: node?.tree_reference?.id,
        source: GRAPH_SOURCE
      }));  
    }
    const divElement = document.getElementById(node.id + detailsLabel);
    divElement?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLinkColor = link => {
    let linkColor = GRAPH_COLORS.link;
    if ( highlightLinks.has(link) ) {
      linkColor = highlightNodes.has(link.source) || highlightNodes.has(link.target) ? GRAPH_COLORS.linkHover : GRAPH_COLORS.link;
    }

    return linkColor;
  };

  /**
   * Zoom to node when doing a right click on it
   * @param {*} node 
   * @param {*} event 
   */
  const handleNodeRightClick = (node, event) => {
    graphRef?.current?.ggv?.current.centerAt(node.x, node.y, ONE_SECOND);
    graphRef?.current?.ggv?.current.zoom(2, ONE_SECOND);
  };

  const expandAll = (event) => {
    window.datasets[props.graph_id].graph?.nodes?.forEach( node => {
      collapsed ? node.collapsed = !collapsed : node.collapsed = node?.type === typesModel.NamedIndividual.subject.type;
    })
    let updatedData = getPrunedTree(props.graph_id, selectedLayout.layout);
    setData(updatedData);
    setCollapsed(!collapsed)
  }

  /**
   * Zoom in
   * @param {*} event 
   */
  const zoomIn = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2) {
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom + value, ONE_SECOND / 10);
  };


  /**
   * Zoom out
   * @param {*} event
   */
  const zoomOut = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2) {
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom - value, ONE_SECOND / 10);
  };


  /**
   * Reset camera position
   */
  const resetCamera = () => {
    graphRef?.current?.ggv?.current.zoomToFit();
  };

  const setForce = () => {
    if ( selectedLayout.layout !== TOP_DOWN.layout || selectedLayout.layout !== LEFT_RIGHT.layout ){
      let force = -100;
      graphRef?.current?.ggv?.current.d3Force('link').distance(0).strength(1);
      graphRef?.current?.ggv?.current.d3Force("charge").strength(force * 2);
      graphRef?.current?.ggv?.current.d3Force('collision', d3.forceCollide(20)); 
      graphRef?.current?.ggv?.current.d3Force('x', d3.forceX());
      graphRef?.current?.ggv?.current.d3Force('y', d3.forceY());
      graphRef?.current?.ggv?.current.d3Force("manyBody", d3.forceManyBody().strength(node => force * Math.sqrt(100 / window.datasets[props.graph_id].graph.levelsMap[node.level]?.length )));
    }
    graphRef?.current?.ggv?.current.d3Force('center', null);
  }

  const onEngineStop = () => {
    setForce();
  }

  useEffect(() => {
    const updatedData = getPrunedTree(props.graph_id, selectedLayout.layout);
    setData(updatedData);
    setLoading(true);
    setForce();
    setTimeout ( () => { 
      setLoading(false);
      setForce();
    }, ONE_SECOND);
  }, []);

  useEffect(() => {
    const updatedData = getPrunedTree(props.graph_id, selectedLayout.layout);
    setData(updatedData);
  },[selectedLayout]);

  useEffect(() => {
    document.addEventListener("nodeVisible", (e) => {
      let visibleNodes = e.detail;
      let match = visibleNodes?.find( v => v?._attributes?.id === props.graph_id );
      if ( match ) {
        const updatedData = getPrunedTree(props.graph_id, selectedLayout.layout);
        setData(updatedData);
        setTimeout( timeout => {
          setForce()
          resetCamera();
        },100)
      }
    });
    document.addEventListener("nodeResized", (e) => {
      let visibleNodes = e.detail;
      let match = visibleNodes?.find( v => v?._attributes?.id === props.graph_id );
      if ( match ) {
        resetCamera();
      }
    });
  });

  useEffect(() => {
    if ( groupSelected ) { 
      setSelectedNode(groupSelected);
      handleNodeHover(groupSelected);
      graphRef?.current?.ggv?.current.centerAt(groupSelected.x, groupSelected.y, ONE_SECOND);
      graphRef?.current?.ggv?.current.zoom(2, ONE_SECOND);
    }
  },[groupSelected])
  
  useEffect(() => {
    if (selectedNode) {
      setPreviouslySelectedNodes(prev => new Set([...prev, selectedNode.id]));
    }
  }, [selectedNode]);

  useEffect(() => {
    if ( nodeSelected ) { 
      if ( nodeSelected?.id !== selectedNode?.id ){
        let node = nodeSelected;
        let collapsed = nodeSelected.collapsed
        while ( node?.parent && !collapsed ) {
          node = node.parent;
          collapsed = node.collapsed
        }
        if ( collapsed ) {
          node.collapsed = !node.collapsed;
          collapseSubLevels(node, node.collapsed, { links : 0 });
          const updatedData = getPrunedTree(props.graph_id, selectedLayout.layout);
          setData(updatedData);
        }
        setSelectedNode(nodeSelected);
        handleNodeHover(nodeSelected);
        graphRef?.current?.ggv?.current.centerAt(nodeSelected.x, nodeSelected.y, ONE_SECOND);
        graphRef?.current?.ggv?.current.zoom(2, ONE_SECOND);
      } else {
        handleNodeHover(nodeSelected);
      }
    }
  },[nodeSelected]) 

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors?.forEach(neighbor => highlightNodes.add(neighbor));
      node.links?.forEach(link => highlightLinks.add(link));
    }

    setHoverNode(node);
    setHighlightLinks(highlightLinks);
    setHighlightNodes(highlightNodes);
  };

  const handleLinkHover = link => {
    // Reset maps of hover nodes and links
    highlightNodes.clear();
    highlightLinks.clear();

    // We found link being hovered
    if (link) {
      // Keep track of hovered link, and it's source/target node
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    setHighlightLinks(highlightLinks);
    setHighlightNodes(highlightNodes);
  }

  return (
    <div className={'graph-view'}>
      { loading?
      <CircularProgress style={styles} />
      :
      <GeppettoGraphVisualization
        ref={ graphRef }
        id = {props.graph_id}
        // Graph data with Nodes and Links to populate
        data={data}
        // Create the Graph as 2 Dimensional
        d2={true}
        cooldownTicks={ ( selectedLayout.layout === TOP_DOWN.layout || selectedLayout.layout === LEFT_RIGHT.layout) ? 0 : data?.nodes?.length }
        onEngineStop={onEngineStop}
        // Links properties
        linkColor = {handleLinkColor}
        linkWidth={2}
        dagLevelDistance={( selectedLayout.layout !== TOP_DOWN.layout && selectedLayout.layout !== LEFT_RIGHT.layout  ) ? 0 : 60}
        linkDirectionalParticles={1}
        forceRadial={( selectedLayout.layout !== TOP_DOWN.layout && selectedLayout.layout !== LEFT_RIGHT.layout  ) ? 15 : 0}
        linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
        linkCanvasObjectMode={'replace'}
        onLinkHover={handleLinkHover}
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={(node, ctx) => paintNode(node, ctx, hoverNode, selectedNode, nodeSelected, previouslySelectedNodes)}
        nodeCanvasObjectMode={node => 'replace'}
        nodeVal = { node => {
          if ( selectedLayout.layout === TOP_DOWN.layout ){
            node.fx = node.xPos;
            node.fy = 50 * node.level;
          } else if ( selectedLayout.layout === LEFT_RIGHT.layout ){
            node.fx = 50 * node.level;
            node.fy = node.yPos;
          }
          return 100 / (node.level + 1);
        }}
        nodeRelSize={2.5}
        onNodeHover={handleNodeHover}
        // Allows updating link properties, as color and curvature. Without this, linkCurvature doesn't work.
        onNodeClick={(node, event) => handleNodeLeftClick(node, event)}
        onNodeRightClick={(node, event) => handleNodeRightClick(node, event)}
        // td = Top Down, creates Graph with root at top
        dagMode={selectedLayout.layout}
        // Handles error on graph
        onDagError={(loopNodeIds) => {}}
        // Disable dragging of nodes
        enableNodeDrag={false}
        // Allow camera pan and zoom with mouse
        enableZoomPanInteraction={true}
        enablePointerInteraction={true}
        // React element for controls goes here
        controls={
          <div>
          <div className='graph-view_controls'>
            <IconButton area-label="GraphLayout" aria-controls="layout-menu" aria-haspopup="true" onClick={handleLayoutClick}>
              <Tooltip id="button-report" title="Change Graph Layout">
                <ViewTypeIcon />
              </Tooltip>
            </IconButton>
            <Menu
              id="layout-menu"
              anchorEl={layoutAnchorEl}
              keepMounted
              open={open}
              onClose={handleLayoutClose}
            >
              <MenuItem selected={RADIAL_OUT.layout === selectedLayout.layout} onClick={() => handleLayoutChange(RADIAL_OUT)}>{RADIAL_OUT.label}</MenuItem>
              <MenuItem selected={TOP_DOWN.layout === selectedLayout.layout} onClick={() => handleLayoutChange(TOP_DOWN)}>{TOP_DOWN.label}</MenuItem>
              <MenuItem selected={LEFT_RIGHT.layout === selectedLayout.layout} onClick={() => handleLayoutChange(LEFT_RIGHT)}>{LEFT_RIGHT.label}</MenuItem>
            </Menu>
            <IconButton area-label="ZoomIn" onClick={(e) => zoomIn()}>
              <Tooltip id="button-report" title="Zoom In">
                <AddRoundedIcon />
              </Tooltip>
            </IconButton>
            <IconButton area-label="ZoomOut" onClick={(e) => zoomOut()}>
              <Tooltip id="button-report" title="Zoom Out">
                <RemoveRoundedIcon />
              </Tooltip>
            </IconButton>
            <IconButton area-label="ResetCamera" onClick={(e) => resetCamera()}>
              <Tooltip id="button-report" title="Reset Camera">
                <RefreshIcon />
              </Tooltip>
            </IconButton>
            <IconButton area-label="Expand" onClick={(e) => expandAll(e)}>
              <Tooltip id="button-report" title={ !collapsed ? "Collapse All" : "Expand All"}>
                { !collapsed ? <UnfoldLessIcon/> : <UnfoldMoreIcon /> }
              </Tooltip>
            </IconButton>
            <LayersIcon />
          </div>
          <div className='user-manual_controls'>
            <Box display="flex" justifyContent="center" alignItems='end'>
            <Typography justifyContent="right" variant='subtitle2' color='primary'> Version 1</Typography>
            <IconButton ustifyContent="right" component={Link} area-label="report" onClick={() => window.open(config.issues_url, '_blank')}>
              <Tooltip id="button-report" title="Report Issues">
                <BugReportIcon />
              </Tooltip>
            </IconButton>
            <IconButton ustifyContent="right" component={Link} area-label="manual" onClick={() => window.open(config.docs_url, '_blank')}>
              <Tooltip id="button-manual" title="User Manual Documentation">
                <HelpIcon />
              </Tooltip>
            </IconButton>
            </Box>
          </div>
          </div>
        }
      />
    }
    </div>
  );
};

export default GraphViewer;
