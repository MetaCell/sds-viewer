import React, { useState, useEffect } from 'react';
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

const UrlUploader = ({ handleClose, handleDone }) => {
  const [loader, setLoader] = useState(false);
  const [url, setUrl] = useState('');
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [files, setFiles] = useState([
    {
      id: "ttl",
      url: undefined,
      data: undefined,
      file: {
        name: "ttl",
        type: "text/turtle"
      }
    },
    {
      id: "json",
      url: undefined,
      data: undefined,
      file: {
        name: "json",
        type: "application/json"
      }
    }
  ]);

  const onUpload = (url, data) => {
    var fileExt = url.split('.').pop();

    setFiles((curr) =>
      curr.map((item) => {
        if (item.id === fileExt && data !== undefined) {
          return { ...item, url, data };
        }
        return item;
      }),
    );
  };

  const getJsonURL = url => {
    var urls = url.split('/');
    var dataset = urls.pop().replace('N%3Adataset%3A', '').replace('.ttl', '');
    var base_url = urls.shift();
    urls.pop();
    urls.map(item => {
      base_url = base_url + '/' + item;
      return item;
    })
    var json_url = base_url + '/path-metadata/' + dataset + '/LATEST_RUN/path-metadata.json'
    return json_url
  }

  const uploadFile = () => {
    const fileHandler = new FileHandler();
    const fileHandler2 = new FileHandler();
    const callback = (url, fileData) => {
      onUpload(url, fileData);
    };
    setLoader(true);
    fileHandler.get_remote_file(url, callback);
    fileHandler2.get_remote_file(getJsonURL(url), callback);
  };

  const removeUrl = () => {
    setUrl('');
    setFileDownloaded(false);
  };

  useEffect(() => {
    if (loader && !fileDownloaded) {
      if (files[0].data !== undefined && files[1].data !== undefined) {
        setLoader(false);
        setFileDownloaded(true);
      }
    }
  }, [loader, fileDownloaded, files] );

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

      {fileDownloaded ? (
        <UploadSubmit handleClose={() => {handleDone(files)}} />
      ) : (
        <Button
          variant='contained'
          fullWidth
          disabled={url === ''}
          disableElevation
          color='primary'
          onClick={uploadFile}
        >
          {loader ? <CircularProgress size={16} color={'primary'} /> : 'Load'}
        </Button>
      )}
    </>
  );
};

export default UrlUploader;
