import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RefreshIcon from '@material-ui/icons/Refresh';
import LayersIcon from '@material-ui/icons/Layers';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';

const NODE_FONT = '500 6px Inter, sans-serif';
const ONE_SECOND = 1000;
const ZOOM_DEFAULT = 1;
const ZOOM_SENSITIVITY = 0.2;
const GRAPH_COLORS = {
  link: 'rgba(255, 255, 255, 0.2)',
  hoverRect: '#CFD4DA',
  textHoverRect: '#3779E1',
  textHover: 'white',
  textColor: '#2E3A59',
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
  const graphRef = React.useRef(null);

  const handleNodeClick = (node, event) => {
    // graphRef.current.ggv.current.centerAt(node.x, node.y, ONE_SECOND);
    // graphRef.current.ggv.current.zoom(2, ONE_SECOND);
  };

  const zoomIn = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2) {
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom + value, ONE_SECOND / 10);
  };

  const zoomOut = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2) {
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom - value, ONE_SECOND / 10);
  };

  const resetCamera = (event) => {
    graphRef.current.ggv.current.zoomToFit();
  };

  React.useEffect(() => {
    setTimeout(
      () => graphRef?.current?.ggv?.current?.zoomToFit(),
      ONE_SECOND / 2
    );
  });

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
  };

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    if (node) {
      highlightNodes.add(node);
    }
    setHoverNode(node || null);
    updateHighlight();
  };

  const paintNode = React.useCallback(
    (node, ctx) => {
      const size = 10;
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
        size * 2.4,
        size * 2.4
      );
      ctx.font = NODE_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      let nodeName = node.name;
      if (nodeName.length > 8) {
        nodeName = nodeName.substr(0, 8).concat('...');
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
      node.fy = 100 * node.level;
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
        nodeRelSize={20}
        nodeSize={30}
        // Links properties
        linkColor={GRAPH_COLORS.link}
        linkWidth={2}
        linkCurvature={(link) => (link.target.x < link.source.x ? -0.2 : 0.2)}
        // Allows updating link properties, as color and curvature. Without this, linkCurvature doesn't work.
        linkCanvasObjectMode={'replace'}
        onNodeClick={(node, event) => handleNodeClick(node, event)}
        onNodeHover={handleNodeHover}
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={paintNode}
        // td = Top Down, creates Graph with root at top
        dagMode='td'
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
