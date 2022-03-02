import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import UploadIcon from '../../images/upload-icon.svg';
import UploadSubmit from './UploadSubmit';
import  { FilesUploading } from './UploadView/FilesUploading';
import { FILE_UPLOAD_PARAMS } from '../../constants';

const Uploader = ({ handleClose, handleDone }) => {
  const [rdf, setRdf] = useState(undefined);
  const [json, setJson] = useState(undefined);

  const handleChange = (files) => {
  };

  const onUpload = (file, data) => {
    if (rdf?.file === file && file.type === "text/turtle") {
      setRdf({
        ...rdf, data
      })
    } else if (json?.file === file && file.type === "application/json") {
      setJson({
        ...json, data
      })
    } else {
      console.error("something weird happened!")
    }
  }

  const onDelete = (file)  => {
    if (rdf?.file === file && file.type === "text/turtle") {
      setRdf(undefined);
    } else if (json?.file === file && file.type === "application/json") {
      setJson(undefined);
    } else {
      console.error("something weird happened!")
    }
  };

  const onDrop = (files, accept = true) => {
    for (const file of files) {
      if (file.type === "text/turtle") {
        setRdf({
          file,
          errors: accept ? [] : [{ message: 'Error: File is too large' }],
          id: Math.random(),
        })
      } else if (file.type === "application/json") {
        setJson({
          file,
          errors: accept ? [] : [{ message: 'Error: File is too large' }],
          id: Math.random(),
        })
      } else {
        console.error("something weird happened!")
      }
    }
  };

  const nodeRef = React.useRef('dialog');

  const DropzoneUploadIcon = () => <img src={UploadIcon} alt="upload" />

  const files = [rdf, json].filter(item => item !== undefined);

  return (
    <>
      <DropzoneArea
        fileObjects={files.map(item => item.file)}
        onChange={(e) => handleChange(e)}
        showPreviewsInDropzone={false}
        onDrop={(accFiles) => onDrop(accFiles)}
        acceptedFiles={FILE_UPLOAD_PARAMS.acceptedFileExtensions}
        maxFileSize={FILE_UPLOAD_PARAMS.maxFileSize}
        onDropRejected={(rejFiles) => onDrop(rejFiles, false)}
        showAlerts={false}
        ref={nodeRef}
        Icon={DropzoneUploadIcon}
        dropzoneText={'Drag & Drop your files here'}
        filesLimit={FILE_UPLOAD_PARAMS.maxFiles}
      />

      {files && files.length ? (
        <FilesUploading files={files} onDelete={onDelete} onUpload={onUpload} />
      ): null }

      {json !== undefined && rdf !== undefined && (
        <UploadSubmit handleClose={() => {handleDone(files)}} />
      )}
    </>
  );
};

export default Uploader;
