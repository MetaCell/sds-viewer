import React from 'react';
import {
  Box,
  IconButton,
} from '@material-ui/core';
import Search from '../../images/search.svg';
import TreeView from './TreeView/TreeView';

const SidebarContent = (props) => {
  const { expand, setExpand, instances, searchTerm } = props;
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
        <TreeView instances={instances} searchTerm={searchTerm} />
      )}
    </Box>
  )
}

export default SidebarContent;
