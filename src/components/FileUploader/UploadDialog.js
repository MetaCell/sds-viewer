import React from 'react';
import { Dialog, Box } from '@material-ui/core';
import UploadTabPanel from './UploadTabPanel';
import UploadDialogHeader from './UploadDialogHeader';
import UrlUploader from './UrlUploader';
import Uploader from './Uploader';

const UploadDialog = (props) => {
  const { open, handleClose } = props;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <Box className='dialog_header'>
        <UploadDialogHeader handleChange={handleChange} value={value} handleClose={handleClose} />
      </Box>

      <Box className='dialog_body'>
        <UploadTabPanel value={value} index={0}>
          <Uploader handleClose={handleClose} />
        </UploadTabPanel>
        <UploadTabPanel value={value} index={1}>
          <UrlUploader handleClose={handleClose} />
        </UploadTabPanel>
      </Box>
    </Dialog>
  );
};

export default UploadDialog;
