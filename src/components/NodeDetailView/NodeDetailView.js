import React from "react";
import { Box } from "@material-ui/core";
import NodeHeader from "./Header";
import Details from "./Details/Details";
import NodeFooter from "./Footer";
import { NODES } from '../../constants';

const NodeDetailView = (props) => {
  const nodeHeading = NODES[0];
  // available options to render different views - 'matlab', 'nifti', 'volume' just change the NODES index for now

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
    current: nodeHeading
  };

  return (
    <Box className={"secondary-sidebar" + (props.open ? " in" : "")}>
      <NodeHeader close={props.handleClose} links={headerLinks} heading={nodeHeading} />
      <Details close={props.handleClose} nodeHeading={nodeHeading} />
      <NodeFooter />
    </Box>
  );
};
export default NodeDetailView;

