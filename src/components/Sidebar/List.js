import React, {useEffect} from 'react';
import {Box, IconButton} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import InstancesTreeView from './TreeView/InstancesTreeView';
import {useSelector} from 'react-redux';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';

const SidebarContent = (props) => {
  const { expand, setExpand, searchTerm } = props;

  const datasets = useSelector((state) => state.sdsState.datasets);
  const nodeSelected = useSelector((state) => state.sdsState.instance_selected);
  useEffect(() => {
    if (nodeSelected?.tree_node?.id) {
      const selectedNodeElement = document.getElementById(nodeSelected?.tree_node?.id);

        if (selectedNodeElement) {
        selectedNodeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }, [nodeSelected]);


  const renderContent = () => {
    if (datasets?.length > 0) {
      return (
          <>
            <Typography component='h3'>Uploaded Instances</Typography>
            <Box className='scrollbar'>
              {datasets.map((id, index) => (
                  <InstancesTreeView key={"tree_" + index} searchTerm={searchTerm} dataset_id={id} />
              ))}
            </Box>
          </>
      );
    } else {
      return (
          <>
            <Typography className='no-instance'>No instances to display yet.</Typography>
          </>
      );
    }
  };

  return (
      <Box className='sidebar-body'>
        {!expand ? (
            <IconButton aria-label='toggle' onClick={() => setExpand(!expand)} className='shrink-btn'>
              <SearchRoundedIcon />
            </IconButton>
        ) : (
            renderContent()
        )}
      </Box>
  );
};

export default SidebarContent;
