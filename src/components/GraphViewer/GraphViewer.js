import React, { createRef } from 'react';
import { Box } from '@material-ui/core';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';
import { staticGraphData } from './data.js';

const GraphViewer = (props) => {
  const graphRef = React.useRef(null);

  const handleNodeRightClick = (node, event) => {
    graphRef.current.ggv.current.centerAt(node.x , node.y, 1000);
    graphRef.current.ggv.current.zoom(2, 1000);
  }

  React.useEffect(() => {
    setTimeout( () => graphRef.current.ggv.current.zoomToFit(), 500);
  });

  return (
    <div style={{ height : "100%"}}>
      <GeppettoGraphVisualization
        ref={graphRef}
        // Graph data with Nodes and Links to populate
        data={staticGraphData}
        // Create the Graph as 2 Dimensional
        d2={true}
        nodeRelSize={20}
        nodeSize={30}
        // Links properties
        linkColor="black"
        linkCurvature={ .3 }
        linkDirectionalArrowLength={.1}
        onNodeHover ={ (node,event) => "Title"}
        onNodeClick = { (node,event) => handleNodeRightClick(node,event) }
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 12;
          ctx.drawImage(node.img, node.x - size / 2, node.y - size , size, size);

          ctx.font = "5px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = 'middle';
          // Create Title in Node
          ctx.fillText(node.name,node.x, node.y + size / 2);

          node.fy = 100 * node.level;
        }}
        // Overwrite Node Canvas Object
        nodeCanvasObjectMode={node => 'replace'}
        // bu = Bottom Up, creates Graph with root at top
        dagMode="td"
        // Handles error on graph
        onDagError={loopNodeIds => {}}
        // Handles clicking event on an individual node
        onNodeClick = { (node,event) => console.log("Update node selection")}
        // Disable dragging of nodes
        enableNodeDrag={false}
        // Allow camera pan and zoom with mouse
        enableZoomPanInteraction={true}
        enablePointerInteraction={true}
        controls = {<></>}
      />
    </div>
  );
};

export default GraphViewer;
