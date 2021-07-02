import React from "react";
import {
  Box,
  Chip
} from "@material-ui/core";

const SimpleChip = ({chips}) => {
  return (
    <Box className="chip-overflow scrollbar">
      { chips?.map((item) => <Chip label={item} /> ) }
    </Box>
  )
}
export default SimpleChip;
