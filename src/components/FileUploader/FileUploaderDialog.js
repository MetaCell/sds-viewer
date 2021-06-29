import React, { useState, useCallback } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
} from '@material-ui/core';
import { SingleFileUploadWithProgress } from './SingleFileUploadProgress';
import { UploadError } from './UploadError';

const FileUploaderDialog = (props) => {
  const [ files, setFiles ] = useState([]);
  const handleChange = (files) => {
    console.log(files)
    // setFiles(files)
  }
  function onUpload(file, url) {
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, url };
        }
        return fw;
      })
    );
  }

  function onDelete(file) {
    setFiles((curr) => curr.filter((fw) => fw.file !== file));
  }
  const onDrop = useCallback((accFiles) => {
    console.log(accFiles)
    const mappedAcc = accFiles.map((file) => ({ file, errors: [], id: Math.random() }));
    setFiles((curr) => [...curr, ...mappedAcc]);
  }, []);

  const onDropRejected = useCallback((rejFiles) => {
    const mappedRej = rejFiles.map((r) => ({ file: r, id: Math.random(), errors:[{message: 'Error: File is too large'}]}));
    setFiles((curr) => [...curr, ...mappedRej]);
    console.log(rejFiles)
  }, []);
  const nodeRef = React.useRef('dialog');
  return (
    <Dialog onClose={props.handleClose} aria-labelledby="dialog-title" open={props.openDialog}>
      <DialogTitle id="dialog-title">Upload dataset</DialogTitle>
      <DialogContent>
        <DropzoneArea
          onChange={(e) => handleChange(e)}
          showPreviewsInDropzone={false}
          onDrop={onDrop}
          acceptedFiles={['image/*']}
          maxFileSize= {1024 * 400}
          onDropRejected={onDropRejected}
          showAlerts={false}
          ref={nodeRef}
        />
        {files.map((fileWrapper) => (
          <Box item key={fileWrapper.id}>
            {fileWrapper.errors.length ? (
              <UploadError
                file={fileWrapper.file}
                errors={fileWrapper.errors}
                onDelete={onDelete}
              />
            ) : (
              <SingleFileUploadWithProgress
                onDelete={onDelete}
                onUpload={onUpload}
                file={fileWrapper.file}
              />
            )}
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default FileUploaderDialog;

