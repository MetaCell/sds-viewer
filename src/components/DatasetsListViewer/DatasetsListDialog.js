import React, { useEffect } from "react";
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
  Tabs,
  Tab
} from "@material-ui/core";
import { addDataset, setDatasetsList, triggerError } from "../../redux/actions";
import Splinter from "./../../utils/Splinter";
import { NodeViewWidget } from "../../app/widgets";
import { addWidget } from "@metacell/geppetto-meta-client/common/layout/actions";
import DatasetsListSplinter from "./DatasetsListSplinter";
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import FileHandler from "../../utils/filesHandler";
import UploadSubmit from "./../FileUploader/UploadSubmit";
import Uploader from "../FileUploader/Uploader";
import UploadTabPanel from "../FileUploader/UploadTabPanel";
import { fetchHeaders } from "../../utils/versionHandler";
import CLOSE from '../../images/close.svg';
import config from "./../../config/app.json";

const DatasetsListDialog = (props) => {
  const dispatch = useDispatch();
  const { open, handleClose, enableUpload, debug } = props;
  const [searchField, setSearchField] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(undefined);
  const [tabValue, setTabValue] = React.useState(0);
  const datasets = useSelector((state) => state.sdsState.available_datasets);
  const [filteredDatasets, setFilteredDatasets] = React.useState(datasets);
  const [versionID, setVersionID] = React.useState("")
  const PUBLISHED = "PUBLISHED";

  let turtle_url = "";
  let json_url = "";
  let splinter = undefined;
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  const handleUploadDone = async (files) => {
    if ((files.length === 2) && (files[0].data !== undefined && files[1].data !== undefined)) {
      let _json = undefined;
      let _turtle = undefined;

      for (let file of files) {
        let extension = file.file.name.split('.').pop();
        if (extension === "ttl") {
          _turtle = file.data;
        }
        if (extension === "json") {
          _json = file.data;
        }
      }
      const splinter = new Splinter(_json, _turtle);
      const _dataset = {
        id: splinter.getDatasetId(),
        graph: await splinter.getGraph(),
        tree: await splinter.getTree(),
        splinter: splinter,
      };
      handleClose();
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
    } else {
      handleClose();
      dispatch(triggerError("Just a test for the error dialog."));
    }
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

  const loadDatasets = async (versionID) => {
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
      if (!debug) {
        datasets = datasets.filter(
          node => node?.attributes?.statusOnPlatform?.[0]?.includes(PUBLISHED)
        );
      }
  
      let datasetStorage = {};
      let parsedDatasets = []
      datasets?.forEach( node =>  {
        parsedDatasets.push({ name : node.name , doi : node.attributes?.hasDoi?.[0], label : node.attributes ? node.attributes?.title?.[0] : null}); 
      });
      datasetStorage = {
        version : versionID,
        datasets : parsedDatasets,
        debug : debug
      }
  
      localStorage.setItem(config.datasetsStorage, JSON.stringify(datasetStorage));
      dispatch(setDatasetsList(datasetStorage.datasets));
      setFilteredDatasets(datasetStorage.datasets);
    };
    const summaryURL = config.repository_url + config.available_datasets;
    fileHandler.get_remote_file(summaryURL, callback);
  };  

  const handleChange = (event) => {
    const lowerCaseSearch = event.target.value.toLowerCase();
    let filtered = datasets.filter((dataset) =>
      dataset.label?.includes(lowerCaseSearch) || dataset.name?.includes(lowerCaseSearch)
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
    const fetchData = async () => {
      if (open && datasets.length === 0) {
        try {
          const versionID = await fetchHeaders(config.repository_url + config.available_datasets);
          const storage = JSON.parse(localStorage.getItem(config.datasetsStorage));
          const storageVersion = storage?.version;
          const debugStored = storage?.debug;
  
          if (storage && versionID === storageVersion && debug === debugStored) {
            dispatch(setDatasetsList(storage.datasets));
            if (!debug) {
              datasets = storage.datasets.filter(
                node => node?.attributes?.statusOnPlatform?.[0]?.includes(PUBLISHED)
              );
            }
            setFilteredDatasets(storage.datasets);
          } else {
            await loadDatasets(versionID);
          }
        } catch (error) {
          console.error("Error in useEffect:", error);
        }
      }
    };
    fetchData();
  }, [open]); 

  return (
    <Dialog
      className="datasets_dialog"
      open={open}
      onClose={closeDialog}
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
        <Typography component="div" variant="h3">{config.text.datasetsButtonText}</Typography>
        <Typography component="div" variant="subtitle1">{config.text.datasetsButtonSubtitleText}</Typography>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="import tabs" centered>
          <Tab label="Repository" />
          {enableUpload ? <Tab label="Upload" /> : null}
        </Tabs>
      </DialogTitle>

      <UploadTabPanel value={tabValue} index={0}>
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
            ) : null}
            <Box className="datasets_list">
              <Paper className="datasets_dialog_list">
                <List className="datasets_list">
                  {filteredDatasets.map((dataset) => (
                    <React.Fragment key={`item-${dataset.name}`}>
                      <ListItem
                        className="dataset_item"
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
                                __html: getFormattedListTex(
                                  dataset.label ? dataset.label : dataset.name
                                ),
                              }}
                            />
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
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
      </UploadTabPanel>

      {enableUpload ? (
        <UploadTabPanel value={tabValue} index={1}>
          <Box className="dialog_body">
            <Uploader handleClose={handleClose} handleDone={handleUploadDone} />
          </Box>
        </UploadTabPanel>
      ) : null}
    </Dialog>
  );
};

export default DatasetsListDialog;
