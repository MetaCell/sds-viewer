import React, { useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import DATASET from '../../../images/tree/dataset.svg';
import FOLDER from '../../../images/tree/folder.svg';
import FILE from '../../../images/tree/file.svg';
import StyledTreeItem from './TreeViewItem';
import { useSelector, useDispatch } from 'react-redux'
import { selectInstance } from '../../../redux/actions';
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import * as layoutActions from "@metacell/geppetto-meta-client/common/layout/actions";
import { GRAPH_SOURCE, TREE_SOURCE } from '../../../constants';

const InstancesTreeView = (props) => {
  const dispatch = useDispatch();

  const { searchTerm, dataset_id } = props;
  const datasets = JSON.parse(JSON.stringify([window.datasets[dataset_id].tree]));
  const nodeSelected = useSelector(state => state.sdsState.instance_selected);
  const [nodes, setNodes] = useState([]);
  const [items, setItems] = useState(datasets);
  const widgets = useSelector(state => state.widgets);

  const onNodeSelect = (e, nodeId) => {
    const node = window.datasets[dataset_id].splinter.tree_map.get(nodeId);
    dispatch(selectInstance({
      dataset_id: dataset_id,
      graph_node: node?.graph_reference?.id,
      tree_node: node.id,
      source: TREE_SOURCE
    }));
    if (widgets[dataset_id] !== undefined) {
      widgets[dataset_id].status = WidgetStatus.ACTIVE;
      dispatch(layoutActions.updateWidget(widgets[dataset_id]));
    }
    if (widgets[dataset_id] !== undefined) {
      widgets[dataset_id].status = WidgetStatus.ACTIVE;
      dispatch(layoutActions.updateWidget(widgets[dataset_id]));
    }
  };

  const onNodeToggle = (e, nodeIds) => {
    if (nodeIds.length === 0) {
      return;
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

    const node = window.datasets[dataset_id].splinter.tree_map.get(nodeIds[0]);
    if (node && node.path !== undefined && node.path[0] !== nodes[0]) {
      setNodes(node.path);
    }
  };

  let globalId = nodeSelected.dataset_id.split(':');
  if (globalId[globalId.length - 1] !== dataset_id && nodes.length > 0) {
    setNodes([]);
  } else if (globalId[globalId.length - 1] === dataset_id && nodeSelected.source === GRAPH_SOURCE && nodeSelected.tree_node && nodeSelected.tree_node.path[0] !== nodes[0]) {
    setNodes(nodeSelected.tree_node.path);
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
          } else if (key === 'path') {
            continue;
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
      searchTerm.length >= 3 ? searchTree([...datasets], searchTerm) : datasets
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
          onNodeSelect={onNodeSelect}
        />
      );
    });
  };

  const treeRef = React.createRef();

  return (
    <>
      <TreeView
        className='scrollbar treeViewer'
        defaultExpanded={nodes}
        defaultCollapseIcon={false}
        defaultExpandIcon={false}
        defaultEndIcon={false}
        ref={treeRef}
        expanded={nodes}
        onNodeToggle={onNodeToggle}
        selected={[nodeSelected?.tree_node?.id]}
      >
        { getTreeItemsFromData(items) }
      </TreeView>
    </>
  );
};

export default InstancesTreeView;
