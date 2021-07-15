import React, { useState } from 'react';
import { hot } from 'react-hot-loader';
import Box from '@material-ui/core/Box';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import theme from './theme';
import Sidebar from './components/Sidebar/Sidebar';
import NodeDetailView from './components/NodeDetailView/NodeDetailView';
import EmptyContainer from './components/EmptyContainer';
import UploadDialog from './components/FileUploader/UploadDialog';
import MainLayout from './app/mainLayout';

const App = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openNodeDetail, setOpenNodeDetail] = useState(true);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box className='main-structure'>
        <Sidebar openDialog={openDialog} setOpenDialog={setOpenDialog} />
        <Box className={'content' + (openNodeDetail ? ' full-round' : '')}>
          {/* <EmptyContainer
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
          /> */}
          <MainLayout />
        </Box>
        <NodeDetailView open={openNodeDetail} handleClose={() => setOpenNodeDetail(false)} />
      </Box>

      <UploadDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
      />
    </MuiThemeProvider>
  );
};

export default hot(module)(App);
