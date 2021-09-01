import Help from '../../images/help.svg';
import Plus from '../../images/plus.svg';
import { IMPORT_TEXT } from '../../constants';
import ArrowRight from '../../images/arrow-right.svg';
import { Box, IconButton, Typography, Button } from '@material-ui/core';

const SidebarFooter = (props) => {
  const { expand, setExpand } = props;
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
