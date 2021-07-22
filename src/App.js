import './flexlayout.css';
import theme from './theme';
import { hot } from 'react-hot-loader';
import { useState } from 'react';
import Box from '@material-ui/core/Box';
import MainLayout from './app/mainLayout';
import Sidebar from './components/Sidebar/Sidebar';
import UploadDialog from './components/FileUploader/UploadDialog';
import EmptyContainer from './components/EmptyContainer';
import NodeDetailView from './components/NodeDetailView/NodeDetailView';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { addDataset, deleteDataset } from './redux/actions';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';

const App = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openNodeDetail, setOpenNodeDetail] = useState(true);

  const datasets = useSelector(state => state.sdsState.datasets);
  const error_message = useSelector(state => state.sdsState.error_message);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" className='main-structure'>
        <Sidebar openDialog={openDialog} setOpenDialog={setOpenDialog} />
        <Box className={'content' + (openNodeDetail ? ' full-round' : '')}>
          { datasets.length > 0
            ? <MainLayout />
            : <EmptyContainer
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              />
          }
          <MainLayout />
        </Box>
        {/* <NodeDetailView open={openNodeDetail} handleClose={() => setOpenNodeDetail(false)} /> */}
      </Box>

      <UploadDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
      />

      <ErrorDialog
        open={error_message !== null ? true : false}
        error_message={error_message}
      />
    </MuiThemeProvider>
  );
};

export default hot(module)(App);
