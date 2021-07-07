import React from 'react';
import { Box } from '@material-ui/core';
import SidebarHeader from './Header';
import SidebarContent from './List';
import SidebarFooter from './Footer';

const Sidebar = (props) => {
  const [expand, setExpand] = React.useState(true);
  return (
    <Box className={'sidebar' + (!expand ? ' shrink' : '')}>
      <SidebarHeader setExpand={setExpand} expand={expand} />
      <SidebarContent setExpand={setExpand} expand={expand} />
      <SidebarFooter
        setExpand={setExpand}
        expand={expand}
        openDialog={props.openDialog}
        setOpenDialog={props.setOpenDialog}
      />
    </Box>
  );
};

export default Sidebar;
