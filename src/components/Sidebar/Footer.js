import Plus from '../../images/plus.svg';
import { IMPORT_TEXT } from '../../constants';
import { Box, Button } from '@material-ui/core';

const SidebarFooter = (props) => {
  return (
    <Box className='sidebar-footer'>
      <Button
        variant='contained'
        disableElevation
        color='primary'
        onClick={() => props.setOpenDialog(true)}
      >
        <img src={Plus} alt='Plus' />
        {IMPORT_TEXT}
      </Button>
    </Box>
  );
};

export default SidebarFooter;
