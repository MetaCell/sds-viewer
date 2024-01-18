import React, {useEffect, useState} from "react";
import { Box } from "@material-ui/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SettingsListItems from "./SettingsListItems";
const SettingsGroup = ({title, group}) => {
  const [items, setItems] = useState([]);
  const handleDragEnd = result => {
    if (!result.destination) return;

    const itemsCopy = [...items];
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    setItems(itemsCopy);
  };

  return (
    <Box>
      <DragDropContext>
        <Droppable droppableId="droppable">
          {provided => (
            <SettingsListItems
              title={title}
              provided={provided}
              items={group}
            />
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default SettingsGroup;
