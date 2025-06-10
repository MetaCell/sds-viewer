import React from 'react';
import { Typography, Tabs, Tab } from '@material-ui/core';
import CLOSE from '../../images/close.svg';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const UploadDialogHeader = (props) => {
  const { value, handleChange, handleClose } = props;

  return (
    <>
      <img src={CLOSE} onClick={handleClose} alt='Close' />
      <Typography component='h3'>Upload your dataset</Typography>

      <Tabs
        className='rounded'
        value={value}
        onChange={handleChange}
        aria-label='simple tabs example'
      >
        <Tab className='rounded' label='Local System' {...a11yProps(0)} />
        {/* <Tab className='rounded' label='From a URL' {...a11yProps(1)} /> */}
      </Tabs>
    </>
  );
}

export default UploadDialogHeader;
