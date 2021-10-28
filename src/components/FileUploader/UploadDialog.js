import React from 'react';
import Uploader from './Uploader';
import UrlUploader from './UrlUploader';
import { useDispatch } from 'react-redux';
import UploadTabPanel from './UploadTabPanel';
import { Dialog, Box } from '@material-ui/core';
import UploadDialogHeader from './UploadDialogHeader';
import { addDataset, triggerError } from '../../redux/actions';
import { NodeViewWidget } from '../../app/widgets';
import {  addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import Splinter from '../../utils/Splinter';
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

const UploadDialog = (props) => {
  const dispatch = useDispatch();
  const { open, handleClose } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // TODO:
  // The below is just an hack waiting for the design to be clarified, I need an entrypoint for the datasets
  // that provides both the files and so far I do not want to implement anything that will be replaced later

  const handleDone = async (files) => {
    if ((files.length === 2) && (files[0].data !== undefined && files[1].data !== undefined)) {
      let _json = undefined;
      let _turtle = undefined;

      for (let file of files) {
        let extension = file.file.name.split('.').pop();
        if (extension === "ttl") {
          _turtle = file.data
        }
        if (extension === "json") {
          _json = file.data
        }
      }
      const splinter = new Splinter(_json, _turtle);
      const _dataset = {
        id: splinter.getDatasetId(),
        graph: await splinter.getGraph(),
        tree: await splinter.getTree(),
        splinter: splinter
      }

      handleClose();
      dispatch(addDataset(_dataset));
      dispatch(addWidget({
        id: _dataset.id,
        name: _dataset.id.substring(0,10) + "... Graph",
        component: "graphComponent",
        panelName: "leftPanel",
        enableClose: true,
        enableRename: true,
        enableDrag: true,
        status: WidgetStatus.ACTIVE,
        config: {
          graph_id: _dataset.id,
          component: "graphComponent",
        }
      }));
      dispatch(addWidget(NodeViewWidget));
    } else {
      handleClose();
      dispatch(triggerError("Just a test for the error dialog."))
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box className='dialog_header'>
        <UploadDialogHeader handleChange={handleChange} value={value} handleClose={handleClose} />
      </Box>

      <Box className='dialog_body'>
        <UploadTabPanel value={value} index={0}>
          <Uploader handleClose={handleClose} handleDone={handleDone}/>
        </UploadTabPanel>
        <UploadTabPanel value={value} index={1}>
          <UrlUploader handleClose={handleClose} handleDone={handleDone}/>
        </UploadTabPanel>
      </Box>
    </Dialog>
  );
};

export default UploadDialog;
