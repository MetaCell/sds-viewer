import React from 'react';
import DIVIDER from "../../../../images/divider.svg";
import { Box, Breadcrumbs, Link, Typography } from '@material-ui/core';
import { detailsLabel } from '../../../../constants';
// import * as layoutActions from "@metacell/geppetto-meta-client/common/layout/actions";
// import { useDispatch } from 'react-redux'

const HeaderBreadcrumbs = (props) => {
  const { links } = props;
  const goToLink = id => {
    const divElement = document.getElementById(id + detailsLabel);
    divElement?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <Box className="wrap">
      <Breadcrumbs
        aria-label="breadcrumb"
        maxItems={2}
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
        <Typography
            variant="subtitle2"
            onClick={() => {goToLink(links?.current.id)}}
            className="breadcrumb_selected">{links?.current.text}</Typography>
      </Breadcrumbs>
      {/* <img src={CLOSE} onClick={closeViewer} alt="Close" /> */}
    </Box>
  );
};

export default HeaderBreadcrumbs;
