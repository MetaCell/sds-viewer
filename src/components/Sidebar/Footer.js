import Plus from '../../images/plus.svg';
import { ADD_DATASET } from '../../constants';
import { Box, Button, Typography } from '@material-ui/core';
import config from "./../../config/app.json";


const SidebarFooter = (props) => {

  return (
    <Box>
      <Box display="flex" justifyContent= { props.local ? "space-around" : "center"}>
        { props.local ? <Button
          variant='contained'
          disableElevation
          color='primary'
          style={{ "width" : "45%","minWidth" : "45%" }}
          onClick={() => props.setOpenUploadDialog(true)}
        >
          <img src={Plus} alt='Plus' />
          {ADD_DATASET}
        </Button> : null }
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
      <Box display="flex" justifyContent="center">
        <Typography variant='subtitle1' color='primary'> Powered by MetaCell</Typography>
      </Box>
    </Box>
  );
};

export default SidebarFooter;
