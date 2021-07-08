import React from 'react';
import {
  Box,
  IconButton,
  FilledInput,
  FormControl,
  InputAdornment,
  Button,
} from '@material-ui/core';
import ToggleRight from '../../images/toggle-right.svg';
import Logo from '../../images/logo.svg';
import ToggleLeft from '../../images/toggle-left.svg';
import Search from '../../images/search.svg';

const SidebarHeader = (props) => {
  const { expand, setExpand } = props;
  return (
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

  )
}

export default SidebarHeader;
