import React, { useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import DATASET from '../../../images/tree/dataset.svg';
import FOLDER from '../../../images/tree/folder.svg';
import FILE from '../../../images/tree/file.svg';
import StyledTreeItem from './TreeViewItem';
import { useSelector, useDispatch } from 'react-redux'
import { selectInstance } from '../../../redux/actions';

const InstancesTreeView = (props) => {
  const dispatch = useDispatch();

  const { searchTerm, dataset_id } = props;
  const datasets = [window.datasets[dataset_id].tree];
  const ids = useSelector(state => state.sdsState.datasets);
  const nodeSelected = useSelector(state => state.sdsState.instance_selected.tree_node);
  const [nodes, setNodes] = useState([]);
  const [items, setItems] = useState(datasets);

  const onNodeSelect = (e, nodeId) => {
    if (nodes.length === 0) {
      setNodes([nodeId]);
    }
  };

  const onNodeToggle = (e, nodeIds) => {
    if (nodeIds.length === 0) {
      return;
    }
    // The 2 ifs down are meant to fix the inconsistency with the tree view component
    // When we navigate from the root deep into the tree we get the full path, when we navigate
    // backwards we get only the nodes we should navigate back but the way the tree view is designed
    // does not allow us to understand in which dataset we are unless we use this logic below.
    const dataset_uri = nodeIds[0].split(":");
    const dataset_switch = dataset_uri[dataset_uri.length - 1];
    if (nodeIds.length > 1 && ids.includes(dataset_switch)) {
      nodeIds = [nodeIds[0]];
    }

    if ((nodes.length !== nodeIds.length) && (nodes[0] === nodeIds[0])) {
      var original = [...nodes];
      var newPath = [...nodeIds];
      while (original[0] === newPath[0]) {
        original.shift();
        newPath.shift();
      }
      nodeIds = original;
    }

    const split_uri = nodeIds[nodeIds.length - 1].split(":");
    const dataset_id = split_uri[split_uri.length - 1];
    const tree_map = window.datasets[dataset_id].splinter.tree_map;
    const node = tree_map.get(nodeIds[0]);
    dispatch(selectInstance({
      graph_node: node.graph_reference !== undefined ? node.graph_reference : null,
      tree_node: node
    }));
  };

  // Updated from redux, if the path got changed then we re-render from here.
  if (nodeSelected && nodeSelected.path !== null && nodeSelected.path[0] !== nodes[0]) {
    setNodes(nodeSelected.path);
  }

  const nestedLoop = (obj) => {
    const res = [];
    const recurse = (obj, current) => {
      for (const key in obj) {
        let value = obj[key];
        if (value !== undefined) {
          if (value && typeof value === 'object') {
            recurse(value, key);
          } else if (key === 'id') {
            res.push(value);
          }
        }
      }
    }
    recurse(obj);
    return res;
  }

  const searchTree = (element, matchingTitle) => {
    const lowercaseSearch = matchingTitle.toLowerCase();
    var res = element.filter(function matchSearch(o) {
      if (o.text.toLowerCase().includes(lowercaseSearch)) {
        return true;
      }
      if (o.items) {
        return (o.items = o.items.filter(matchSearch)).length;
      }
      return false;
    });
    setNodes(nestedLoop(res));
    return res;
  };

  useEffect(() => {
    setItems(
      searchTerm.length >= 3 ? searchTree(searchTerm) : datasets
    );
  }, [searchTerm]);

  // Initialize state in this hook
  useEffect(() => {
    // Populate tree items state with datasets
    if ( items.length === 0 && datasets.length > 0 ) {
      setItems(datasets);
    } else if ( datasets.length > 0 && items.length !== datasets.length  ) {
      // Update datasets, after adding a new dataset
      setItems(datasets);
    }
  });

  const getTreeItemsFromData = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let items = undefined;
      if (treeItemData.items && treeItemData.items.length > 0) {
        items = getTreeItemsFromData(treeItemData.items);
      }
      const itemLength = items?.length;
      const labelProps = treeItemData?.parent ?
        { labelIcon: DATASET, iconClass: 'dataset' }
        : itemLength > 0 ? { labelIcon: FOLDER, iconClass: 'folder' }
        : { labelIcon: FILE, iconClass: 'file' };

      return (
        <StyledTreeItem
          dataset={treeItemData?.dataset_id}
          nodeId={treeItemData?.id}
          labelText={treeItemData?.text}
          labelIcon={labelProps?.labelIcon}
          labelInfo={itemLength}
          children={items}
          key={treeItemData?.id}
          iconClass={labelProps?.iconClass}
        />
      );
    });
  };

  const treeRef = React.createRef();

  return (
    <>
      <TreeView
        className='scrollbar'
        defaultExpanded={nodes}
        defaultCollapseIcon={false}
        defaultExpandIcon={false}
        defaultEndIcon={false}
        ref={treeRef}
        expanded={nodes}
        onNodeToggle={onNodeToggle}
        onNodeSelect={onNodeSelect}
      >
        { getTreeItemsFromData(items) }
      </TreeView>
    </>
  );
};

export default InstancesTreeView;
