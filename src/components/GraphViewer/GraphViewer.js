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
const LOADING_TIME = 1000;
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

const nodeSpace = 50;

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

  const updateNodes = (nodes, conflictNode, positionsMap, level, index) => {
    let matchIndex = index;
    for ( let i = 0; i < index ; i++ ) {
      let conflict = nodes.find ( n => !n.collapsed && n?.parent?.id === nodes[i]?.parent?.id)
      if ( conflict === undefined ){
        conflict = nodes.find ( n => !n.collapsed )
        if ( conflict === undefined ){
          conflict = conflictNode;
        }
      }
      matchIndex = nodes.findIndex( n => n.id === conflict.id );
      let furthestLeft = conflict?.xPos;
      if ( nodes[i].collapsed ) {
        furthestLeft =  conflict.xPos - ((((matchIndex - i )/2))  * nodeSpace ); 
        nodes[i].xPos =furthestLeft;
      }
      positionsMap[level] = furthestLeft + nodeSpace;
      nodes[i].fx = nodes[i].xPos;
      nodes[i].fy = 50 * nodes[i].level;
    }
  }

  const getPrunedTree = () => {
    let nodesById = Object.fromEntries(window.datasets[props.graph_id].graph?.nodes?.map(node => [node.id, node]));
    window.datasets[props.graph_id].graph?.links?.forEach(link => {
      const source = link.source.id;
      const target = link.target.id;
      const linkFound = !nodesById[source]?.childLinks?.find( l =>
        source === l.source.id && target ===  l.target.id 
      );
      if ( linkFound ) {
        nodesById[source]?.childLinks?.push(link);
      }
    });
  
    let visibleNodes = [];
    const visibleLinks = [];

    let levelsMap = window.datasets[props.graph_id].graph.levelsMap;
    // // Calculate level with max amount of nodes
    let maxLevel = Object.keys(levelsMap).reduce((a, b) => levelsMap[a].filter( l => !l.collapsed ).length > levelsMap[b].filter( l => !l.collapsed ).length ? a : b);
    
    (function traverseTree(node = nodesById[window.datasets[props.graph_id].graph?.nodes?.[0].id]) {
      visibleNodes.push(node);
      if (node.collapsed) return;
      // let childLinks = node.childLinks?.filter( link => !link.source.collapsed && !link.target.collapsed );
      visibleLinks.push(...node.childLinks);
      let nodes = node.childLinks.map(link => (typeof link.target) === 'object' ? link.target : nodesById[link.target]);
      nodes?.forEach(traverseTree);
    })(); // IIFE

    if ( selectedLayout.layout === TOP_DOWN.layout ){
      let levels = {};
      visibleNodes.forEach( n => {
        if ( levels[n.level] ){
          levels[n.level].push(n);
        } else {
          levels[n.level] = [n];
        }
      })
      
      // Calculate level with max amount of nodes
      let highestLevel = Object.keys(levels).length;
      let maxLevel = Object.keys(levels).reduce((a, b) => levels[a].length > levels[b].length ? a : b);
      let maxLevelNodes = levels[maxLevel];

      // Space between nodes
      // The furthestLeft a node can be
      let furthestLeft = 0 - (Math.ceil(maxLevelNodes.length)/2  * nodeSpace );
      let positionsMap = {};

      let levelsMapKeys = Object.keys(levels);

      levelsMapKeys.forEach( level => {
        furthestLeft =  0 - (Math.ceil(levels[level].length)/2  * nodeSpace ); 
        positionsMap[level] = furthestLeft + nodeSpace;
        levels[level]?.sort( (a, b) => { 
          if (a?.id < b?.id) {
            return -1;
          }
          if (a?.id > b?.id) {
            return 1;
          }
          return 1;
        });        
      });

      // Start assigning the graph from the bottom up
      let neighbors = 0;
      levelsMapKeys.reverse().forEach( level => {
        let collapsedInLevel = levels[level].filter( n => n.collapsed);
        let notcollapsedInLevel = levels[level].filter( n => !n.collapsed);
        levels[level].forEach ( (n, index) => {
              neighbors = n?.neighbors?.filter(neighbor => { return neighbor.level > n.level });
              if ( !n.collapsed ) {
                if ( neighbors?.length > 0  ) {
                    let max = Number.MIN_SAFE_INTEGER, min = Number.MAX_SAFE_INTEGER;
                    neighbors.forEach( neighbor => {
                        if ( neighbor.xPos > max ) { max = neighbor.xPos };
                        if ( neighbor.xPos <= min ) { min = neighbor.xPos };
                    });
                    n.xPos = min === max ? min : min + ((max - min) * .5);
                    positionsMap[n.level] = n.xPos + nodeSpace;
                    if ( notcollapsedInLevel?.length > 0 && collapsedInLevel.length > 0) {
                      updateNodes(levels[level], n, positionsMap, level, index);
                    }
                    positionsMap[n.level] = n.xPos + nodeSpace;
                    n.fx = n.xPos;
                    n.fy = 50 * n.level;
                } else {
                  n.xPos = positionsMap[n.level] + nodeSpace;
                  positionsMap[n.level] = n.xPos;
                  n.fx = n.xPos;
                  n.fy = 50 * n.level;
                  
                }
            }else {
              n.xPos = positionsMap[n.level] + nodeSpace;
              positionsMap[n.level] = n.xPos ;
              n.fx = n.xPos;
              n.fy = 50 * n.level;
            }              
          })
      });
    }

    const graph = { nodes : visibleNodes, links : visibleLinks, levelsMap : levelsMap, hierarchyVariant : maxLevel * 20 };
    console.log("Graph ", graph);
    return graph;
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
  const [data, setData] = React.useState({ nodes : [], links : []});
  const nodeSelected = useSelector(state => state.sdsState.instance_selected.graph_node);
  const groupSelected = useSelector(state => state.sdsState.group_selected.graph_node);
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

  const collapseSubLevels = (node, collapsed, children) => {
    node?.childLinks?.forEach( n => {
      if ( collapsed !== undefined ) n.target.collapsed = collapsed;
      collapseSubLevels(n.target, collapsed, children);
      children.links = children.links + 1;
    });
  }

  const handleNodeLeftClick = (node, event) => {
    if ( node.type === rdfTypes.Subject.key || node.type === rdfTypes.Collection.key ) {
      node.collapsed = !node.collapsed;
      collapseSubLevels(node, node.collapsed, { links : 0 });
      const updatedData = getPrunedTree();
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
    //setCameraPosition({ x :  node.x , y :  node.y });
  };

  const expandAll = (event) => {
    window.datasets[props.graph_id].graph?.nodes?.forEach( node => {
      collapsed ? node.collapsed = !collapsed : node.collapsed = node?.type === typesModel.NamedIndividual.subject.type;
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
  };

  const setForce = () => {
    if ( selectedLayout.layout !== TOP_DOWN.layout ){
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
    const updatedData = getPrunedTree();
    setData(updatedData);
    setLoading(true);
    setForce();
    setTimeout ( () => { 
      setLoading(false);
      setForce();
    }, LOADING_TIME);
  }, []);

  useEffect(() => {
    const updatedData = getPrunedTree();
    setData(updatedData);
  },[selectedLayout]);

  useEffect(() => {
    document.addEventListener("nodeVisible", (e) => {
      let visibleNodes = e.detail;
      let match = visibleNodes?.find( v => v?._attributes?.id === props.graph_id );
      if ( match ) {
        const updatedData = getPrunedTree();
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
        let center =  graphRef?.current?.ggv?.current.centerAt();
        setCameraPosition({ x :  center?.x , y :  center?.y });
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
          const updatedData = getPrunedTree();
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
        let children = { links : 0 };
        collapseSubLevels(node, undefined, children)
        const collapsedNodes = [children.links, node.x, textHoverPosition[1]];
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
        id = {props.graph_id}
        // Graph data with Nodes and Links to populate
        data={data}
        // Create the Graph as 2 Dimensional
        d2={true}
        cooldownTicks={selectedLayout.layout === TOP_DOWN.layout ? 0 : data?.nodes?.length}
        onEngineStop={onEngineStop}
        // Links properties
        linkColor = {handleLinkColor}
        linkWidth={2}
        dagLevelDistance={selectedLayout.layout === TOP_DOWN.layout ? 60 : 0}
        linkDirectionalParticles={1}
        forceRadial={selectedLayout.layout === TOP_DOWN.layout ? 0 : 15}
        linkDirectionalParticleWidth={link => highlightLinks.has(link) ? 4 : 0}
        linkCanvasObjectMode={'replace'}
        onLinkHover={handleLinkHover}
        // Override drawing of canvas objects, draw an image as a node
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={node => 'replace'}
        nodeVal = { node => {
          if ( selectedLayout.layout === TOP_DOWN.layout ){
            node.fx = node.xPos;
            node.fy = 50 * node.level;
          } else {
            return 100 / (node.level + 1);
          }
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
