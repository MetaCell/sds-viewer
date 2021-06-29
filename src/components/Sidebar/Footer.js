import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
} from '@material-ui/core';
import Help from '../../images/help.svg';
import Plus from '../../images/plus.svg';
import ArrowRight from '../../images/arrow-right.svg';
import { IMPORT_TEXT } from '../../constants';

const SidebarFooter = (props) => {
  const { expand, setExpand } = props;
  return (
    <Box className='sidebar-footer'>
      <Button variant='contained' disableElevation color='primary' onClick={() => props.setOpenDialog(true)}>
        <Typography component='label'>
          <img src={Plus} alt='Plus' />
          { IMPORT_TEXT }
        </Typography>
      </Button>
      <Box className='support'>
        {!expand ? (
          <IconButton
            aria-label='toggle'
            onClick={() => setExpand(!expand)}
          >
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
  )
}

export default SidebarFooter;
