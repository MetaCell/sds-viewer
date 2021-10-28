import React from 'react';
import { Button } from '@material-ui/core';
import CHECK from '../../images/check.svg';

const UploadSubmit = ({ handleClose }) => {
  return (
    <Button
      variant='contained'
      fullWidth
      disableElevation
      color='primary'
      onClick={handleClose}
    >
      <img src={CHECK} alt='Check' />
      Done
    </Button>
  )
}

export default UploadSubmit;
