import React, {useCallback} from 'react';
import { rdfTypes } from './graphModel';
import { current } from '@reduxjs/toolkit';

export const NODE_FONT = '500 5px Inter, sans-serif';
export const ONE_SECOND = 1000;
export const ZOOM_DEFAULT = 1;
export const ZOOM_SENSITIVITY = 0.2;
export const GRAPH_COLORS = {
  link: '#CFD4DA',
  linkHover : 'purple',
  hoverRect: '#CFD4DA',
  textHoverRect: '#3779E1',
  textHover: 'white',
  textColor: '#2E3A59',
  collapsedFolder : 'red',
  nodeSeen: '#E1E3E8',
  textBGSeen: '#6E4795'
};
export const TOP_DOWN = {
  label : "Tree View",
  layout : "td",
  maxNodesLevel : (graph) => { 
    return graph.hierarchyVariant;
  }
};
export const LEFT_RIGHT = {
  label : "Vertical Layout",
  layout : "lr",
  maxNodesLevel : (graph) => { 
    return graph.hierarchyVariant;
  }
};
export const RADIAL_OUT = {
  label : "Radial View",
  layout : "null",
  maxNodesLevel : (graph) => { 
    return graph.radialVariant
  }
};

export const nodeSpace = 60;

/**
 * Create background for Nodes on Graph Viewer.
 * @param {*} ctx - Canvas context rendering
 * @param {*} x - x position of node, used to draw background
 * @param {*} y - y position of node, used to draw background
 * @param {*} width - needed width of background 
 * @param {*} height - needed height of background
 * @param {*} radius - Radius of background 
 * @param {*} color - color used for the background
 * @param {*} alpha - alpha color
 */
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

export const paintNode = (node, ctx, hoverNode, selectedNode, nodeSelected, previouslySelectedNodes) =>  {
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
      } else if (previouslySelectedNodes.has(node.id)) {
        // Apply different style previously selected nodes
        roundRect(
            ctx,
            ...hoverRectPosition,
            ...hoverRectDimensions,
            hoverRectBorderRadius,
            GRAPH_COLORS.nodeSeen,
            0.3
        );
        roundRect(
            ctx,
            ...textHoverPosition,
            hoverRectDimensions[0],
            hoverRectDimensions[1] / 4,
            hoverRectBorderRadius,
            GRAPH_COLORS.textBGSeen
        );
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
    }

export const collapseSubLevels = (node, collapsed, children) => {
    node?.childLinks?.forEach( n => {
    if ( collapsed !== undefined ) n.target.collapsed = collapsed;
        collapseSubLevels(n.target, collapsed, children);
        children.links = children.links + 1;
    });
}

export const determineNodePosition = (positionsMap, levels, n, targetCoord) => {
  let nearestParentNeighbor = null;
  let nearestParentNeighborIndex = 0;
  let leftParentMatch = false;
  let firstParentCollection = null;
  let firstParentCollectionIndex = 0;
  sortArray(levels[n.level - 1])
  levels[n.level-1]?.forEach( ( node, index ) => {
    if ( !leftParentMatch && (node.type == "Collection" || node.type == "Sample") && node.id !== n.parent.id && !node.collapsed ) {
      firstParentCollection = node;
      firstParentCollectionIndex = index;
    }

    if ( !leftParentMatch && node.id === n.parent?.id) {
      leftParentMatch = true;
      nearestParentNeighbor = node;
      nearestParentNeighborIndex = index;
    }
  })

  let nodesInBetween  =  Math.floor((( firstParentCollection?.neighbors?.length - 1) + ( nearestParentNeighbor?.neighbors?.length - 1)) /2 ) - 1;
  if ( firstParentCollection === nearestParentNeighbor ) {
    nodesInBetween = Math.floor((( nearestParentNeighbor?.neighbors?.length - 1)) /2 );
  } else if ( firstParentCollection == null ) {
    nodesInBetween = Math.floor((( nearestParentNeighbor?.neighbors?.length - 1)) /2 );
  }
  
  let spacesNeeded  =  nearestParentNeighborIndex - firstParentCollectionIndex;

  let nearestNeighbor = null;
  let nearestNeighborIndex = 0;
  let leftMatch = false;
  let leftMatchIndex = 0;
  let firstCollection = null;
  levels[n.level]?.forEach( ( node, index ) => {
    if ( leftMatch && nearestNeighbor == null && ( node.type == "Collection" || node.type == "Sample" )&& !node.collapsed) {
      nearestNeighbor = node;
      nearestNeighborIndex = index;
    }

    if ( !leftMatch ) {
      firstCollection = n;
    }

    if ( !leftMatch && node.id === n.id ) {
      leftMatch = true;
      leftMatchIndex = index - 1;
    }
  })

  let position = positionsMap[n.level];
  if ( !isNaN(nodesInBetween) && spacesNeeded - 1 > nodesInBetween) {
    let neighbors = n?.parent?.neighbors;
    let matchNeighbor = neighbors.findIndex( (node) => node.id === n.id ) ;;
    if ( matchNeighbor === 1 && n.level === Object.keys(levels)?.length ) {
      position = position + (Math.abs( spacesNeeded - nodesInBetween) * nodeSpace)
    } else {
      position = position + nodeSpace
    }
  } else if ( nearestNeighborIndex > 0 ) {
    if ( nearestNeighbor !=  null && !n.collapsed ){
      let middleNode = nearestNeighbor.neighbors?.[Math.floor(nearestNeighbor.neighbors?.length / 2)]?.[targetCoord];
      if ( middleNode ) {
        position = middleNode
      } 
      position = position - ( (nearestNeighborIndex - leftMatchIndex - 1) * nodeSpace)
    } else if ( n.collapsed ) { 
      position = nearestNeighborIndex?.[targetCoord] ? nearestNeighborIndex?.[targetCoord] - ( -1 * nodeSpace) : position - ( -1 * nodeSpace)
    } else if ( nearestNeighborIndex - leftMatchIndex > 0 ) { 
      position = position - ( nodeSpace)
    } else {
      position = (position + nodeSpace)
    }
  }  else if ( n.collapsed) {
    position = nearestNeighborIndex?.[targetCoord] ? nearestNeighborIndex?.[targetCoord] - ( -1 * nodeSpace): position - ( -1 * nodeSpace)
  } else {
    position = position + nodeSpace
  }
  positionsMap[n.level] = position;
  return position
}

