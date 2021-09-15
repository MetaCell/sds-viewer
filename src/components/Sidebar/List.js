import React from 'react';
import {
  Box,
  IconButton,
} from '@material-ui/core';
import Search from '../../images/search.svg';
import Typography from '@material-ui/core/Typography';
import InstancesTreeView from './TreeView/InstancesTreeView';
import { useSelector, useDispatch } from 'react-redux'

const SidebarContent = (props) => {
  const { expand, setExpand, searchTerm } = props;
  const datasets = useSelector(state => state.sdsState.datasets);

  const renderContent = () => {
    if (datasets?.length > 0) {
      return (
        <>
          <Typography component='h3'>Uploaded Instances</Typography>
          <Box className='scrollbar'>
            { datasets.map((id) => <InstancesTreeView searchTerm={searchTerm} dataset_id={id} />) }
          </Box>
        </>
      );
    } else {
      return (
        <>
          <Typography className='no-instance'>
            No instances to display yet.
          </Typography>
        </>
      );
    }
  };

  return (
    <Box className='sidebar-body'>
      {!expand ? (
        <IconButton
          aria-label='toggle'
          onClick={() => setExpand(!expand)}
        >
          <img src={Search} alt='Search' />
        </IconButton>
      ) : ( renderContent() )
      }
    </Box>
  )
}

export default SidebarContent;


// (
//   <>
//     <Typography component='h3'>Uploaded Instances</Typography>
//     { datasets.map( id => {
//       return <InstancesTreeView searchTerm={searchTerm} dataset={window.datasets[id].tree }/>
//     })
//     }
//   </>
// )
