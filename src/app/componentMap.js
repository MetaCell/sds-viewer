import Graph from '@metacell/geppetto-meta-ui/graph-visualization/Graph';

/**
 * Key of the component is the `component` attribute of the widgetConfiguration.
 * 
 * This map is used inside the LayoutManager to know which component to display for a given widget.
 */
const componentMap = {
    'graph': Graph
};

export default componentMap