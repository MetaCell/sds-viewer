import React, { useState } from "react";
import { Box, Chip, Menu, MenuItem } from "@material-ui/core";

const SimpleChip = ({ chips }) => {
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

  const normalize = (item) =>
    typeof item === "string" ? { value: item } : item;

  const handleClick = (item) => {
    const url = item?.link || (isUrl(item?.value) ? item?.value : null);
    if (url) {
      window.open(url, "_blank");
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
    if (isUrl(url)) {
      window.open(url, "_blank");
    }
    handleMenuClose();
  };

  return (
    <Box className="chip-overflow noscrollbar">
      {chips?.map((rawItem, index) => {
        const item = normalize(rawItem);
        return (
          <Chip
            key={`${item?.value}_${index}`}
            label={item?.value}
            onClick={() => handleClick(item)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          />
        );
      })}
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
