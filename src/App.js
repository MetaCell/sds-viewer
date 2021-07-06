import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import Box from '@material-ui/core/Box';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import theme from './theme';
import Sidebar from './components/Sidebar/Sidebar';
import EmptyContainer from './components/EmptyContainer';
import UploadDialog from './components/FileUploader/UploadDialog';

const App = () => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box className='main-structure'>
        <Sidebar
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
        <Box className='content'>
          <EmptyContainer openDialog={openDialog} setOpenDialog={setOpenDialog} />
        </Box>
      </Box>

      <UploadDialog open={openDialog} handleClose={() => setOpenDialog(false)} />
    </MuiThemeProvider>
  );
};

export default hot(module)(App);
