import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import SidebarHeader from './Header';
import SidebarContent from './List';
import SidebarFooter from './Footer';

const Sidebar = (props) => {
  const [expand, setExpand] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box className={'sidebar' + (!expand ? ' shrink' : '')}>
      <SidebarHeader setExpand={setExpand} expand={expand} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      <SidebarContent setExpand={setExpand} expand={expand} searchTerm={searchTerm} />
      <SidebarFooter
        setExpand={setExpand}
        expand={expand}
        setOpenDatasetsListDialog={props.setOpenDatasetsListDialog}
      />
    </Box>
  );
};

export default Sidebar;
