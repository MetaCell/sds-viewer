import Plus from '../../images/plus.svg';
import { ADD_DATASET } from '../../constants';
import { Box, Button, Typography } from '@material-ui/core';
import config from "./../../config/app.json";

const SidebarFooter = (props) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Button
          variant='contained'
          disableElevation
          color='primary'
          style={{ "width" : "45%","minWidth" : "45%" }}
          onClick={() => props.setOpenUploadDialog(true)}
        >
          <img src={Plus} alt='Plus' />
          {ADD_DATASET}
        </Button>
        <Button
          variant='contained'
          disableElevation
          color='primary'
          style={{ "width" : "45%", "minWidth" : "45%" }}
          onClick={() => props.setOpenDatasetsListDialog(true)}
        >
          {config.text.datasetsButtonText}
        </Button>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography align="center" className='no-instance' variant='h6'><a style={{"color" : "white" }} align="center" href={config.docs_url} target="_blank">User manual</a></Typography>
      </Box>
    </Box>
  );
};

export default SidebarFooter;
