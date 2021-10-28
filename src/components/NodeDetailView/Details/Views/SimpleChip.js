import React from "react";
import {
  Box,
  Chip
} from "@material-ui/core";

const SimpleChip = ({chips}) => {
  return (
    <Box className="chip-overflow noscrollbar">
      { chips?.map((item, index) => <Chip key={`${item}_${index}`} label={item} /> ) }
    </Box>
  )
}
export default SimpleChip;
