import React from "react";
import PropTypes from "prop-types";
import { TreeItem } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import DOWN from "../../../images/tree/down.svg";

const StyledTreeItem = (props) => {
  const {
    dataset,
    labelText,
    labelIcon: LabelIcon,
    labelInfo,
    iconClass,
    ...other
  } = props;

  return (
    <TreeItem
      data={dataset}
      label={
        <div className={`labelRoot ${iconClass}`}>
          <Box className="labelIcon"></Box>
          <Typography variant="body2" className="labelText">
            {labelText}
          </Typography>
          {labelInfo > 0 ? (
            <Typography
              variant="caption"
              className="labelCaption"
              color="inherit"
            >
              {labelInfo}
              <img src={DOWN} alt="down" />
            </Typography>
          ) : null}
        </div>
      }
      {...other}
    />
  );
};

StyledTreeItem.propTypes = {
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.number,
  labelText: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
};

export default StyledTreeItem;
