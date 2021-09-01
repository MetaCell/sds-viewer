import React from "react";
import { Box } from "@material-ui/core";
import NodeHeader from "./Headers/Header";
import Details from "./Details/Details";
import NodeFooter from "./Footers/Footer";
import { NODES } from '../../constants';
import DetailsFactory from './factory';
import { useSelector } from 'react-redux'

const NodeDetailView = (props) => {
  const nodeSelected = useSelector(state => state.sdsState.instance_selected);
  const factory = new DetailsFactory();
  const nodeDetails = factory.createDetails(nodeSelected);

  const nodeHeading = NODES[0];
  // available options to render different views - 'matlab', 'nifti', 'volume' just change the NODES index for now

  // return (
  //   <Box className={"secondary-sidebar" + (props.open ? " in" : "")}>
  //     <NodeHeader close={props.handleClose} links={headerLinks} heading={nodeHeading} />
  //     <Details close={props.handleClose} nodeHeading={nodeHeading} />
  //     <NodeFooter />
  //   </Box>
  // );

  return (
    <Box className={"secondary-sidebar" + (props.open ? " in" : "")}>
      { nodeDetails.getDetails() }
      <NodeFooter />
    </Box>
  );
};
export default NodeDetailView;
