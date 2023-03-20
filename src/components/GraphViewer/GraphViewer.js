import * as d3 from 'd3-force-3d'
import Menu from '@material-ui/core/Menu';
import { IconButton, Tooltip } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useState, useEffect } from 'react';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import LayersIcon from '@material-ui/icons/Layers';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RefreshIcon from '@material-ui/icons/Refresh';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import { selectInstance } from '../../redux/actions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';
import { GRAPH_SOURCE } from '../../constants';
import { rdfTypes, typesModel } from '../../utils/graphModel';

const NODE_FONT = '500 5px Inter, sans-serif';
const ONE_SECOND = 1000;
const LOADING_TIME = 3000;
const ZOOM_DEFAULT = 1;
const ZOOM_SENSITIVITY = 0.2;
const GRAPH_COLORS = {
  link: '#CFD4DA',
  linkHover : 'purple',
  hoverRect: '#CFD4DA',
  textHoverRect: '#3779E1',
  textHover: 'white',
  textColor: '#2E3A59',
  collapsedFolder : 'red'
};
const TOP_DOWN = {
  label : "Tree View",
  layout : "td",
  maxNodesLevel : (graph) => { 
    return graph.hierarchyVariant;
  }
};
const RADIAL_OUT = {
  label : "Radial View",
  layout : "null",
  maxNodesLevel : (graph) => { 
    return graph.radialVariant
  }
};

const roundRect = (ctx, x, y, width, height, radius, color, alpha) => {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.globalAlpha = alpha || 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
};

