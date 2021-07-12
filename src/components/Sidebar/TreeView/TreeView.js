import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import { TreeView, TreeItem  } from "@material-ui/lab";
import MailIcon from "@material-ui/icons/Mail";
import DeleteIcon from "@material-ui/icons/Delete";
import Label from "@material-ui/icons/Label";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import InfoIcon from "@material-ui/icons/Info";
import ForumIcon from "@material-ui/icons/Forum";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import DATASET from "../../../images/tree/dataset.svg";
import DOWN from "../../../images/tree/down.svg";
import vars from "../../../styles/constant";

const { whiteColor } = vars;

const useTreeItemStyles = makeStyles((theme) => ({
  group: {
    paddingLeft: "1.4375rem",
    margin: 0,
  },
  expanded: {},
  label: {
    fontWeight: "inherit",
    color: whiteColor,
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: "0.5625rem 0.6875rem",
  },
  labelIcon: {
    marginRight: "0.625rem",
  },
  labelText: {
    fontWeight: "normal",
    flexGrow: 1,
    fontSize: "0.8125rem",
    lineHeight: "1rem",
  },
  labelCaption: {
    height: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "0 0.25rem",
    display: "flex",
    alignItems: "center",
    borderRadius: "0.5rem",
    fontWeight: "600",
    fontSize: "0.625rem",
    lineHeight: "0.75rem",
    minWidth: "2rem",
    justifyContent: "center",
    "& img": {
      marginLeft: "0.125rem",
    },
  },
}));

function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const { labelText, labelIcon: LabelIcon, labelInfo, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <img src={LabelIcon} alt={LabelIcon} className={classes.labelIcon} />
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography
            variant="caption"
            className={classes.labelCaption}
            color="inherit"
          >
            {labelInfo}
            <img src={DOWN} alt="down" />
          </Typography>
        </div>
      }
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

StyledTreeItem.propTypes = {
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const InstancesTreeView = (props) => {
  const classes = useStyles();
  const { instances, searchTerm } = props;
  const onNodeToggle = (e, nodeIds) => {
    setNodes(nodeIds);
  };

  const [items, setItems] = React.useState(instances);
  const [nodes, setNodes] = React.useState(["1_1"]);
  function nestedLoop(obj) {
    const res = [];
    function recurse(obj, current) {
      for (const key in obj) {
        let value = obj[key];
        if (value != undefined) {
          if (value && typeof value === "object") {
            recurse(value, key);
          } else if (key === "id") {
            res.push(value);
          }
        }
      }
    }
    recurse(obj);
    return res;
  }
  const searchTree = (element, matchingTitle) => {
    const V = [];
    var res = element.filter(function ssss(o) {
      if (o.text.includes(matchingTitle)) {
        V.push(o.id);
        return true;
      }

      if (o.items) {
        return (o.items = o.items.filter(ssss)).length;
      }
    });
    setNodes(nestedLoop(res));
    return res;
  };

  useEffect(() => {
    setItems(
      searchTerm.length >= 3
        ? searchTree(instances, searchTerm)
        : instances
    );
  }, [searchTerm, instances]);

  const getTreeItemsFromData = (treeItems) => {
    return treeItems.map((treeItemData) => {
      let items = undefined;
      if (treeItemData.items && treeItemData.items.length > 0) {
        items = getTreeItemsFromData(treeItemData.items);
      }
      return (
        <StyledTreeItem
          nodeId={treeItemData?.id}
          labelText={treeItemData?.text}
          labelIcon={DATASET}
          labelInfo="90"
          children={items}
          key={treeItemData.id}
          expand="true"
        />
      );
    });
  };
  const treeRef = React.createRef();

  return (
    <Box className="sidebar-body">
      { instances.length === 0 ? (
      <Typography className='no-instance'>
        No instances to display yet.
      </Typography>
      ) : (
        <TreeView
          className={classes.root}
          defaultExpanded={nodes}
          defaultCollapseIcon={false}
          defaultExpandIcon={false}
          defaultEndIcon={false}
          ref={treeRef}
          expanded={nodes}
          onNodeToggle={onNodeToggle}
        >
          {getTreeItemsFromData(items)}
        </TreeView>
      )}
    </Box>
  );
};
export default InstancesTreeView;
