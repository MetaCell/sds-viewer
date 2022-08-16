import React from "react";
import {
  Box,
  Chip
} from "@material-ui/core";

const SimpleChip = ({chips}) => {
  return (
    <Box className="chip-overflow noscrollbar">
      { chips?.map((item, index) => (item?.link === undefined
        ? (<Chip key={`${item?.value}_${index}`} label={item?.value} />)
        : (<Chip key={`${item?.value}_${index}`} label={item?.value} onClick={() => window.open(item.link, '_blank')}/>)))
      }
    </Box>
  )
}
export default SimpleChip;
