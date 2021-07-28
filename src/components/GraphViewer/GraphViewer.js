import React, { useState } from 'react';
import { IconButton } from '@material-ui/core';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RefreshIcon from '@material-ui/icons/Refresh';
import LayersIcon from '@material-ui/icons/Layers';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';

const NODE_FONT = "6px sans-serif";
const ONE_SECOND = 1000;
const ZOOM_DEFAULT = 1;
const ZOOM_SENSITIVITY = 0.2;
const GRAPH_COLORS = {
  link: 'rgba(255, 255, 255, 0.2)',
  hoverRect: '#CFD4DA',
  textHoverRect: '#3779E1',
  textHover: 'white',
  textColor: '#2E3A59'
}

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
      ctx.beginPath();
      ctx.drawImage(
        node.img,
        node.x - size,
        node.y - size,
        size * 2.4,
        size * 2.4
      );

      ctx.font = NODE_FONT;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Create Title in Node
      ctx.fillText(node.name, node.x + 2, node.y + 14 + size + 2);
      if (node === hoverNode) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = GRAPH_COLORS.hoverRect;
        ctx.fillRect(node.x - 14, node.y - 14, size * 3.2, size * 3.2);
        ctx.globalAlpha = 1.0;

        ctx.fillStyle = GRAPH_COLORS.textHoverRect;
        ctx.fillRect(node.x - 15, node.y + size + 10, size * 3.5, 12);

        ctx.fillStyle = GRAPH_COLORS.textHover;
        ctx.fillText(node.name, node.x + 2, node.y + 14 + size + 2);
      } else {
        ctx.fillStyle = GRAPH_COLORS.textColor;
        ctx.fillText(node.name, node.x + 2, node.y + 14 + size + 2);
      }

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
