import React, { useEffect, useState } from 'react';
import TreeView from '@material-ui/lab/TreeView';
import Typography from '@material-ui/core/Typography';
import DATASET from "../../../images/tree/dataset.svg";
import FOLDER from "../../../images/tree/folder.svg";
import FILE from "../../../images/tree/file.svg";
import StyledTreeItem from './TreeViewItem';

const InstancesTreeView = (props) => {
  const { searchTerm } = props;
  const onNodeToggle = (e, nodeIds) => {
    setNodes(nodeIds);
  }

  const products = [
    {
      id: '1_1',
      text: 'C1-101 Dataset',
      parent: true,
      items: [{
        id: '1_1_1',
        text: 'NIFTI',
        items: []
      },
      {
        id: '1_1_2',
        text: 'Volume',
        items: [{
          id: '1_1_2_1',
          text: 'NIFTI',
          price: 1200
        }, {
          id: '1_1_2_2',
          text: 'Matlab',
          price: 1450
        }]
      },
      {
        id: '1_1_3',
        text: 'Matlab',
        items: []
      }]
    },
    {
      id: '1_2',
      text: 'C1-102 Dataset',
      parent: true,
      items: [{
        id: '1_2_1',
        text: 'Volume',
        items: [{
          id: '1_2_1_1',
          text: 'NIFTI',
          price: 240
        }, {
          id: '1_2_1_2',
          text: 'Matlab',
          price: 300
        }]
      }, {
        id: '1_2_2',
        text: 'Matlab',
        items: []
      }, {
        id: '1_2_3',
        text: 'NIFTI',
        items: []
      }]
    },
    {
      id: '1_3',
      text: 'C1-103 Dataset',
      parent: true,
      items: [{
        id: '1_3_1',
        text: 'Matlab',
        items: []
      },
      {
        id: '1_3_3',
        text: 'NIFTI',
        items: []
      },
      {
        id: '1_3_2',
        text: 'Volume',
        items: [{
          id: '1_3_2_1',
          text: 'NIFTI',
          price: 240
        }, {
          id: '1_3_2_2',
          text: 'Matlab',
          price: 300
        }]
      },
      {
        id: '1_3_4',
        text: 'Motility',
        price: 175,
        items: [{
          id: '1_3_4_1',
          text: 'NIFTI',
          price: 240
        }, {
          id: '1_3_4_2',
          text: 'Matlab',
          price: 300
        }]
      }]
    },
    {
      id: '1_4',
      text: 'C1-104 Dataset',
      parent: true,
      items: [{
        id: '1_4_1',
        text: 'Volume',
        items: [{
          id: '1_4_1_1',
          text: 'Matlab',
          price: 210
        }, {
          id: '1_4_1_2',
          text: 'NIFTI',
          price: 250
        }]
      }, {
        id: '1_4_2',
        text: 'Matlab',
        items: []
      }, {
        id: '1_4_3',
        text: 'NIFTI',
        items: []
      }]
    }
  ];

  const [ items, setItems ] = useState(products);
  const [ nodes, setNodes ] = useState(['1_1']);

  function nestedLoop(obj) {
    const res = [];
    function recurse(obj, current) {
      for (const key in obj) {
        let value = obj[key];
        if(value !== undefined) {
          if (value && typeof value === 'object') {
            recurse(value, key);
          } else if(key === 'id'){
            res.push(value)
          }
        }
      }
    }
    recurse(obj);
    return res;
  }

  const searchTree = (element, matchingTitle) => {
    const lowercaseSearch  = matchingTitle.toLowerCase();
    var res = element.filter(function matchSearch(o) {
      if ((o.text).toLowerCase().includes(matchingTitle)) {
        return true
      }
      if (o.items) {
        return (o.items = o.items.filter(matchSearch)).length
      }
      return false;
    })
    setNodes(nestedLoop(res))
    return res;
  }

  useEffect(() => {
    setItems(searchTerm.length >=3 ? searchTree(products, searchTerm) : products)
  }, [searchTerm]);

  const getTreeItemsFromData = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let items = undefined;
      if (treeItemData.items && treeItemData.items.length > 0) {
        items = getTreeItemsFromData(treeItemData.items);
      }
      const itemLength = items?.length;
      const labelIcon = treeItemData?.parent ? DATASET : itemLength > 0 ? FOLDER : FILE;
      return (
        <StyledTreeItem
          nodeId={treeItemData?.id}
          labelText={treeItemData?.text}
          labelIcon={labelIcon}
          labelInfo={itemLength}
          children={items}
          key={treeItemData?.id}
        />
      );
    });
  };

  const treeRef = React.createRef();

  return (
    <>
      {products.length === 0 ? (
        <Typography className="no-instance">
          No instances to display yet.
        </Typography>
      ) : (
        <>
          <Typography component="h3">Uploaded Instances</Typography>
          <TreeView
            className="scrollbar"
            defaultExpanded={nodes}
            defaultCollapseIcon={false}
            defaultExpandIcon={false}
            defaultEndIcon={false}
            ref={treeRef}
            expanded={nodes}
            onNodeToggle={onNodeToggle}
          >
            {getTreeItemsFromData(items)}
          </TreeView>
        </>
      )}
    </>
  );
}

export default InstancesTreeView;
