import React, {useCallback} from 'react';
import { rdfTypes } from './graphModel';
import { current } from '@reduxjs/toolkit';
import * as d3 from 'd3';

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
        collapseSubLevels(node, true, children)
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
    if ( collapsed !== undefined ) {
      n.target.collapsed = collapsed;
      collapseSubLevels(n.target, collapsed, children);
      children.links = children.links + 1;
    }
    });
}


const hierarchy = (data) =>{
    return d3.hierarchy(data);
}

const dendrogram = (data) => {
    const dendrogramGenerator = d3.cluster().nodeSize([1, 100])
    .separation(function(a,b){
      return 1 + d3.sum([a,b].map(function(d){
        return 15
      }))
    });
    return dendrogramGenerator(hierarchy(data));
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
    let maxLevel = parseInt(Object.keys(levels).reduce((a, b) => levels[a].length > levels[b].length ? a : b));

      
    let root = levelsMap["1"]?.[0];

    let data = {
      type : "node",
      name : root?.id,
      value : levelsMap["1"]?.[0]?.level - 1,
      children : []
    };

    function traverse(node, data) {
      if (node === null) {
        return;
      }
      node.neighbors?.forEach( n => {
        if ( visibleNodes?.find( node => node.id === n.id ) ) {
          if ( n.neighbors?.length > 1 ) {
            if ( n?.level > node.level ) {
              let node = {
                type : "node",
                name : n.id,
                value :  n?.level - 1,
                children : []
              }
              data.children.push(node);
              traverse(n, node)
            }
          } else {
            data.children.push({type : "leaf",
              name : n.id,
              value :  n?.level - 1})
          }        
        }
      });
    }

    traverse(root,data)  
            
    // Use D3 cluster to give position to nodes
    const allNodes = dendrogram(data).descendants();
    let mapNodes = {};
    allNodes.forEach( n => mapNodes[n.data?.name] = n );

    // Assign position of nodes
    visibleNodes.forEach( n => {
      if ( layout === TOP_DOWN.layout ) {
        if ( mapNodes[n.id] ) {
          n.xPos = mapNodes[n.id].x
          n.fx = n.xPos;
          n.fy = 50 * n.level;
        }
      }
      if ( layout === LEFT_RIGHT.layout ) {
        if ( mapNodes[n.id] ) {
          n.yPos = mapNodes[n.id].x
          n.fy = n.yPos;
          n.fx = 50 * n.level;
        }
      }
    })

    const graph = { nodes : visibleNodes, links : visibleLinks, levelsMap : levelsMap, hierarchyVariant : maxLevel * 20 };
    return graph;
  };
