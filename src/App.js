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
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';

const App = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const datasets = useSelector(state => state.sdsState.datasets);
  const error_message = useSelector(state => state.sdsState.error_message);

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');
  console.log("the id is " + id);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" className='main-structure'>
        <Sidebar openDialog={openDialog} setOpenDialog={setOpenDialog} />
        <Box className={'content full-round'}>
          { datasets.length > 0
            ? <MainLayout />
            : <EmptyContainer
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              />
          }
        </Box>
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
