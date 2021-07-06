import React from 'react';
import { Box, Typography } from '@material-ui/core';
import ProgressBar from './ProgressBar';

const Progress = (props) => {
  const { progress, file, errors=[] } = props;
  return (
    <Box className='wrap'>
      <Typography>{file?.name}</Typography>
      {
        errors.length > 0 ? (
          <>
            <Typography component='strong'>{errors[0]?.message}</Typography>
            <ProgressBar value={20} error={true} />
          </>
        ) : (
          progress < 100 ? (
            <>
              <Typography component='span'>{progress}%</Typography>
              <ProgressBar value={progress} />
            </>
          ) : (
            <>
              <Typography component='strong'>{progress}%</Typography>
              <ProgressBar value={progress} color='secondary' />
            </>
          )
        )
      }
    </Box>
  )
}
export default Progress;
