import React from 'react';
import { hot } from 'react-hot-loader'
import Box from '@material-ui/core/Box';
import {
  MuiThemeProvider,
  CssBaseline,
} from '@material-ui/core';
import theme from './theme';
import Sidebar from './components/Sidebar';
import EmptyContainer from './components/EmptyContainer';

const App = () => {
   return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box className='main-structure'>
        <Sidebar />
        <Box className='content'>
          <EmptyContainer />
        </Box>
      </Box>
    </MuiThemeProvider>
  );
};

export default hot(module)(App);
