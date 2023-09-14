import Plus from '../../images/plus.svg';
import { ADD_DATASET } from '../../constants';
import { Box, Button, Typography, Link } from '@material-ui/core';
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
      <Box display="flex" justifyContent="center">
        <Typography variant='body1'><Link href={config.docs_url}>User manual</Link></Typography>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography variant='caption'>Powered by MetaCell</Typography>
      </Box>
    </Box>
  );
};

export default SidebarFooter;
