import React from "react";
import { Box, Chip } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { selectGroup } from '../../../../redux/actions';
import { GRAPH_SOURCE } from '../../../../constants';

const SimpleChip = ({ chips, node }) => {
  const dispatch = useDispatch();

  const handleClick = (item, groupNode) => {
    if (item.link) {
      window.open(item.link, '_blank');
      return;
    }
    const value = item.value;
    const urlCheck = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
    if (urlCheck.test(value)) {
      window.open(value, '_blank');
    } else if (groupNode) {
      dispatch(selectGroup({
        dataset_id: groupNode.dataset_id,
        graph_node: groupNode?.id,
        tree_node: groupNode?.tree_reference?.id,
        source: GRAPH_SOURCE
      }));
    }
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    const url = item.link || item.value;
    navigator.clipboard.writeText(url);
  };

  return (
    <Box className="chip-overflow noscrollbar">
      {chips?.map((chip, index) => {
        const item = typeof chip === 'object' ? chip : { value: chip };
        const key = `${item.value}_${index}`;
        return (
          <Chip
            key={key}
            label={item.value}
            onClick={() => handleClick(item, node)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          />
        );
      })}
    </Box>
  );
};

export default SimpleChip;
