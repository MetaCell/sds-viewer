import React from 'react';
import {
  Box,
  IconButton,
  FilledInput,
  FormControl,
  InputAdornment,
  Button,
} from '@material-ui/core';
import Logo from '../../images/logo.svg';
import ToggleLeft from '../../images/toggle-left.svg';
import Search from '../../images/search.svg';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
const SidebarHeader = (props) => {
  const { expand, setExpand, setSearchTerm, searchTerm } = props;
  const handleChange = ( e ) => {
    setSearchTerm(e.target.value)
  }

  return (
    <Box className='sidebar-header'>
        <img src={Logo} alt='Logo' />
        <IconButton aria-label='toggle' onClick={() => setExpand(!expand)} className='shrink-btn'>
            {!expand ? <KeyboardTabIcon/> : <img src={ToggleLeft} alt='Toggle'/>}
        </IconButton>

        {expand && (
          <FormControl variant='filled' fullWidth>
            <FilledInput
              aria-autocomplete='none'
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
                  <Button onClick={() => setSearchTerm(setSearchTerm)}>Search</Button>
                </InputAdornment>
              }
              value={searchTerm}
              onChange={handleChange}
            />
          </FormControl>
        )}
      </Box>

  )
}

export default SidebarHeader;