const GraphViewer = (props) => {
  const dispatch = useDispatch();
  const getPrunedTree = () => {
    let nodesById = Object.fromEntries(window.datasets[props.graph_id].graph?.nodes?.map(node => [node.id, node]));
    window.datasets[props.graph_id].graph?.links?.forEach(link => {
      const source = (typeof link.source) === 'object' ? link.source.id : link.source;
      const target = (typeof link.target) === 'object' ? link.target.id : link.target;
      const linkFound = !nodesById[source]?.childLinks?.find( l =>
        source === ((typeof l.source) === 'object' ? l.source.id : l.source) && target === ((typeof l.target) === 'object' ? l.target.id : l.target) 
      );
      if ( linkFound ) {
        nodesById[source]?.childLinks?.push(link);
      }
    });
  
    const visibleNodes = [];
    const visibleLinks = [];

    (function traverseTree(node = nodesById[window.datasets[props.graph_id].graph?.nodes?.[0].id]) {
      visibleNodes.push(node);
      if (node.collapsed) return;
      visibleLinks.push(...node.childLinks);
      let nodes = node.childLinks.map(link => (typeof link.target) === 'object' ? link.target : nodesById[link.target]);
      nodes?.forEach(traverseTree);
    })(); // IIFE

    return { nodes : visibleNodes, links : visibleLinks, levelsMap : window.datasets[props.graph_id].graph.levelsMap, hierarchyVariant : window.datasets[props.graph_id].graph.hierarchyVariant };
  };

  const graphRef = React.useRef(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedLayout, setSelectedLayout] = React.useState(RADIAL_OUT);
  const [layoutAnchorEl, setLayoutAnchorEl] = React.useState(null);
  const [cameraPosition, setCameraPosition] = useState({ x : 0 , y : 0 });
  const open = Boolean(layoutAnchorEl);
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState(getPrunedTree());
  const nodeSelected = useSelector(state => state.sdsState.instance_selected.graph_node);
  const [collapsed, setCollapsed] = React.useState(true);

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
    if ( node?.id === selectedNode?.id ) {
      if ( node.type === rdfTypes.Subject.key || node.type === rdfTypes.Collection.key 
        || node.type === rdfTypes.Group.key || node.type === rdfTypes.Sample.key ) {
        node.collapsed = !node.collapsed;
        const updatedData = getPrunedTree();
        setData(updatedData);
      }
    }
    dispatch(selectInstance({
      dataset_id: props.graph_id,
      graph_node: node.id,
      tree_node: node?.tree_reference?.id,
      source: GRAPH_SOURCE
    }));
    setSelectedNode(node);
    setTimeout( () => node?.id === selectedNode?.id && handleNodeRightClick(node), data?.nodes?.length + data?.links?.length );
  };

  useEffect(() => {
    resetCamera();
    setForce();
  }, []);

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
    setCameraPosition({ x :  node.x , y :  node.y });
  };

  const expandAll = (event) => {
    window.datasets[props.graph_id].graph?.nodes?.forEach( node => {
      collapsed ? node.collapsed = !collapsed : node.collapsed = node?.parent?.type === typesModel.NamedIndividual.subject.type;
    })
    let updatedData = getPrunedTree();
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
    let center =  graphRef?.current?.ggv?.current.centerAt();
    setCameraPosition({ x :  center?.x , y :  center?.y });
  };

  const setForce = () => {
    let force = -150;
    if ( selectedLayout.layout === TOP_DOWN.layout ) {
      force = -150;
    } else if ( selectedLayout.layout === RADIAL_OUT.layout ) {
      force = -100;
    } 
    graphRef?.current?.ggv?.current.d3Force('link').strength(1);
    graphRef?.current?.ggv?.current.d3Force("charge").strength(force * 2);
    graphRef?.current?.ggv?.current.d3Force('collision', d3.forceCollide(20)); 
    graphRef?.current?.ggv?.current.d3Force('x', d3.forceX());
    graphRef?.current?.ggv?.current.d3Force('y', d3.forceY());
    graphRef?.current?.ggv?.current.d3Force('center', d3.forceCenter(0,0));
    graphRef?.current?.ggv?.current.d3Force("manyBody", d3.forceManyBody().strength(node => force * Math.sqrt(100 / graphRef?.current?.props?.data?.levelsMap[node.level]?.length )));
  }

  const onEngineStop = () => {
    setForce();
  }

  useEffect(() => {
    setLoading(true);
    setForce();

    setTimeout ( () => { 
      setLoading(false);
      setForce();
    }, LOADING_TIME);
  }, []);

  useEffect(() => {
    setForce();
},[selectedLayout]) 

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

  const paintNode = React.useCallback(
    (node, ctx) => {
      const size = 7.5;
      const nodeImageSize = [size * 2.4, size * 2.4];
      const hoverRectDimensions = [size * 4.2, size * 4.2];
      const hoverRectPosition = [node.x - hoverRectDimensions[0]/2, node.y - hoverRectDimensions[1]/2];
      const textHoverPosition = [
        hoverRectPosition[0],
        hoverRectPosition[1] + hoverRectDimensions[1],
      ];
      const hoverRectBorderRadius = 1;
      ctx.beginPath();

      try {
        node.type === rdfTypes.Sample.key && console.log("Node ", node);
        ctx.drawImage(
          node?.img,
          node.x - size,
          node.y - size,
          ...nodeImageSize
        );
      } catch (error) {
        const img = new Image();
        img.src = rdfTypes.Unknown.image;
        node.img = img;
        console.log("Node ", node);

        // Add default icon if new icon wasn't found under images
        ctx.drawImage(
          node?.img,
          node.x - size - 1,
          node.y - size,
          ...nodeImageSize
        );
      }

      ctx.font = NODE_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      let nodeName = node.name;
      if (nodeName.length > 10) {
        nodeName = nodeName.substr(0, 9).concat('...');
      } else if ( Array.isArray(nodeName) ){
        nodeName = nodeName[0]?.substr(0, 9).concat('...');
      }
      const textProps = [nodeName, node.x, textHoverPosition[1]];
      if (node === hoverNode || node?.id === selectedNode?.id || node?.id === nodeSelected?.id ) {
        // image hover
        roundRect(
          ctx,
          ...hoverRectPosition,
          ...hoverRectDimensions,
          hoverRectBorderRadius,
          GRAPH_COLORS.hoverRec,
          0.3
        );
        // text node name hover
        roundRect(
          ctx,
          ...textHoverPosition,
          hoverRectDimensions[0],
          hoverRectDimensions[1] / 4,
          hoverRectBorderRadius,
          GRAPH_COLORS.textHoverRect
        );
        // reset canvas fill color
        ctx.fillStyle = GRAPH_COLORS.textHover;
      } else {
        ctx.fillStyle = GRAPH_COLORS.textColor;
      }
      ctx.fillText(...textProps);
      if ( node.childLinks?.length && node.collapsed ) {
        const collapsedNodes = [node.childLinks?.length, node.x, textHoverPosition[1]];
        ctx.fillStyle = GRAPH_COLORS.collapsedFolder;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(...collapsedNodes);
        ctx.fillStyle = GRAPH_COLORS.textColor;
      }
    },
    [hoverNode]
  );

  return (
    <div className={'graph-view'}>
      { loading?
      <CircularProgress style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
        margin: 'auto',
        color: "#11bffe",
        size: "55rem"
      }} />
      :
      <GeppettoGraphVisualization
        ref={ graphRef }
        // Graph data with Nodes and Links to populate
        data={data}
        // Create the Graph as 2 Dimensional
        d2={true}
        onEngineStop={onEngineStop}
        // cooldownTime={data?.nodes?.length + data?.links?.length * 10}
        // Links properties
        linkColor = {handleLinkColor}
        linkWidth={2}
        dagLevelDistance={selectedLayout.layout === TOP_DOWN.layout ? 60 : 0}
        linkDirectionalParticles={1}
        forceRadial={15}
        warmupTicks={data?.nodes?.length}
        linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
        linkCanvasObjectMode={'replace'}
        onLinkHover={handleLinkHover}
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={paintNode}
        // d3VelocityDecay={0.3}
        nodeCanvasObjectMode={node => 'replace'}
        nodeVal = { node => 
          100 / (node.level + 1)
        }
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
          <div className='graph-view_controls'>
            <IconButton area-label="GraphLayout" aria-controls="layout-menu" aria-haspopup="true" onClick={handleLayoutClick}>
              <Tooltip id="button-report" title="Change Graph Layout">
                <FormatAlignCenterIcon />
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
            </Menu>
            <IconButton area-label="ZoomIn" onClick={(e) => zoomIn()}>
              <Tooltip id="button-report" title="Zoom In">
                <ZoomInIcon />
              </Tooltip>
            </IconButton>
            <IconButton area-label="ZoomOut" onClick={(e) => zoomOut()}>
              <Tooltip id="button-report" title="Zoom Out">
                <ZoomOutIcon />
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
        }
      />
    }
    </div>
  );
};

export default GraphViewer;
