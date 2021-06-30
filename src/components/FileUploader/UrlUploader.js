import React, { useState } from 'react';
import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  CircularProgress,
  Button,
} from '@material-ui/core';
import LINK from '../../images/url.svg';
import LINK_GREEN from '../../images/link-green.svg';
import CANCEL from '../../images/cancel.svg';
import UploadSubmit from './UploadSubmit';

const FileHandler = require('../../utils/filesHandler');

const UrlUploader = ({handleClose}) => {
  const [loader, setLoader] = useState(false);
  const [url, setUrl] = useState('');
  const [fileDownloaded, setFileDownloaded] = useState(false);

  const onUpload = (url, data) => {
    setLoader(false)
    if(data) {
      setFileDownloaded(true)
    }
  }

  const uploadFile = () => {
    const fileHandler = new FileHandler();
    const callback = fileData => {
      onUpload(url, fileData);
    }
    setLoader(true)
    fileHandler.get_remote_file(url, callback);
  }

  const removeUrl = () => {
    setUrl('');
    setFileDownloaded(false);
  }

  return (
    <>
      <FormControl variant='filled' fullWidth>
        <OutlinedInput
          id='url-uploader'
          placeholder='Dataset URL'
          className={fileDownloaded ? 'field-success' : ''}
          startAdornment={
            <InputAdornment position='start'>
              <img src={fileDownloaded ? LINK_GREEN : LINK} alt='Link' />
            </InputAdornment>
          }
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          endAdornment={
            url !== '' ? (
              <InputAdornment position='end' onClick={removeUrl}>
                <img src={CANCEL} alt='CANCEL' />
              </InputAdornment>
            ) : null
          }
        />
      </FormControl>

      { fileDownloaded ? (
          <UploadSubmit handleClose={handleClose} />
        ) : (
          <Button
            variant='contained'
            fullWidth
            disabled= {url === ''}
            disableElevation
            color='primary'
            onClick={uploadFile}
          >
            { loader ? <CircularProgress size={16} color={'secondary'} /> : 'Load' }
          </Button>
        )
      }
    </>
  );
};

export default UrlUploader;
