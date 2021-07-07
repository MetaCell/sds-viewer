import { Box } from '@material-ui/core';
import React from 'react';
import DELETE from '../../../images/delete.svg';
import Progress from './Progress';
import FileExtension from './FileExtension';

export function UploadError({ file, onDelete, errors }) {
  return (
    <Box className='uploaded-files_row error'>
      {/* Needs to be updated according to the file uploaded */}
      <FileExtension src={'NFT'} />
      <Progress file={file} errors={errors} />
      <img
        src={DELETE}
        onClick={() => onDelete(file)}
        width='24'
        style={{ cursor: 'pointer' }}
        alt='DELETE'
      />
    </Box>
  );
}

