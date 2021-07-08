import React from "react";
import { Box } from "@material-ui/core";
import PrimaryDetailView from "./Primary";
import SecodaryDetailView from "./Secondary";
import { NODES } from '../../../constants';

const view = (selection) => {
  switch (selection) {
    case NODES[0]: return <PrimaryDetailView />
    default:
      return <SecodaryDetailView />
  }
}

const Details = ({nodeHeading}) => {
  return (
    <Box className="secondary-sidebar_body">
      { nodeHeading ? view(nodeHeading) : <></> }
    </Box>
  );
};

export default Details;
