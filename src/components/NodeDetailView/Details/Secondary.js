import React from "react";
import {
  Box,
  Typography,
} from "@material-ui/core";

import SimpleLabelValue from './Views/SimpleLabelValue';
import Links from './Views/Links';
import Breadcrumbs from './Views/Breadcrumbs';

const links = [
  {
    href: '/',
    title: 'Protocol'
  },
  {
    href: '/',
    title: 'Dataset'
  }
];

const rows = [
  {
    label: 'Remote ID',
    value: 'collection-18d7a413-9803-482d-bace-d74942ac6c6'
  },
  {
    label: 'Mimetype',
    value: 'node/directory'
  },
  {
    label: 'Dataset',
    value: 'dataset:b225faBa-9eb5-4716-839D-Of7facDc2b64'
  },
  {
    label: 'Assigned Group',
    value: 'sub-11232'
  },
  {
    label: 'Derived Information As Participant',
    value: 'PATO:000034'
  },
  {
    label: 'Digital Artifact About',
    value: 'NCBI Taxon:10116'
  }
]

const headerLinks = {
  pages: [
    {
      title: 'derivative',
      href: '/'
    },
    {
      title: 'JSON',
      href: '/'
    },
  ],
  current: 'sub-11232'
};

const SecodaryDetailView = () => {
  return (
    <>
      <Box className="tab-content">
        <Typography component="h3">Node</Typography>
        {
          rows?.map((row, index) => <SimpleLabelValue key={`node_${index}`}label={row?.label} value={row?.value} />)
        }

        <Box className="tab-content-row">
          <Typography component="label">Dataset Path</Typography>
          <Breadcrumbs links={headerLinks} />
        </Box>

        <Box className="tab-content-row">
          <Typography component="label">Links</Typography>
          {
            links?.map((row, index) => <Links key={`links_${index}`} href={row?.href} title={row?.title} />)
          }
        </Box>
      </Box>

      <Box className="tab-content">
        <Typography component="h3">Sample</Typography>
        {
          rows?.map((row, index) => <SimpleLabelValue key={`sample_${index}`} label={row?.label} value={row?.value} />)
        }
      </Box>

      <Box className="tab-content">
        <Typography component="h3">Subject</Typography>
        {
          rows?.map((row, index) => <SimpleLabelValue key={`subject_${index}`} label={row?.label} value={row?.value} />)
        }
      </Box>
    </>
  );
};

export default SecodaryDetailView;
