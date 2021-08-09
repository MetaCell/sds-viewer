import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import UploadIcon from '../../images/upload-icon.svg';
import UploadSubmit from './UploadSubmit';
import  { FilesUploading } from './UploadView/FilesUploading';
import { FILE_UPLOAD_PARAMS } from '../../constants';

const Uploader = ({ handleClose, handleDone }) => {
  const [files, setFiles] = useState([]);
  const [loadedFiles, setLoadedFiles] = useState(0);

  const handleChange = (files) => {
  };

  const onUpload = (file, data) => {
    setLoadedFiles((loadedFiles) =>  loadedFiles + 1);
    setFiles((curr) =>
      curr.map((fw) => {
        if (fw.file === file) {
          return { ...fw, data };
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
        filesLimit={FILE_UPLOAD_PARAMS.maxFiles}
      />

      {files && files.length ? (
        <FilesUploading files={files} onDelete={onDelete} onUpload={onUpload} />
      ): null }

      {loadedFiles === files.length && loadedFiles !== 0 && (
        <UploadSubmit handleClose={() => {handleDone(files)}} />
      )}
    </>
  );
};

export default Uploader;
