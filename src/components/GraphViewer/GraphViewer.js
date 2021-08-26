import * as d3 from 'd3';
import Menu from '@material-ui/core/Menu';
import { IconButton } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useState, useEffect } from 'react';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import LayersIcon from '@material-ui/icons/Layers';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RefreshIcon from '@material-ui/icons/Refresh';
import { selectInstance } from '../../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';

const NODE_FONT = '500 6px Inter, sans-serif';
const ONE_SECOND = 1000;
const ZOOM_DEFAULT = 1;
const ZOOM_SENSITIVITY = 0.2;
const GRAPH_COLORS = {
  link: '#CFD4DA',
  linkHover : 'purple',
  hoverRect: '#CFD4DA',
  textHoverRect: '#3779E1',
  textHover: 'white',
  textColor: '#2E3A59',
};
const TOP_DOWN = {
  label : "Top Down",
  layout : "td"
};
const RADIAL_OUT = {
  label : "Radial",
  layout : "radialout"
};
const LINK_DISTANCE = 200;

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
  const graphRef = React.useRef(null);
  const [hoverNode, setHoverNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedLayout, setSelectedLayout] = React.useState(RADIAL_OUT.layout);
  const [layoutAnchorEl, setLayoutAnchorEl] = React.useState(null);
  const open = Boolean(layoutAnchorEl);

  const nodeSelected = useSelector(state => state.sdsState.instance_selected.graph_node);

  const handleLayoutClick = (event) => {
    setLayoutAnchorEl(event.currentTarget);
  };

  const handleLayoutClose = () => {
    setLayoutAnchorEl(null);
  };

  const handleLayoutChange = (target) => {
    handleLayoutClose()
    setSelectedLayout(target);
  };

  const handleNodeLeftClick = (node, event) => {
    dispatch(selectInstance({
      graph_node: node,
      tree_node: node.tree_reference
    }));
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
   * @param {*} event
   */
  const resetCamera = (event) => {
    graphRef.current.ggv.current.zoomToFit();
  };


  /**
   * Stop graph rendering
   */
  const engineStop = () => {
    graphRef?.current?.ggv?.current?.zoomToFit();
  }

  // Check State updates triggered by Redux at a global level
  if (nodeSelected && nodeSelected?.id !== selectedNode?.id) {
    let node = graphRef.current.props.data.nodes.find( item => item.id === nodeSelected.id);
    if (node) {
      setSelectedNode(node);
    handleNodeRightClick(node, null);
    }
  }

  useEffect(() => {
    setTimeout(
      () => { 
        graphRef?.current?.ggv?.current?.d3Force('charge').strength(-20 * window.datasets[props.graph_id].graph.nodes.length);
        graphRef?.current?.ggv?.current?.d3Force("collide", d3.forceCollide(30));
        graphRef?.current?.ggv?.current?.d3Force('link').distance(link => { 
          let level = link?.target?.level;

          let distance = LINK_DISTANCE;
          if ( level > 1){
            distance = 0;
          }

          return distance;
        });
      },
      ONE_SECOND
    );
  }, []);

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
      node.links.forEach(link => highlightLinks.add(link));
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
      const size = 10;
      const nodeImageSize = [size * 2.4, size * 2.4];
      const hoverRectDimensions = [size * 3.2, size * 3.2];
      const hoverRectPosition = [node.x - 14, node.y - 14];
      const textHoverPosition = [
        hoverRectPosition[0] - 2,
        hoverRectPosition[1] + hoverRectDimensions[1] + 2,
      ];
      const hoverRectBorderRadius = 2;
      ctx.beginPath();

      ctx.drawImage(
        node.img,
        node.x - size - 1,
        node.y - size,
        ...nodeImageSize
      );
      ctx.font = NODE_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let nodeName = node.name;
      if (nodeName.length > 15) {
        nodeName = nodeName.substr(0, 15).concat('...');
      }
      const textProps = [nodeName, node.x + 2, textHoverPosition[1] + 4.5];
      if (node === hoverNode) {
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
          hoverRectDimensions[0] + size / 2,
          hoverRectDimensions[0] / 4,
          hoverRectBorderRadius / 2,
          GRAPH_COLORS.textHoverRect
        );
        // reset canvas fill color
        ctx.fillStyle = GRAPH_COLORS.textHover;
      } else {
        ctx.fillStyle = GRAPH_COLORS.textColor;
      }
      ctx.fillText(...textProps);
    },
    [hoverNode]
  );

  return (
    <div className={'graph-view'}>
      <GeppettoGraphVisualization
        ref={graphRef}
        // Graph data with Nodes and Links to populate
        data={window.datasets[props.graph_id].graph}
        // Create the Graph as 2 Dimensional
        d2={true}
        d3VelocityDecay={.1}
        warmupTicks={1000}
        cooldownTicks={1}
        nodeVal={node => 
         100 / (node.level + 1)
        }
        onEngineStop={resetCamera}
        // Links properties
        linkColor = {handleLinkColor}
        linkWidth={2}
        onLinkHover={handleLinkHover}
        linkCanvasObjectMode={'replace'}
        nodeRelSize={20}
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={node => 'replace'}
        onNodeHover={handleNodeHover}
        // Allows updating link properties, as color and curvature. Without this, linkCurvature doesn't work.
        onNodeClick={(node, event) => handleNodeLeftClick(node, event)}
        onNodeRightClick={(node, event) => handleNodeRightClick(node, event)}
        // td = Top Down, creates Graph with root at top
        dagMode={selectedLayout}
        dagLevelDistance={LINK_DISTANCE}
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
            <IconButton aria-controls="layout-menu" aria-haspopup="true" onClick={handleLayoutClick}>
              <FormatAlignCenterIcon />
            </IconButton>
            <Menu
              id="layout-menu"
              anchorEl={layoutAnchorEl}
              keepMounted
              open={open}
              onClose={handleLayoutClose}
            >
              <MenuItem selected={RADIAL_OUT.layout === selectedLayout} onClick={() => handleLayoutChange(RADIAL_OUT.layout)}>{RADIAL_OUT.label}</MenuItem>
              <MenuItem selected={TOP_DOWN.layout === selectedLayout} onClick={() => handleLayoutChange(TOP_DOWN.layout)}>{TOP_DOWN.label}</MenuItem>
            </Menu>
            <IconButton onClick={(e) => zoomIn()}>
              <ZoomInIcon />
            </IconButton>
            <IconButton onClick={(e) => zoomOut()}>
              <ZoomOutIcon />
            </IconButton>
            <IconButton onClick={(e) => resetCamera()}>
              <RefreshIcon />
            </IconButton>
            <LayersIcon />
          </div>
        }
      />
    </div>
  );
};

export default GraphViewer;
