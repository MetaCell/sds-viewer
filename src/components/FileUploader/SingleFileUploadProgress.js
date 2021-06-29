import { Grid, LinearProgress, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { FileHeader } from './FileHeader';

export function SingleFileUploadWithProgress({
  file,
  onDelete,
  onUpload,
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function upload() {
      const url = uploadFile(file, setProgress);
      onUpload(file, url);
    }

    upload();
  }, []);

  return (
    <Grid item>
      <FileHeader file={file} onDelete={onDelete} />
      <Typography>{progress} %</Typography>
      {progress < 100 ? <LinearProgress variant="determinate" value={progress} /> : <LinearProgress color="primary" variant="determinate" value={progress} /> }
    </Grid>
  );
}


function uploadFile(file, onProgress) {
  var fileReader = new FileReader();
  fileReader.readAsBinaryString(file);
  fileReader.onload = function(res) {
    console.log(res)
    // onUpload(file, url);
      // do something on FileReader onload
      // loaded++;

      // if (loaded == total){
      //     onAllFilesLoaded();
      // }
  }

  fileReader.onprogress = function(data) {
      if (data.lengthComputable) {                                            
          var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
          console.log(progress)
          onProgress(progress);
      }
  }
}
