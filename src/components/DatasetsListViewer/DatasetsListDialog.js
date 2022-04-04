import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dialog, Box, Typography, Paper, List, ListItem, ListItemText, Divider, TextField,DialogTitle, CircularProgress } from '@material-ui/core';
import { addDataset, triggerError } from '../../redux/actions';
import { NodeViewWidget } from '../../app/widgets';
import {  addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import DatasetsListSplinter from './DatasetsListSplinter';
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import FileHandler from '../../utils/filesHandler';
import UploadSubmit from './../FileUploader/UploadSubmit';

const DatasetsListDialog = (props) => {
  const dispatch = useDispatch();
  const { open, setOpen } = props;
  const [filteredDatasets, setFilteredDatasets] = React.useState([]);
  const [datasets, setDatasets] = React.useState([]);
  const url = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2022-03-28T144957%2C413227-0700/curation-export.ttl";
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleDone = (dataset) => {
    console.log("Event ", dataset);
  }

  const loadDatasets = () => {
    const fileHandler = new FileHandler();
    const callback = async (url, fileData) => {
      let file = { id : "ttl", url : url , data : fileData, file : {name: "ttl", type: "text/turtle"}};
      const splinter = new DatasetsListSplinter(undefined, file.data);
      let graph = await splinter.getGraph();
      let datasets = graph.nodes.filter( node =>  node?.attributes?.hasUriApi );
      setDatasets(datasets);
      setFilteredDatasets(datasets);
    };
    fileHandler.get_remote_file(url, callback);
  }
  
  const handleChange = (event) => {
    let filtered =  datasets.filter( dataset => dataset.attributes.label[0].includes(event.target.value) );
    setFilteredDatasets( filtered );
  };

  useEffect(() => {
    open && filteredDatasets.length === 0 && loadDatasets();
  });

  return (
    <Dialog className="datasets_dialog" open={open} handleClose={() => setOpen(false)}>
      <DialogTitle align="center">Datasets List</DialogTitle>
      <Box className='datasets_list'>
        <TextField fullWidth disabled={filteredDatasets.length === 0} label="Search List" id="fullWidth" onChange={handleChange} />
      </Box>
      <Box className='datasets_list'>
        { datasets.length > 0 ? 
          <Paper className="datasets_dialog_list">
            <List className='datasets_list'>
              {filteredDatasets.map((dataset) => (
                <>
                <ListItem className="dataset_item" key={`item-${dataset.name}`} selected={selectedIndex === dataset.name} onClick={(event) => handleListItemClick(event, dataset.name)}>
                  <ListItemText primary={<Typography type="caption" style={{ fontSize: '#000000' }}>{`${dataset.attributes.label[0]}`}</Typography>} />
                </ListItem>
                <Divider/>
                </>
              ))}
            </List>
          </Paper>
          :
          <CircularProgress className="datasets_loader" />
        }
      </Box>
      { selectedIndex ?
        <Box className='datasets_list'>
          <UploadSubmit handleClose={() => handleDone(selectedIndex)} />
        </Box>
        :
        null
      }
    </Dialog>
  );
};

export default DatasetsListDialog;
