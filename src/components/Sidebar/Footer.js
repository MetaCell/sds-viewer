import { ADD_DATASET } from '../../constants';
import {Box, Button, Divider, Typography} from '@material-ui/core';
import config from "./../../config/app.json";


const SidebarFooter = (props) => {

  return (
    <Box>
        <Divider style={{marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.10)'}} />
      <Box display="flex" justifyContent= { props.local ? "space-around" : "center"}>
        { props.local ? <Button
          variant='contained'
          disableElevation
          color='primary'
          fullWidth
          onClick={() => props.setOpenUploadDialog(true)}
        >
            + {ADD_DATASET}
        </Button> : null }
        <Button
          variant='contained'
          disableElevation
          color='primary'
          fullWidth
          onClick={() => props.setOpenDatasetsListDialog(true)}
        >
            + {props.expand ? config.text.datasetsButtonText : null}
        </Button>
      </Box>
        <Divider style={{margin: '1rem 0', background: 'rgba(255, 255, 255, 0.10)'}} />

        {
            props.expand && <Box display="flex" justifyContent="center">
                <Typography variant='subtitle2' style={{color: '#fff'}}> Powered by MetaCell</Typography>
            </Box>
        }

    </Box>
  );
};

export default SidebarFooter;
