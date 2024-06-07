import React from "react";
import { useDispatch } from 'react-redux';
import { toggleMetadataItemVisibility } from '../../../redux/actions';

import {
  Typography,
  ListItemText,
  ListItem,
  ListItemSecondaryAction,
  IconButton,
  Tooltip
} from "@material-ui/core";
import ReorderIcon from "@material-ui/icons/Reorder";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import VisibilityOffRoundedIcon from "@material-ui/icons/VisibilityOffRounded";
const SettingsItem = props => {
  const { groupTitle, item } = props;
    const dispatch = useDispatch();
    const toggleItemDisabled = () => dispatch(toggleMetadataItemVisibility(groupTitle, item.key))

  return (
    <ListItem
      disableGutters
      style={{
        display: "flex",
        padding: "1rem",
        boxShadow: "0px 1px 0px 0px #E5E5E5"
      }}
    >
      {item.visible ? (
        <ReorderIcon
          style={{
            color: "rgba(46, 58, 89, 0.40)",
            marginRight: "16px",
            fontSize: "1rem"
          }}
        />
      ) : (
        <VisibilityOffRoundedIcon
          style={{
            color: "rgba(46, 58, 89, 0.40)",
            marginRight: "16px",
            fontSize: "1rem"
          }}
        />
      )}
      <ListItemText
        primary={
          <Typography
            variant="body2"
            style={{
              color: "rgba(46, 58, 89, 0.80)",
              fontWeight: "600",
              fontSize: ".75rem"
            }}
          >
            {item.label}
          </Typography>
        }
      />

      <ListItemSecondaryAction style={{ right: "2rem" }}>
        <IconButton
          edge="end"
          aria-label={!item.visible ? "add" : "delete"}
          onClick={toggleItemDisabled}
          disableRipple
        >
          
        {!item.visible ? (
          <Tooltip id={item.label} title={"Show Property"}>
          <AddCircleOutlineIcon
            style={{ color: "#3779E1", fontSize: "1rem" }}
          /></Tooltip>
        ) : (
          <Tooltip id={item.label} title={"Hide Property"}>
          <RemoveCircleOutlineIcon
            style={{ color: "#ED745D", fontSize: "1rem" }}
          /></Tooltip>
        )}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SettingsItem;
