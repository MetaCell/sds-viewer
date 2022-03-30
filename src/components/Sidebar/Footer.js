import Plus from '../../images/plus.svg';
import { ADD_DATASET, LIST_DATASETS } from '../../constants';
import { Box, Button } from '@material-ui/core';

const SidebarFooter = (props) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Button
        variant='contained'
        disableElevation
        color='primary'
        style={{ "width" : "50%", "min-width" : "50%" }}
        onClick={() => props.setOpenUploadDialog(true)}
      >
        <img src={Plus} alt='Plus' />
        {ADD_DATASET}
      </Button>
      <Button
        variant='contained'
        disableElevation
        color='primary'
        style={{ "width" : "50%", "min-width" : "50%" }}
        onClick={() => props.setOpenDatasetsListDialog(true)}
      >
        <img src={Plus} alt='Plus' />
        {LIST_DATASETS}
      </Button>
    </Box>
  );
};

export default SidebarFooter;
