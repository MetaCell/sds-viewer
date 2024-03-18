import React from "react";
import { Box, Button } from "@material-ui/core";
import SettingsGroup from "./SettingsGroup";
import { useSelector, useDispatch } from 'react-redux'
import { toggleSettingsPanelVisibility } from '../../../redux/actions';
const Settings = () => {
  const dispatch = useDispatch();
  const showSettingsContent = useSelector(state => state.sdsState.settings_panel_visible);
  const metaDataPropertiesModel = useSelector(state => state.sdsState.metadata_model);
  const save = () => {
    dispatch(toggleSettingsPanelVisibility(!showSettingsContent));
  };
  return (
    <Box style={{ position: "relative", maxHeight: "84vh", overflow: "auto" }}>
        {
            Object.keys(metaDataPropertiesModel).map(group => <SettingsGroup title={group} group={metaDataPropertiesModel[group]} />)
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
