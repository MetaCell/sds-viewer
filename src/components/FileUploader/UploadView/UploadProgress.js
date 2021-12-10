import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import Progress from './Progress';
import FileExtension from './FileExtension';
import CANCEL from '../../../images/cancel.svg';
import SUCCESS from '../../../images/success.svg';
import FileHandler from '../../../utils/filesHandler';

const uploadFile = (file, onProgress, onUpload) => {
  const fileHandler = new FileHandler();
  const callback = fileData => {
    onUpload(file, fileData)
  }
  fileHandler.get_local_file(file, callback, onProgress);
}

export function UploadProgress({ file, onDelete, onUpload }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function upload() {
      uploadFile(file, setProgress, onUpload);
    }
    upload();
  }, []);

  return (
    <Box className='uploaded-files_row'>
      {/* Needs to be updated according to the file uploaded */}
      <FileExtension src={'MTL'} />
      <Progress file={file} progress={progress} />
      {progress < 100 ? (
        <img
          src={CANCEL}
          onClick={() => onDelete(file)}
          width='24'
          style={{ cursor: 'pointer' }}
          alt='Cancel'
        />
        ) : (
          <img src={SUCCESS} width='24' alt='SUCCESS' />
        )
      }
    </Box>
  );
}

