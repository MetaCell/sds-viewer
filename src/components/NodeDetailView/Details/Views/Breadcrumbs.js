import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@material-ui/core';
import CLOSE from "../../../../images/icon-close.svg";
import DIVIDER from "../../../../images/divider.svg";

const HeaderBreadcrumbs = (props) => {
  const { links, close } = props;
  return (
    <Box className="wrap">
      <Breadcrumbs
        separator={<img src={DIVIDER} alt="DIVIDER" />}
        aria-label="breadcrumb"
      >
        {
          links && links.pages ? (
            links?.pages?.map((page) => (
              <Link color="inherit" href={page?.href}>
                {page?.title}
              </Link>
            ))
          ) : null
        }
        <Typography color="textPrimary">{links?.current}</Typography>
      </Breadcrumbs>
      { close ? <img src={CLOSE} onClick={props.close} alt="Close" /> : null }
    </Box>
  );
};

export default HeaderBreadcrumbs;
