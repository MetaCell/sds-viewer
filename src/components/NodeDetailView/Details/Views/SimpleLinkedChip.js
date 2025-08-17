import React, { useState } from "react";
import {
  Box,
  Chip,
  Menu,
  MenuItem
} from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { selectGroup } from '../../../../redux/actions';
import { GRAPH_SOURCE } from '../../../../constants';


const SimpleChip = ({ chips, node }) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const isUrl = (value) => {
    if (!value) return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleClick = (item, node) => {
    if (item.link) {
      window.open(item.link, '_blank');
    } else if (item.value) {
      if (isUrl(item.value)) {
        window.open(item.value, '_blank');
      } else if (node) {
        dispatch(
          selectGroup({
            dataset_id: node.dataset_id,
            graph_node: node?.id,
            tree_node: node?.tree_reference?.id,
            source: GRAPH_SOURCE,
          })
        );
      }
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleCopyId = () => {
    const copyValue = selectedItem?.id || selectedItem?.link || selectedItem?.value;
    if (copyValue) {
      navigator.clipboard.writeText(copyValue);
    }
    handleMenuClose();
  };

  const handleOpenNewTab = () => {
    const url = selectedItem?.link || selectedItem?.id || selectedItem?.value;
    if (url) {
      window.open(url, '_blank');
    }
    handleMenuClose();
  };

  return (
    <Box className="chip-overflow noscrollbar">
      {chips?.map((item, index) =>
        node === undefined ? (
          item.link ? (
            <Chip
              label={item?.value}
              onClick={() => handleClick(item, null)}
              onContextMenu={(e) => handleContextMenu(e, item)}
            />
          ) : (
            <Chip
              label={item?.value}
              onContextMenu={(e) => handleContextMenu(e, item)}
            />
          )
        ) : (
          <Chip
            label={item?.value}
            onClick={() => handleClick(item, node)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          />
        )
      )}
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleCopyId}>Copy ID</MenuItem>
        {(selectedItem?.link || isUrl(selectedItem?.id) || isUrl(selectedItem?.value)) && (
          <MenuItem onClick={handleOpenNewTab}>Open in new tab</MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default SimpleChip;
