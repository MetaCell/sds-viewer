import React from "react";
import { Box, Typography } from "@material-ui/core";
import Breadcrumbs from "../Details/Views/Breadcrumbs";
import DATASET from "../../../images/dataset.svg";
import MATLAB from "../../../images/matlab.svg";
import NIFTI from "../../../images/nifti.svg";
import VOLUME from "../../../images/volume.svg";
import vars from "../../../styles/constant";

const NodeHeader = (props) => {
  const { heading, links } = props;
  const headingStyle = {
    color: vars[heading],
    textTransform: 'capitalize'
  }
  const titleImages = {
    "dataset": DATASET,
    "nifti": NIFTI,
    "volume": VOLUME,
    "matlab": MATLAB
  };

  const headerLinks = {
    pages: [
      {
        title: '...',
        href: '/'
      },
      {
        title: 'Volume',
        href: '/'
      },
    ],
    current: heading
  };

  return (
    <Box className="secondary-sidebar_header">
      <Breadcrumbs close={props.close} links={headerLinks} />
      <img src={titleImages[heading]} alt={heading} />
      <Typography component="h3" style={headingStyle}>
        {heading}
      </Typography>
    </Box>
  );
};

export default NodeHeader;
