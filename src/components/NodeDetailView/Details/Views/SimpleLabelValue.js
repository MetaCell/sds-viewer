import React from "react";
import {
  Box,
  Typography,
} from "@material-ui/core";

const SimpleLabelValue = ({label, value, heading}) => {
  return (
    <>
      { heading ? <Typography component="h3">{heading}</Typography> : null }
      <Box className="tab-content-row">
        <Typography component="label">{label}</Typography>
        <Typography>{value}</Typography>
      </Box>
    </>
  )
}

export default SimpleLabelValue;