const sortArray = (arrayToSort) => {
  arrayToSort?.sort( (a, b) => { 
    if ( a?.attributes?.relativePath && b?.attributes?.relativePath) {
      let aParent = a;
      let aPath= "";
      while ( aParent?.type != "Subject" ){
        aParent = aParent?.parent;
        if ( aParent?.attributes?.relativePath ){
          aPath = aPath + "/" + aParent?.attributes?.relativePath
        }
      }
      let bParent = b;
      let bPath = ""
      while ( bParent?.type != "Subject"){
        bParent = bParent?.parent;
        if ( bParent?.attributes?.relativePath ){
          bPath = bPath + "/" +bParent?.attributes?.relativePath
        }
      }
      aPath = (aParent?.id ) + "/" +  aPath
      bPath = (bParent?.id ) + "/" +  bPath
      return aPath.localeCompare(bPath);
    } else {
      return a?.id.localeCompare(b.id);
    }
  });
}

/**
 * Algorithm used to position nodes in a Tree. Position depends on the layout, 
 * either Tree or Vertical Layout views.
 * @param {*} levels - How many levels we need for this tree. This depends on the dataset subjects/samples/folders/files.
 * @param {*} layout 
 * @param {*} furthestLeft 
 */
export const algorithm = (levels, layout, furthestLeft) => {
    let positionsMap = {};
    let levelsMapKeys = Object.keys(levels);

    levelsMapKeys.forEach( level => {
      furthestLeft =  0 - (Math.ceil(levels[level].length)/2  * nodeSpace ); 
      positionsMap[level] = furthestLeft + nodeSpace;
      sortArray(levels[level]);    
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
                      if ( layout === TOP_DOWN.layout ) {
                        if ( neighbor.xPos > max ) { max = neighbor.xPos };
                        if ( neighbor.xPos <= min ) { min = neighbor.xPos };
                      } else if ( layout === LEFT_RIGHT.layout ) {
                        if ( neighbor.yPos > max ) { max = neighbor.yPos };
                        if ( neighbor.yPos <= min ) { min = neighbor.yPos };
                      }
                  });
                  if ( layout === TOP_DOWN.layout ) {
                    n.xPos = min === max ? min : min + ((max - min) * .5);
                  } else if ( layout === LEFT_RIGHT.layout ) {
                    n.yPos = min === max ? min : min + ((max - min) * .5);
                  }
                  if ( notcollapsedInLevel?.length > 0 && collapsedInLevel.length > 0) {
                    if ( n.type ===  "Subject" || n.parent?.type === "Subject" || n.parent?.parent?.type === "Subject" ) {
                      updateConflictedNodes(levels[level], n, positionsMap, level, index, layout);
                    }
                  }
                  
                  if ( layout === TOP_DOWN.layout ) {
                    n.fx = n.xPos;
                    n.fy = 50 * n.level;
                    positionsMap[n.level] = n.xPos + nodeSpace;
                  } else if ( layout === LEFT_RIGHT.layout ) {
                    n.fy = n.yPos;
                    n.fx = 50 * n.level;
                    positionsMap[n.level] = n.yPos + nodeSpace;
                  }
              } else {
                if ( layout === TOP_DOWN.layout ) {
                  let position = determineNodePosition(positionsMap, levels, n, "xPos");
                  n.xPos = position;
                  n.fx = n.xPos;
                  n.fy = 50 * n.level;
                } else if ( layout === LEFT_RIGHT.layout ) {
                  let position = determineNodePosition(positionsMap, levels, n, "yPos");
                  n.yPos = position;
                  n.fy = n.yPos;
                  n.fx = 50 * n.level;
                }
              }
          }else {
            if ( layout === TOP_DOWN.layout ) {
              let position = determineNodePosition(positionsMap, levels, n, "xPos");
              n.xPos = position;
              n.fx = n.xPos;
              n.fy = 50 * n.level;
            } else if ( layout === LEFT_RIGHT.layout ) {
              let position = determineNodePosition(positionsMap, levels, n, "yPos");
              n.yPos = position;
              n.fy = n.yPos;
              n.fx = 50 * n.level;
            }
          }              
        })
    });
  }

  /**
   * Create Graph ID 
   * @param {*} graph_id - ID of dataset we need the tree for
   * @param {*} layout - The desired layout in which we will display the data e.g. Tree, Vertical, Radial
   * @returns 
   */
