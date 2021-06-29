import React, { useState } from 'react';
import { hot } from 'react-hot-loader'
import Box from '@material-ui/core/Box';
import {
  MuiThemeProvider,
  CssBaseline,
} from '@material-ui/core';
import theme from './theme';
import Sidebar from './components/Sidebar/Sidebar';
import EmptyContainer from './components/EmptyContainer';
import FileUploaderDialog from './components/FileUploader/FileUploaderDialog';

const App = () => {
  const [openDialog, setOpenDialog] = useState(false);
   return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box className='main-structure'>
        <Sidebar openDialog={openDialog} setOpenDialog={setOpenDialog} />
        <Box className='content'>
          <EmptyContainer openDialog={openDialog} />
        </Box>
      </Box>
      <FileUploaderDialog openDialog={openDialog} handleClose={() => setOpenDialog(false)} />
    </MuiThemeProvider>
  );
};

export default hot(module)(App);
