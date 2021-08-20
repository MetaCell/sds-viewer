import React, { useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import Typography from '@material-ui/core/Typography';
import DATASET from '../../../images/tree/dataset.svg';
import FOLDER from '../../../images/tree/folder.svg';
import FILE from '../../../images/tree/file.svg';
import StyledTreeItem from './TreeViewItem';
import { useSelector } from 'react-redux'

const InstancesTreeView = (props) => {
  const { searchTerm } = props;
  const onNodeToggle = (e, nodeIds) => {
    setNodes(nodeIds);
  };
  
  const ids = useSelector(state => state.sdsState.datasets);
  // TODO: to change this, I do not want to re-compute at every render the trees
  // probably to be moved to the redux store
  let datasets = ids.map(item => {
    let deepClone = JSON.parse(JSON.stringify(window.datasets[item].tree));
    return deepClone;
  });

  const [items, setItems] = useState(datasets);
  const [nodes, setNodes] = useState([]);

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
      searchTerm.length >= 3 ? searchTree(datasets, searchTerm) : datasets
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
      {items.length === 0 ? (
        <Typography className='no-instance'>
          No instances to display yet.
        </Typography>
      ) : (
        <>
          <Typography component='h3'>Uploaded Instances</Typography>
          <TreeView
            className='scrollbar'
            defaultExpanded={nodes}
            defaultCollapseIcon={false}
            defaultExpandIcon={false}
            defaultEndIcon={false}
            ref={treeRef}
            expanded={nodes}
            onNodeToggle={onNodeToggle}
          >
            { getTreeItemsFromData(items) }
          </TreeView>
        </>
      )}
    </>
  );
};

export default InstancesTreeView;
