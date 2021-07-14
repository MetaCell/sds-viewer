import React from "react";
import PropTypes from "prop-types";
import { TreeItem } from "@material-ui/lab";
import { Typography } from "@material-ui/core";
import DOWN from "../../../images/tree/down.svg";

const StyledTreeItem = (props) => {
  const { labelText, labelIcon: LabelIcon, labelInfo, ...other } = props;

  return (
    <TreeItem
      label={
        <div className="labelRoot">
          <img src={LabelIcon} alt={LabelIcon} className="labelIcon" />
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
};

export default StyledTreeItem;
