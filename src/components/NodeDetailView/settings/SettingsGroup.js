import React, {  useState } from "react";
import { Box } from "@material-ui/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SettingsListItems from "./SettingsListItems";
import { useDispatch } from "react-redux";
import { updateMetaDataItemsOrder } from "../../../redux/actions";
const SettingsGroup = ({ title, group }) => {
  const [items, setItems] = useState(group);
  const dispatch = useDispatch();

  const handleDragEnd = result => {
    if (!result.destination) return;

    const itemsCopy = [...items];
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    setItems(itemsCopy);
    dispatch(updateMetaDataItemsOrder({ groupTitle: title, newItemsOrder: itemsCopy }));
  };

  return (
      <Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
                <SettingsListItems
                    title={title}
                    provided={provided}
                    items={items}
                />
            )}
          </Droppable>
        </DragDropContext>
      </Box>
  );
};

export default SettingsGroup;
