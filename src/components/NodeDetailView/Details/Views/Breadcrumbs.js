import React from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@material-ui/core';
import CLOSE from "../../../../images/icon-close.svg";
import DIVIDER from "../../../../images/divider.svg";

const HeaderBreadcrumbs = (props) => {
  const { links, close } = props;
  const goToLink = id => {
    const divElement = document.getElementById(id + "_details");
    divElement.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <Box className="wrap">
      <Breadcrumbs
        separator={<img src={DIVIDER} alt="DIVIDER" />}
        aria-label="breadcrumb"
      >
        {
          links && links.pages ? (
            links?.pages?.map((page, index) => (
              <Link color="inherit" onClick={() => {goToLink(page.id)}} key={`breadcrumb_${page?.title}_${index}`}>
                {page?.title}
              </Link>
            ))
          ) : null
        }
        <Typography onClick={() => {goToLink(links?.current.id)}} color="textPrimary">{links?.current.text}</Typography>
      </Breadcrumbs>
      { close ? <img src={CLOSE} onClick={props.close} alt="Close" /> : null }
    </Box>
  );
};

export default HeaderBreadcrumbs;
