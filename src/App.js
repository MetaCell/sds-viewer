import './flexlayout.css';
import theme from './theme';
import { useState } from 'react';
import { hot } from 'react-hot-loader';
import Box from '@material-ui/core/Box';
import MainLayout from './app/mainLayout';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar/Sidebar';
import EmptyContainer from './components/EmptyContainer';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import UploadDialog from './components/FileUploader/UploadDialog';
import DatasetsListDialog from './components/DatasetsListViewer/DatasetsListDialog';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';

const App = () => {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDatasetsListDialog, setOpenDatasetsListDialog] = useState(false);
  const datasets = useSelector(state => state.sdsState.datasets);
  const error_message = useSelector(state => state.sdsState.error_message);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" className='main-structure'>
        <Sidebar
          openUploadDialog={openUploadDialog}
          setOpenUploadDialog={setOpenUploadDialog}
          openDatasetsListDialog={openDatasetsListDialog}
          setOpenDatasetsListDialog={setOpenDatasetsListDialog}
        />
        <Box className={'content full-round'}>
          { datasets.length > 0
            ? <MainLayout />
            : <EmptyContainer
                openUploadDialog={openUploadDialog}
                setOpenUploadDialog={setOpenUploadDialog}
              />
          }
        </Box>
      </Box>

      <UploadDialog
        open={openUploadDialog}
        handleClose={() => setOpenUploadDialog(false)}
      />

      <DatasetsListDialog
        open={openDatasetsListDialog}
        handleClose={() => setOpenDatasetsListDialog(false)}
      />

      <ErrorDialog
        open={error_message !== null ? true : false}
        error_message={error_message}
      />
    </MuiThemeProvider>
  );
};

export default hot(module)(App);
