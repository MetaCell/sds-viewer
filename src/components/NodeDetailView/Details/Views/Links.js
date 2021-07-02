import React from "react";
import {
  Link
} from "@material-ui/core";
import LINKICON from "../../../../images/link.svg";

const DetailLinks = ({href, title}) => {
  return (
    <Link href={href}>
      <img src={LINKICON} alt={title} />
      {title}
    </Link>
  )
}
export default DetailLinks;
