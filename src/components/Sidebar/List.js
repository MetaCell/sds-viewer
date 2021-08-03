import React from 'react';
import {
  Box,
  IconButton,
} from '@material-ui/core';
import Search from '../../images/search.svg';
import InstancesTreeView from './TreeView/InstancesTreeView';

const SidebarContent = (props) => {
  const { expand, setExpand, searchTerm } = props;
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
        <InstancesTreeView searchTerm={searchTerm} />
      )}
    </Box>
  )
}

export default SidebarContent;
