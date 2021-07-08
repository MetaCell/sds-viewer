import { Box, Typography } from '@material-ui/core';
import { UploadProgress } from './UploadProgress';
import { UploadError } from './UploadError';

export function FilesUploading({ files, onDelete, onUpload }) {
  return (
    <Box className='uploaded-files'>
      <Typography component='h3'>Uploaded files</Typography>
      {files.map((fileWrapper) => (
        <Box key={fileWrapper.id}>
          {fileWrapper.errors.length ? (
            <UploadError
              file={fileWrapper.file}
              errors={fileWrapper.errors}
              onDelete={onDelete}
            />
          ) : (
            <UploadProgress
              onDelete={onDelete}
              onUpload={onUpload}
              file={fileWrapper.file}
              totalFiles={files.length}
            />
          )}
        </Box>
      ))}
    </Box>
  )
};
