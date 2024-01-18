import { Box, Button, Typography } from "@material-ui/core";
import SettingsGroup from "./SettingsGroup";
import FolderIcon from "@material-ui/icons/Folder";
import { useSelector, useDispatch } from 'react-redux'
import { toggleSettingsPanelVisibility } from '../../../redux/actions';
import React, {useEffect, useState} from "react";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import SettingsListItems from "./SettingsListItems";


const Settings = props => {
  const dispatch = useDispatch();
  const showSettingsContent = useSelector(state => state.sdsState.settings_panel_visible);
  const metaDataPropertiesModel = useSelector(state => state.sdsState.metadata_model);
  const [data, setData] = useState([])
  const save = () => {
    dispatch(toggleSettingsPanelVisibility(!showSettingsContent));
  };

  useEffect(() => {
      setData(metaDataPropertiesModel)
  }, [metaDataPropertiesModel])
  return (
    <Box style={{ position: "relative", maxHeight: "84vh", overflow: "auto" }}>
      {/*<Box*/}
      {/*  style={{*/}
      {/*    display: "flex",*/}
      {/*    justifyContent: "center",*/}
      {/*    alignItems: "center",*/}
      {/*    flexDirection: "column",*/}
      {/*    padding: "0rem 1.5rem 2.25rem 1.5rem",*/}
      {/*    boxShadow: "0px 2px 0px 0px #E5E5E5",*/}
      {/*    gap: ".75rem"*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <FolderIcon style={{ color: "#3779E1" }} />*/}
      {/*  <Typography variant="h3" style={{ color: "#3779E1" }}>*/}
      {/*    First List Title*/}
      {/*  </Typography>*/}
      {/*</Box>*/}
        {
            Object.keys(data).map(group => <SettingsGroup title={group} group={data[group]} />)
        }
      <Box
        style={{
          background:
            "linear-gradient(rgb(255 255 255 / 81%) 0%, rgb(255, 255, 255) 100%)",
          padding: ".75rem",
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Button variant="contained" disableElevation color="primary" onClick={save} fullWidth>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
