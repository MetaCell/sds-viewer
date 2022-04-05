import React from 'react';
import { Button } from '@material-ui/core';
import CHECK from '../../images/check.svg';

const UploadSubmit = ({ handleClose, enabledButton }) => {
  return (
    <Button
      variant='contained'
      fullWidth
      disableElevation
      color='primary'
      onClick={handleClose}
      disabled={enabledButton}
    >
      <img src={CHECK} alt='Check' />
      Done
    </Button>
  )
}

export default UploadSubmit;
