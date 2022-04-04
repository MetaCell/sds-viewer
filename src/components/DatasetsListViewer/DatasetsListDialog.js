import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  DialogTitle,
  CircularProgress,
  IconButton
} from "@material-ui/core";
import { addDataset, setDatasetsList } from "../../redux/actions";
import Splinter from "./../../utils/Splinter";
import { NodeViewWidget } from "../../app/widgets";
import { addWidget } from "@metacell/geppetto-meta-client/common/layout/actions";
import DatasetsListSplinter from "./DatasetsListSplinter";
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import FileHandler from "../../utils/filesHandler";
import UploadSubmit from "./../FileUploader/UploadSubmit";
import CloseIcon from '@material-ui/icons/Close';

import config from "./../../config/app.json";

const DatasetsListDialog = (props) => {
  const dispatch = useDispatch();
  const { open, handleClose } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [_turtle, setTurtle] = useState(undefined);
  const [_json, setJson] = useState(undefined);
  const datasets = useSelector((state) => state.sdsState.available_datasets);
  const [filteredDatasets, setFilteredDatasets] = React.useState(datasets);

  let turtle_url = "";
  let json_url = "";
  let splinter = undefined;

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const fillDataset = async () => {
    splinter = new Splinter(_json, _turtle);
    const _dataset = {
      id: splinter.getDatasetId(),
      graph: await splinter.getGraph(),
      tree: await splinter.getTree(),
      splinter: splinter,
    };
    dispatch(addDataset(_dataset));
    dispatch(
      addWidget({
        id: _dataset.id,
        name: _dataset.id.substring(0, 10) + "... Graph",
        component: "graphComponent",
        panelName: "leftPanel",
        enableClose: true,
        enableRename: true,
        enableDrag: true,
        status: WidgetStatus.ACTIVE,
        config: {
          graph_id: _dataset.id,
          component: "graphComponent",
        },
      })
    );
    dispatch(addWidget(NodeViewWidget));
  };

  const handleDone = (dataset) => {
    handleClose();
    turtle_url = config.repository_url + "datasets/N%3Adataset%3A" + dataset + ".ttl";
    const ttlHandler = new FileHandler();
    ttlHandler.get_remote_file(turtle_url, (url, data) => {
      if (data) {
        setTurtle(data);
      }
    });

    json_url = config.repository_url + "path-metadata/" + dataset + "/LATEST_RUN/path-metadata.json";
    const jsonHandler = new FileHandler();
    jsonHandler.get_remote_file(json_url, (url, data) => {
      if (data) {
        setJson(data);
      }
    });
  };

  const loadDatasets = () => {
    const fileHandler = new FileHandler();
    const callback = async (url, fileData) => {
      let file = {
        id: "ttl",
        url: url,
        data: fileData,
        file: { name: "ttl", type: "text/turtle" },
      };
      const splinter = new DatasetsListSplinter(undefined, file.data);
      let graph = await splinter.getGraph();
      let datasets = graph.nodes.filter((node) => node?.attributes?.hasUriApi);
      dispatch(setDatasetsList(datasets));
      setFilteredDatasets(datasets);
    };
    const datasetsURL = config.repository_url + config.available_datasets;
    fileHandler.get_remote_file(datasetsURL, callback);
  };

  const handleChange = (event) => {
    let filtered = datasets.filter((dataset) =>
      dataset.attributes.label[0].includes(event.target.value)
    );
    setFilteredDatasets(filtered);
  };

  useEffect(() => {
    open && datasets.length === 0 && loadDatasets();
    _turtle && _json && fillDataset();
  });

  return (
    <Dialog className="datasets_dialog" open={open} handleClose={handleClose}>
      <DialogTitle align="center">
        Datasets List
        <IconButton
          aria-label="close"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box className="datasets_list">
        <TextField
          fullWidth
          disabled={datasets.length === 0}
          label="Search List"
          id="fullWidth"
          onChange={handleChange}
        />
      </Box>
      <Box className="datasets_list">
        {datasets.length > 0 ? (
          <Paper className="datasets_dialog_list">
            <List className="datasets_list">
              {filteredDatasets.map((dataset) => (
                <>
                  <ListItem
                    className="dataset_item"
                    key={`item-${dataset.name}`}
                    selected={selectedIndex === dataset.name}
                    onClick={(event) =>
                      handleListItemClick(event, dataset.name)
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography
                          type="caption"
                          style={{ fontSize: "#000000" }}
                        >{`${dataset.attributes?.label[0]}`}</Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Paper>
        ) : (
          <CircularProgress className="datasets_loader" />
        )}
      </Box>
      {selectedIndex ? (
        <Box className="datasets_list">
          <UploadSubmit handleClose={() => handleDone(selectedIndex)} />
        </Box>
      ) : null}
    </Dialog>
  );
};

export default DatasetsListDialog;
