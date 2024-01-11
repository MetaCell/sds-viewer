import React from "react";
import {
  Typography,
  ListItemText,
  ListItem,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import ReorderIcon from "@material-ui/icons/Reorder";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import VisibilityOffRoundedIcon from "@material-ui/icons/VisibilityOffRounded";
const SettingsItem = props => {
  const { item, toggleItemDisabled } = props;

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
            {item.primary}
          </Typography>
        }
      />

      <ListItemSecondaryAction style={{ right: "2rem" }}>
        <IconButton
          edge="end"
          aria-label={item.disabled ? "add" : "delete"}
          onClick={() => toggleItemDisabled(item.id)}
        >
          {item.disabled ? (
            <AddCircleOutlineIcon
              style={{ color: "#3779E1", fontSize: "1rem" }}
            />
          ) : (
            <RemoveCircleOutlineIcon
              style={{ color: "#ED745D", fontSize: "1rem" }}
            />
          )}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SettingsItem;
