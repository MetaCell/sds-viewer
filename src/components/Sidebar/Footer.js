import React from 'react';
import { Box, IconButton, Typography, Button } from '@material-ui/core';
import Help from '../../images/help.svg';
import Plus from '../../images/plus.svg';
import ArrowRight from '../../images/arrow-right.svg';
import { IMPORT_TEXT } from '../../constants';

import { GraphWidget, EmptyWidget } from '../../app/widgets';
import { activateWidget, addWidget, destroyWidget, maximizeWidget, minimizeWidget, setLayout, updateWidget } from '@metacell/geppetto-meta-client/common/layout/actions';
import { useDispatch } from 'react-redux';

const SidebarFooter = (props) => {
  const { expand, setExpand } = props;
  const dispatch = useDispatch();
  return (
    <Box className='sidebar-footer'>
      <Button
        variant='contained'
        disableElevation
        color='primary'
        onClick={() => {
          dispatch(addWidget(EmptyWidget));
          dispatch(addWidget(GraphWidget));
        }}
      >
        <img src={Plus} alt='Plus' />
        Add with layout manager
      </Button>
      <br />
      <Button
        variant='contained'
        disableElevation
        color='primary'
        onClick={() => props.setOpenDialog(true)}
      >
        <img src={Plus} alt='Plus' />
        {IMPORT_TEXT}
      </Button>
      <Box className='support'>
        {!expand ? (
          <IconButton aria-label='toggle' onClick={() => setExpand(!expand)}>
            <img src={Help} alt='Help' />
          </IconButton>
        ) : (
          <>
            <Typography>
              <img src={Help} alt='Help' />
              Support
            </Typography>
            <IconButton>
              <img src={ArrowRight} alt='Arrow' />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SidebarFooter;
