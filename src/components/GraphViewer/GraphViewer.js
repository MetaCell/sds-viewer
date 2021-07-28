import React from 'react';
import { IconButton } from '@material-ui/core';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import RefreshIcon from '@material-ui/icons/Refresh';
import LayersIcon from '@material-ui/icons/Layers';
import GeppettoGraphVisualization from '@metacell/geppetto-meta-ui/graph-visualization/Graph';

const NODE_FONT = "8px sans-serif";
const ONE_SECOND = 1000;
const ZOOM_DEFAULT = 1;
const ZOOM_SENSITIVITY = .2;

const GraphViewer = (props) => {
  const graphRef = React.useRef(null);
  const [graphId, setGraphId] = React.useState(props.graph_id);

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

  return (
    <div className={"graph-view"}>
      <GeppettoGraphVisualization
        ref={graphRef}
        // Graph data with Nodes and Links to populate
        data={window.datasets[graphId].graph}
        // Create the Graph as 2 Dimensional
        d2={true}
        // td = Top Down, creates Graph with root at top
        dagMode="td"
        dagLevelDistance={10}
        nodeRelSize={20}
        nodeSize={30}
        // Links properties
        linkColor="black"
        linkCurvature={ .3 }
        onNodeClick = { (node,event) => handleNodeClick(node,event) }
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={(node, ctx, globalScale) => {
          const size = 12;
          ctx.drawImage(node.img, node.x - size, node.y - size , size *2, size * 2);

          ctx.font = NODE_FONT;
          ctx.textAlign = "center";
          ctx.textBaseline = 'middle';
          // Create Title in Node
          const _name = node.name.split(':')
          ctx.fillText(_name[_name.length - 1],node.x, node.y - size);
        }}
        // Handles error on graph
        onDagError={loopNodeIds => {}}
        // Disable dragging of nodes
        enableNodeDrag={false}
        // Allow camera pan and zoom with mouse
        enableZoomPanInteraction={true}
        enablePointerInteraction={true}
        // linkCanvasObjectMode={"replace"}
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
