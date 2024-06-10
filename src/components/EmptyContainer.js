import React from 'react';
import Loader from '@metacell/geppetto-meta-ui/loader/Loader';
import { Box, Typography, Button } from '@material-ui/core';
import { IMPORT_TEXT, SPARC_DATASETS } from '../constants';

const EmptyContainer = (props) => {
  return (
    <Box className='MuiBox-empty'>
      { (props.loading)
        ? <>
          <Loader active={props.loading} />
        </>
        : <>
            <Typography variant='h3'>{IMPORT_TEXT} to start.</Typography>
            <Button
              variant='outlined'
              disableElevation
              color='primary'
              onClick={() => props.setOpenDatasetsListDialog(true)}
            >
              + { IMPORT_TEXT }
            </Button>
        </>
      }

    </Box>
  );
};
export default EmptyContainer;

