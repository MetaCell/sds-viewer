import React from "react";
import {
  Box,
  Typography
} from "@material-ui/core";

const CustomChips = ({members, heading}) => {
  return (
    <Box className="tab-content-row">
      <Typography component="label">{heading}</Typography>
      <Box className="custom-chips scrollbar">
        {
          members ? (
            members.map((collaborator, index) => (
              <Box className="custom-chips_col" key={`${collaborator?.name}_${index}`}>
                { collaborator.img ? <img src={collaborator.img} alt={collaborator?.name} /> : null } 
                <Box className="wrap">
                  <Typography component="strong">{collaborator?.name}</Typography>
                  <Typography component="span">{collaborator?.designation}</Typography>
                </Box>
              </Box>
            ))
          ) : null
        }
      </Box>
    </Box>
  )
}
export default CustomChips;
