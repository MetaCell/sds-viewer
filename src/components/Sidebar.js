import React from 'react';
import { 
  Box,
  Typography,
  IconButton,
  FilledInput,
  FormControl,
  InputAdornment,
  Button,
} from '@material-ui/core';
import Logo from '../images/logo.svg';
import ToggleLeft from '../images/toggle-left.svg';
import Search from '../images/search.svg';
import Help from '../images/help.svg';
import Plus from '../images/plus.svg';
import ArrowRight from '../images/arrow-right.svg';
import ToggleRight from '../images/toggle-right.svg';
import { IMPORT_TEXT } from '../constants';

const Sidebar = () => {
  const [expand, setExpand] = React.useState(true);
  return (
    <Box className={'sidebar' + (!expand ? ' shrink' : '')}>
      <Box className='sidebar-header'>
        <img src={Logo} alt='Logo' />
        <IconButton aria-label='toggle' onClick={() => setExpand(!expand)}>
          <img src={!expand ? ToggleRight : ToggleLeft} alt='Toggle' />
        </IconButton>

        {expand && (
          <FormControl variant='filled' fullWidth>
            <FilledInput
              disableUnderline={true}
              id='filled-adornment-password'
              placeholder='Search for an instance'
              startAdornment={
                <InputAdornment position='start'>
                  <img src={Search} alt='Search' />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position='end'>
                  <Button>Search</Button>
                </InputAdornment>
              }
            />
          </FormControl>
        )}
      </Box>
      <Box className='sidebar-body'>
        {!expand ? (
          <IconButton
            aria-label='toggle'
            onClick={() => setExpand(!expand)}
          >
            <img src={Search} alt='Search' />
          </IconButton>
        ) : (
          <Typography className='no-instance'>
            No instances to display yet.
          </Typography>
        )}
      </Box>
      <Box className='sidebar-footer'>
        <Button variant='contained' disableElevation color='primary'>
          <Typography component='label'>
            <input type='file' />
            <img src={Plus} alt='Plus' />
            { IMPORT_TEXT }
          </Typography>
        </Button>
        <Box className='support'>
          {!expand ? (
            <IconButton
              aria-label='toggle'
              onClick={() => setExpand(!expand)}
            >
              <img src={Help} alt='Help' />
            </IconButton>
          ) : (
            <>
              <Typography>
                <img src={Help} alt='Help' />
                Support
              </Typography>
              <IconButton>
                <img src={ArrowRight} alt='Arrow' />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar;
