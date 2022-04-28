import './flexlayout.css';
import theme from './theme';
import { useState } from 'react';
import { hot } from 'react-hot-loader';
import Box from '@material-ui/core/Box';
import Splinter from './utils/Splinter';
import MainLayout from './app/mainLayout';
import FileHandler from './utils/filesHandler';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from './components/Sidebar/Sidebar';
import EmptyContainer from './components/EmptyContainer';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import UploadDialog from './components/FileUploader/UploadDialog';
import DatasetsListDialog from './components/DatasetsListViewer/DatasetsListDialog';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import { addDataset } from './redux/actions';
import { NodeViewWidget } from './app/widgets';
import {  addWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

import config from './config/app.json';

const App = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get('id');

  const dispatch = useDispatch();
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDatasetsListDialog, setOpenDatasetsListDialog] = useState(false);
  const datasets = useSelector(state => state.sdsState.datasets);
  const error_message = useSelector(state => state.sdsState.error_message);
  const [_turtle, setTurtle] = useState(undefined);
  const [_json, setJson] = useState(undefined);
  const [initialised, setInitialised] = useState(false);
  const [loading, setLoading] = useState(() => {
    if (id && id !== "") {
      return true;
    }
    return false;
  });


  let turtle_url = '';
  let json_url = '';
  let splinter = undefined;

  const fillDataset = async () => {
    splinter = new Splinter(_json, _turtle);
    const _dataset = {
      id: splinter.getDatasetId(),
      graph: await splinter.getGraph(),
      tree: await splinter.getTree(),
      splinter: splinter
    };
    dispatch(addDataset(_dataset));
    dispatch(addWidget({
      id: _dataset.id,
      name: _dataset.id.substring(0,10) + "... Graph",
      component: "graphComponent",
      panelName: "leftPanel",
      enableClose: true,
      enableRename: true,
      enableDrag: true,
      status: WidgetStatus.ACTIVE,
      config: {
        graph_id: _dataset.id,
        component: "graphComponent",
      }
    }));
    dispatch(addWidget(NodeViewWidget));
    setLoading(false);
  }

  if (id && id !== "" && _turtle === undefined) {
    turtle_url = config.datasets_url + id + '/LATEST/curation-export.ttl'
    const ttlHandler = new FileHandler();
    ttlHandler.get_remote_file(turtle_url, (url, data) => {
      if (data) {
        setTurtle(data);
      }
    }, () => {
      setLoading(false);
    });
  }

  if (id && id !== "" && _json === undefined) {
    json_url = config.datasets_url + id + '/LATEST/path-metadata.json'
    const jsonHandler = new FileHandler();
    jsonHandler.get_remote_file(json_url, (url, data) => {
      if (data) {
        setJson(data);
      }
    }, () => {
      setLoading(false);
    });
  }

  if (_turtle && _json && !initialised) {
    fillDataset();
    setInitialised(true);
  }

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
                loading={loading}
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
