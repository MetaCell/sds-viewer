import React from 'react';
import { Box, Typography, Button } from '@material-ui/core';
import { IMPORT_TEXT } from '../constants';

const EmptyContainer = (props) => {
  return (
    <Box className='MuiBox-empty'>
      <Typography variant='h3'>{IMPORT_TEXT} to start.</Typography>
      <Button
        variant='outlined'
        color='primary'
        onClick={() => props.setOpenDialog(true)}
      >
        + {IMPORT_TEXT}
      </Button>
    </Box>
  );
};
export default EmptyContainer;

