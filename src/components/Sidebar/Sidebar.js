import React, { useState, useRef, useEffect } from 'react';
import { Box } from '@material-ui/core';
import SidebarHeader from './Header';
import SidebarContent from './List';
import SidebarFooter from './Footer';

const Sidebar = (props) => {
  const [expand, setExpand] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [width, setWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !expand) return;
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left || 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth > 200) {
        setWidth(newWidth);
      }
    };
    const stopResizing = () => setIsResizing(false);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, expand]);

  return (
    <Box
      ref={sidebarRef}
      className={'sidebar' + (!expand ? ' shrink' : '')}
      style={{ width: expand ? width : 66 }}
    >
      <SidebarHeader setExpand={setExpand} expand={expand} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />
      <SidebarContent setExpand={setExpand} expand={expand} searchTerm={searchTerm} />
      <SidebarFooter
        setExpand={setExpand}
        expand={expand}
        setOpenDatasetsListDialog={props.setOpenDatasetsListDialog}
      />
      {expand && <Box className="sidebar-resizer" onMouseDown={startResizing} />}
    </Box>
  );
};

export default Sidebar;
