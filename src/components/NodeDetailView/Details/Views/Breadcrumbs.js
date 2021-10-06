import React from 'react';
import DIVIDER from "../../../../images/divider.svg";
import CLOSE from "../../../../images/icon-close.svg";
import { useSelector, useDispatch } from 'react-redux'
import { Box, Breadcrumbs, Link, Typography } from '@material-ui/core';
import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";
import * as layoutActions from "@metacell/geppetto-meta-client/common/layout/actions";
import { detailsLabel } from '../../../../constants';

const HeaderBreadcrumbs = (props) => {
  const { links, close } = props;
  const dispatch = useDispatch();
  const goToLink = id => {
    const divElement = document.getElementById(id + detailsLabel);
    divElement.scrollIntoView({ behavior: 'smooth' });
  }

  const closeViewer = () => {
    dispatch(layoutActions.destroyWidget("nodeViewWidget"));
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
      {/* <img src={CLOSE} onClick={closeViewer} alt="Close" /> */}
    </Box>
  );
};

export default HeaderBreadcrumbs;