export const getPrunedTree = (graph_id, layout) => {
    let nodesById = Object.fromEntries(window.datasets[graph_id].graph?.nodes?.map(node => [node.id, node]));
    window.datasets[graph_id].graph?.links?.forEach(link => {
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

    let levelsMap = window.datasets[graph_id].graph.levelsMap;
    // // Calculate level with max amount of nodes
    
    (function traverseTree(node = nodesById[window.datasets[graph_id].graph?.nodes?.[0].id]) {
      visibleNodes.push(node);
      if (node.collapsed) return;
      // let childLinks = node.childLinks?.filter( link => !link.source.collapsed && !link.target.collapsed );
      visibleLinks.push(...node.childLinks);
      let nodes = node.childLinks.map(link => (typeof link.target) === 'object' ? link.target : nodesById[link.target]);
      nodes?.forEach(traverseTree);
    })(); // IIFE

    let levels = {};
    visibleNodes.forEach( n => {
      if ( levels[n.level] ){
        levels[n.level].push(n);
      } else {
        levels[n.level] = [n];
      }
    })
      
    // Calculate level with max amount of nodes
    let maxLevel = Object.keys(levels).reduce((a, b) => levels[a].length > levels[b].length ? a : b);
    let maxLevelNodes = levels[maxLevel];

    // The furthestLeft a node can be
    let furthestLeft = 0 - (Math.ceil(maxLevelNodes.length)/2  * nodeSpace );

    algorithm(levels, layout, furthestLeft);

    const graph = { nodes : visibleNodes, links : visibleLinks, levelsMap : levelsMap, hierarchyVariant : maxLevel * 20 };
    return graph;
  };

  /**
   * Update Nodes x and y position, used for vertical and tree view layouts.
   * @param {*} nodes - The nodes we have for the dataset 
   * @param {*} conflictNode - Conflicting Node that needs re positioning
   * @param {*} positionsMap  - Object keeping track of positions of nodes
   * @param {*} level - level of tree
   * @param {*} index - Index of conflict node in this tree level
   * @param {*} layout  - The layout we are using to display these nodes
   */
  const updateConflictedNodes = (nodes, conflictNode, positionsMap, level, index, layout) => {
    let matchIndex = index;
    for ( let i = 0; i <= index ; i++ ) {
      let conflict = nodes.find ( n => !n.collapsed && n?.parent?.id === nodes[i]?.parent?.id)
      if ( conflict === undefined ){
        conflict = nodes.find ( n => !n.collapsed )
        if ( conflict === undefined ){
          conflict = conflictNode;
        }
      }
      matchIndex = nodes.findIndex( n => n.id === conflict.id );
      if ( layout === TOP_DOWN.layout ) {
        let furthestLeft = conflict?.xPos;
        if ( nodes?.[i]?.collapsed ) {
          furthestLeft =  conflict.xPos - ((((matchIndex - i )/2)) * nodeSpace ); 
          nodes[i].xPos =furthestLeft;
          positionsMap[level] = furthestLeft + nodeSpace;
        }
        nodes[i].fx = nodes[i].xPos;
        nodes[i].fy = 50 * nodes[i].level;
      } else if ( layout === LEFT_RIGHT.layout ) {
        let furthestLeft = conflict?.yPos;
        if ( nodes[i].collapsed ) {
          furthestLeft =  conflict.yPos - ((((matchIndex - i )/2))  * nodeSpace ); 
          nodes[i].yPos =furthestLeft;
        }
        positionsMap[level] = furthestLeft + nodeSpace;
        nodes[i].fy = nodes[i].yPos;
        positionsMap[level] = nodes[i].fy + nodeSpace;
        nodes[i].fx = 50 * nodes[i].level;
      }
    }
  }