import React from "react";
import {
  Box,
  Typography,
  List,
  ListSubheader,
} from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import SettingsItem from "./SettingsItem";
const SettingsListItems = props => {
  const { provided, items, title } = props;
  return (
    <List
      {...provided.droppableProps}
      ref={provided.innerRef}
      subheader={
        <ListSubheader disableGutters disableSticky>
          <Box
            style={{
              padding: "1.5rem 0rem 1.5rem 1.5rem",
              boxShadow: "0px 1px 0px 0px #E5E5E5"
            }}
          >
            <Typography variant="h6" style={{ color: "#2E3A59" }}>
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </Typography>
          </Box>
        </ListSubheader>
      }
    >
      {items.map((item, index) => (
        <Draggable
          key={item.key}
          draggableId={`${index}`}
          index={index}
          isDragDisabled={!item.visible}
        >
          {provided => (
            <Box
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <SettingsItem
                item={item}
                groupTitle={title}
              />
            </Box>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </List>
  );
};

export default SettingsListItems;
