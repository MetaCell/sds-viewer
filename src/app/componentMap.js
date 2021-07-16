import GraphViewer from '../components/GraphViewer/GraphViewer'
import EmptyContainer from '../components/EmptyContainer';
/**
 * Key of the component is the `component` attribute of the widgetConfiguration.
 * 
 * This map is used inside the LayoutManager to know which component to display for a given widget.
 */
const componentMap = {
    'emptyComponent': EmptyContainer,
    'graphComponent': GraphViewer
};

export default componentMap