import React from 'react';
import { 
  Box,
  Typography,
  Button,
} from '@material-ui/core';
import { IMPORT_TEXT } from '../constants';

const EmptyContainer = () => {
  return (
    <Box className='MuiBox-empty'>
      <Typography variant='h3'>{ IMPORT_TEXT } to start.</Typography>
      <Button variant='outlined' color='primary'>
        <Typography component='label'>
          <input type='file' />+ { IMPORT_TEXT }
        </Typography>
      </Button>
    </Box>
  )
}
export default EmptyContainer;