import React from "react";
import PropTypes from "prop-types";
import { TreeItem } from "@material-ui/lab";
import {Typography, Box, IconButton} from "@material-ui/core";
import DOWN from "../../../images/tree/down.svg";
import {OpenInNewRounded} from "@material-ui/icons";

const StyledTreeItem = (props) => {
  const {
    dataset,
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    iconClass,
    onNodeSelect,
    ...other
  } = props;

  return (
    <TreeItem
      data={dataset}
      id={other.nodeId}
      label={
        <div className={`labelRoot ${iconClass}`}>
          <Box className="labelIcon"></Box>
          <Typography
            onClick={event => {
              onNodeSelect(event, props.nodeId);
              event.preventDefault();
            }}
            variant="body2" 
            className="labelText">
            {labelText}
            {props.iconClass === 'file' && window.datasets[dataset].splinter.tree_map.get(props.nodeId)?.graph_reference?.attributes?.publishedURI != undefined ? 
              <IconButton onClick={event => {
                onNodeSelect(event, props.nodeId, true);
                event.preventDefault();
            }}><OpenInNewRounded /></IconButton> : null}
          </Typography>
          {labelInfo > 0 ? (
            <Typography
              variant="caption"
              className="labelCaption"
              color="inherit"
            >
              {labelInfo}
              <img src={DOWN} alt="down" />
            </Typography>
          ) : null}
        </div>
      }
      {...other}
    />
  );
};

StyledTreeItem.propTypes = {
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.number,
  labelText: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
};

export default StyledTreeItem;
