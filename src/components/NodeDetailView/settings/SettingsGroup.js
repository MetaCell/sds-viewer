import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SettingsListItems from "./SettingsListItems";
const SettingsGroup = props => {
  const [items, setItems] = useState([
    { id: "1", primary: "Created on", disabled: false, visible: true },
    { id: "2", primary: "Remote ID", disabled: false, visible: true },
    { id: "3", primary: "Mimetype", disabled: false, visible: true },
    { id: "4", primary: "Dataset", disabled: false, visible: true },
    { id: "5", primary: "Dataset Path", disabled: false, visible: true }
  ]);

  const handleDragEnd = result => {
    if (!result.destination) return;

    const itemsCopy = [...items];
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    setItems(itemsCopy);
  };

  const toggleItemDisabled = itemId => {
    const itemIndex = items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) return;

    const updatedItems = [...items];
    const [toggledItem] = updatedItems.splice(itemIndex, 1); // Remove the item from its current position

    // If the item is currently disabled
    if (toggledItem.disabled) {
      // Move the item to the top of the list by unshifting it
      updatedItems.unshift({ ...toggledItem, disabled: false, visible: true });
    } else {
      // Toggle the disabled and visible properties
      updatedItems.push({ ...toggledItem, disabled: true, visible: false });
    }

    setItems(updatedItems);
  };

  return (
    <Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <SettingsListItems
              provided={provided}
              items={items}
              toggleItemDisabled={toggleItemDisabled}
            />
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default SettingsGroup;
