import React from 'react';
import { Typography } from '@material-ui/core';
import CLOSE from '../../images/close.svg';

const UploadDialogHeader = (props) => {
  const { handleClose } = props;

  return (
    <>
      <img src={CLOSE} onClick={handleClose} alt='Close' />
      <Typography component='h3'>Upload your dataset</Typography>

      <Typography component='h6'>Local System</Typography>
    </>
  );
}

export default UploadDialogHeader;
