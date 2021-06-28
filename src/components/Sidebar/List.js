import React from 'react';
import {
  Box,
  Typography,
  IconButton,
} from '@material-ui/core';
import Search from '../../images/search.svg';

const SidebarContent = (props) => {
  const { expand, setExpand } = props;
  return (
    <Box className='sidebar-body'>
      {!expand ? (
        <IconButton
          aria-label='toggle'
          onClick={() => setExpand(!expand)}
        >
          <img src={Search} alt='Search' />
        </IconButton>
      ) : (
        <Typography className='no-instance'>
          No instances to display yet.
        </Typography>
      )}
    </Box>
  )
}

export default SidebarContent;
