import React from "react";
import {
  Box,
  Chip
} from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { selectGroup } from '../../../../redux/actions';
import { GRAPH_SOURCE } from '../../../../constants';


const SimpleChip = ({chips, node}) => {
  const dispatch = useDispatch();

  const handleClick = (item, node) => {
    if ( item.link ){
      window.open(item.link, '_blank')
    } else if ( item.value ) {
      let urlCheck = new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?");
      if(urlCheck.test(item.value)) {
        window.open(item.value, '_blank')
      } else {
        if ( node ) {
          dispatch(selectGroup({
            dataset_id: node.dataset_id,
            graph_node: node?.id,
            tree_node: node?.tree_reference?.id,
            source: GRAPH_SOURCE
          }));
        }
      }
    }
  }

  return (
    <Box className="chip-overflow noscrollbar">
      { chips?.map((item, index) => ( node === undefined
        ? item.link ? 
        (<Chip label={item?.value} onClick={() => handleClick(item, null)}/>)
        : (<Chip label={item?.value} />)
        : (<Chip label={item?.value} onClick={() => handleClick(item, node)}/>)))
      }
    </Box>
  )
}
export default SimpleChip;
