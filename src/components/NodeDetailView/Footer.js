import React from 'react';
import { Box } from '@material-ui/core';
import FILTER from '../../images/filter.svg';

const NodeFooter = () => {
  return (
    <Box className='secondary-sidebar_footer'>
      <img src={FILTER} alt='FILTER' />
    </Box>
  );
};

export default NodeFooter;
