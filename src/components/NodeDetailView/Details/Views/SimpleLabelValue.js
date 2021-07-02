import React from "react";
import {
  Box,
  Typography,
} from "@material-ui/core";

const SimpleLabelValue = ({label, value}) => {
  return (
    <Box className="tab-content-row">
      <Typography component="label">{label}</Typography>
      <Typography>{value}</Typography>
    </Box>
  )
}

export default SimpleLabelValue;