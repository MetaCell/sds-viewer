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
const ZOOM_SENSITIVITY = .2;

const GraphViewer = (props) => {
  const graphRef = React.useRef(null);

  const handleNodeClick = (node, event) => {
    graphRef.current.ggv.current.centerAt(node.x , node.y, ONE_SECOND);
    graphRef.current.ggv.current.zoom(2, ONE_SECOND);
  }

  const zoomIn = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2 ){
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom + value , ONE_SECOND/10);
  }

  const zoomOut = (event) => {
    let zoom = graphRef.current.ggv.current.zoom();
    let value = ZOOM_DEFAULT;
    if (zoom < 2 ){
      value = ZOOM_SENSITIVITY;
    }
    graphRef.current.ggv.current.zoom(zoom - value , ONE_SECOND/10);
  }

  const resetCamera = (event) => {
    graphRef.current.ggv.current.zoomToFit();
  }

  React.useEffect(() => {
    setTimeout( () => graphRef?.current?.ggv?.current?.zoomToFit(), ONE_SECOND/2);
  });

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
  };

  const handleNodeHover = node => {
    highlightNodes.clear();
    if (node) {
      highlightNodes.add(node);
    }
    setHoverNode(node || null);
    updateHighlight();
  };

  const paintRing = React.useCallback((node, ctx) => {
    const size = 20;
    ctx.beginPath();
    ctx.drawImage(node.img, node.x - size, node.y - size , size * 2, size * 2);

    ctx.font = NODE_FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = 'middle';
    // Create Title in Node
    ctx.fillText(node.name, node.x, node.y + 11 + size);
    if(node === hoverNode){
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#CFD4DA';
      ctx.fillRect(node.x - size, node.y - size , size * 2, size * 2);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#3779E1';
      ctx.fillRect(node.x - 15, node.y + size + 5, size * 1.5, 12 );
      ctx.fillStyle = "white";
      ctx.fillText(node.name, node.x, node.y + 11 + size);
    } else {
      ctx.fillStyle = "black";
      ctx.fillText(node.name, node.x, node.y + 11 + size);
    }

    node.fy = 100 * node.level;
  }, [hoverNode]);

  return (
    <div className={"graph-view"}>
      <GeppettoGraphVisualization
        ref={graphRef}
        // Graph data with Nodes and Links to populate
        data={window.datasets[props.graph_id].graph}
        // Create the Graph as 2 Dimensional
        d2={true}
        nodeRelSize={20}
        nodeSize={30}
        // Links properties
        linkColor="#2E3A59"
        linkCurvature={link => link.target.x < link.source.x ? -.2 : .2}
        // Allows updating link properties, as color and curvature. Without this, linkCurvature doesn't work.
        linkCanvasObjectMode={"replace"}
        onNodeClick = { (node,event) => handleNodeClick(node,event) }
        onNodeHover={handleNodeHover}
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={paintRing}
        // nodeCanvasObjectMode={node => highlightNodes.has(node) ? 'before' : undefined}
        // td = Top Down, creates Graph with root at top
        dagMode="td"
        // Handles error on graph
        onDagError={loopNodeIds => {}}
        // Disable dragging of nodes
        enableNodeDrag={false}
        // Allow camera pan and zoom with mouse
        enableZoomPanInteraction={true}
        enablePointerInteraction={true}
        // React element for controls goes here
        controls = {
          <div className="graph-view_controls">
            <IconButton onClick={(e) => zoomIn()}><ZoomInIcon/></IconButton>
            <IconButton onClick={(e) => zoomOut()}><ZoomOutIcon/></IconButton>
            <IconButton onClick={(e) => resetCamera()}><RefreshIcon/></IconButton>
            <LayersIcon/>
          </div>
        }
      />
    </div>
  );
};

export default GraphViewer;
