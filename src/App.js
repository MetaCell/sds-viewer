import './flexlayout.css';
import theme from './theme';
import { hot } from 'react-hot-loader';
import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import MainLayout from './app/mainLayout';
import Sidebar from './components/Sidebar/Sidebar';
import UploadDialog from './components/FileUploader/UploadDialog';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import NodeDetailView from './components/NodeDetailView/NodeDetailView';
import EmptyContainer from './components/EmptyContainer';

const App = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openNodeDetail, setOpenNodeDetail] = useState(true);
  const [openLayout, setOpenLayout] = useState(false);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" className='main-structure'>
        <Sidebar openDialog={openDialog} setOpenDialog={setOpenDialog} />
        <Box className={'content' + (openNodeDetail ? ' full-round' : '')}>
          {!openLayout ? (
            <EmptyContainer
              openDialog={openLayout}
              setOpenDialog={setOpenLayout}
            />
          ) : (
            <MainLayout />
          )}
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
