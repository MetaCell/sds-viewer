// import clsx from 'clsx';
// import React from "react";
// import PropTypes from "prop-types";
// import { Typography, Box } from "@material-ui/core";
// import TreeItem, { useTreeItem }  from "@material-ui/lab/TreeItem";
// import DOWN from "../../../images/tree/down.svg";

// const CustomContent = React.forwardRef(function CustomContent(props, ref) {
//   const {
//     classes,
//     className,
//     nodeId,
//     iconClass,
//     labelText,
//     labelInfo
//   } = props;

//   const {
//     disabled,
//     expanded,
//     selected,
//     focused,
//     handleExpansion,
//     handleSelection,
//     preventSelection,
//   } = useTreeItem(nodeId);

//   const handleMouseDown = (event) => {
//     preventSelection(event);
//   };

//   const handleExpansionClick = (event) => {
//     handleExpansion(event);
//   };

//   const handleSelectionClick = (event) => {
//     handleSelection(event);
//   };

//   return (
//     // eslint-disable-next-line jsx-a11y/no-static-element-interactions
//     <div
//       className={clsx(className, 'labelRoot', iconClass, classes.root, {
//         [classes.expanded]: expanded,
//         [classes.selected]: selected,
//         [classes.focused]: focused,
//         [classes.disabled]: disabled,
//       })}
//       onMouseDown={handleMouseDown}
//       ref={ref}
//     >
//       {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
//       <Box className="labelIcon"></Box>
//       <Typography onClick={handleSelectionClick} variant="body2" className="labelText">
//         {labelText}
//       </Typography>
//       {labelInfo > 0 ? (
//         <Typography
//           onClick={handleExpansionClick}
//           variant="caption"
//           className="labelCaption"
//           color="inherit"
//         >
//           {labelInfo}
//           <img src={DOWN} alt="down" />
//         </Typography>
//       ) : null}
//     </div>
//   );
// });

// const StyledTreeItem = (props) => {
//   return (
//     <TreeItem data={props?.dataset} ContentComponent={CustomContent} {...props} />
//   );
// };

// StyledTreeItem.propTypes = {
//   labelIcon: PropTypes.elementType.isRequired,
//   labelInfo: PropTypes.number,
//   labelText: PropTypes.string.isRequired,
//   iconClass: PropTypes.string.isRequired,
// };

// export default StyledTreeItem;
