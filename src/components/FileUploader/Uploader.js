import React, { useEffect, useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import UploadIcon from '../../images/upload-icon.svg';
import UploadSubmit from './UploadSubmit';
import  { FilesUploading } from './UploadView/FilesUploading';
import { FILE_UPLOAD_PARAMS } from '../../constants';
import { useDispatch } from 'react-redux';
import { addDataset, deleteDataset, triggerError } from '../../redux/actions';

const Uploader = ({ handleClose }) => {
  const [files, setFiles] = useState([]);
  const [loadedFiles, setLoadedFiles] = useState(0);

  const handleChange = (files) => {
  };

  const dispatch = useDispatch();

  const onUpload = (file, url) => {
    setLoadedFiles((loadedFiles) =>  loadedFiles + 1);
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, url };
        }
        return fw;
      }),
    );
  }

  const onDelete = (file)  => setFiles((curr) => curr.filter((fw) => fw.file !== file));

  const onDrop = (files, accept = true) => {
    const updatedFiles = files.map((file) => ({
      file,
      errors: accept ? [] : [{ message: 'Error: File is too large' }],
      id: Math.random(),
    }));
    setFiles((curr) => [...curr, ...updatedFiles]);
  };

  const nodeRef = React.useRef('dialog');

  const DropzoneUploadIcon = () => <img src={UploadIcon} alt="upload" />

  // TODO:
  // The below is just an hack waiting for the design to be clarified, I need an entrypoint for the datasets
  // that provides both the files and so far I do not want to implement anything that will be replaced later

  const handleDone = () => {
    if ((files.length === 2) && (files[0].url !== undefined && files[1].url !== undefined)) {
      const _dataset = {
        json: undefined,
        turtle: undefined
      };

      for (let file of files) {
        if (file.file.type === "text/turtle") {
          _dataset.turtle = file.url
        }
        if (file.file.type === "application/json") {
          _dataset.json = file.url
        }
      }
      handleClose();
      dispatch(addDataset(_dataset));
    } else {
      handleClose();
      dispatch(triggerError("Just a test for the error dialog."))
    }
  }
  
  if (window.datasets !== undefined && window.datasets.length > 0) {
    dispatch(deleteDataset(window.datasets[0]));
  }

  return (
    <>
      <DropzoneArea
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
        dropzoneClass={files.length > 0 ? 'hide' : ''}
      />

      {files && files.length ? (
        <FilesUploading files={files} onDelete={onDelete} onUpload={onUpload} />
      ): null }

      {loadedFiles === files.length && loadedFiles !== 0 && (
        <UploadSubmit handleClose={handleDone} />
      )}
    </>
  );
};

export default Uploader;
