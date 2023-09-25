import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dialog,
  DialogActions,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  DialogTitle,
  CircularProgress
} from "@material-ui/core";
import { addDataset, setDatasetsList } from "../../redux/actions";
import Splinter from "./../../utils/Splinter";
import { NodeViewWidget } from "../../app/widgets";
import { addWidget } from "@metacell/geppetto-meta-client/common/layout/actions";
import DatasetsListSplinter from "./DatasetsListSplinter";
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import FileHandler from "../../utils/filesHandler";
import UploadSubmit from "./../FileUploader/UploadSubmit";
import CLOSE from '../../images/close.svg';

import config from "./../../config/app.json";

const DatasetsListDialog = (props) => {
  const dispatch = useDispatch();
  const { open, handleClose } = props;
  const [searchField, setSearchField] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(undefined);
  const datasets = useSelector((state) => state.sdsState.available_datasets);
  const [filteredDatasets, setFilteredDatasets] = React.useState(datasets);
  const PUBLISHED = "PUBLISHED";

  let turtle_url = "";
  let json_url = "";
  let splinter = undefined;
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const fillDataset = async (turtle, json) => {
    splinter = new Splinter(json, turtle);
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
    turtle_url =
      config.datasets_url + dataset + "/LATEST/curation-export.ttl";
    const fileHandler = new FileHandler();
    fileHandler.get_remote_file(turtle_url, (url, turtleData) => {
      if (turtleData) {
        json_url =
          config.datasets_url +
          dataset +
          "/LATEST/path-metadata.json";
        fileHandler.get_remote_file(json_url, (url, data) => {
          if (data) {
            fillDataset(turtleData, data);
            setFilteredDatasets(datasets);
            setSelectedIndex(undefined);
            handleClose();
          }
        });
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
      datasets.forEach( node => node.attributes ? node.attributes.lowerCaseLabel = node.attributes?.label?.[0]?.toLowerCase() : null );
      datasets = datasets.filter( node => node?.attributes?.statusOnPlatform?.[0]?.includes(PUBLISHED) );
      dispatch(setDatasetsList(datasets));
      setFilteredDatasets(datasets);
    };
    const summaryURL = config.repository_url + config.available_datasets;
    fileHandler.get_remote_file(summaryURL, callback);
  };

  const handleChange = (event) => {
    const lowerCaseSearch = event.target.value.toLowerCase();
    let filtered = datasets.filter((dataset) =>
      dataset.attributes.lowerCaseLabel.includes(lowerCaseSearch) || dataset.name.includes(lowerCaseSearch)
    );
    setSearchField(lowerCaseSearch);
    setFilteredDatasets(filtered);
  };

  const closeDialog = () => {
    setFilteredDatasets(datasets);
    setSelectedIndex(undefined);
    handleClose();
  }

  const getFormattedListTex = (label) => {
    const reg = new RegExp(searchField, 'gi');

    return searchField === undefined || searchField === "" 
      ? 
      label 
      :
      label.replace(reg, function(str) {return '<b>'+str+'</b>'});
  }

  useEffect(() => {
    open && datasets.length === 0 && loadDatasets();
  });

  return (
    <Dialog 
      className="datasets_dialog"
      open={open}
      handleClose={closeDialog}
      PaperProps={{
        style: {
          width : '50rem'
        },
      }}
    >
      <DialogTitle align="center">
        <img
          className="dialog_close"
          src={CLOSE}
          onClick={handleClose}
          alt="Close"
        />
        <Typography variant="h3">{config.text.datasetsButtonText}</Typography>
        <Typography variant="subtitle1">{config.text.datasetsButtonSubtitleText}</Typography>
      </DialogTitle>
      {datasets.length > 0 ? (
        <>
          <Box className="datasets_list">
            <TextField
              fullWidth
              disabled={datasets.length === 0}
              label={config.text.datasetsDialogSearchText}
              id="fullWidth"
              onChange={handleChange}
            />
          </Box>
          {filteredDatasets.length > 0 ? (
            <Box className="datasets_list datasets_list_results" align="right">
              <Typography>{filteredDatasets.length} found</Typography>
            </Box>
          )
          :
          null
          }
          <Box className="datasets_list">
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
                            className="dataset_list_text"
                            dangerouslySetInnerHTML={{
                              __html:
                                getFormattedListTex(dataset.attributes?.label[0])
                            }}
                          />
                        }
                      />
                    </ListItem>
                    <Divider />
                  </>
                ))}
              </List>
            </Paper>
          </Box>
        </>
      ) : (
        <Box className="datasets_list">
          <CircularProgress className="datasets_loader" />
        </Box>
      )}
      <Box className="datasets_list">
        <UploadSubmit
          handleClose={() => handleDone(selectedIndex)}
          enabledButton={selectedIndex === undefined}
        />
      </Box>
    </Dialog>
  );
};

export default DatasetsListDialog;
