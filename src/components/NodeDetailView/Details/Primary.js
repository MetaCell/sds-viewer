import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemText,
} from "@material-ui/core";
import USER from "../../../images/user.svg";
import Links from './Views/Links';
import SimpleLabelValue from './Views/SimpleLabelValue';
import CustomChips from './Views/CustomChips';
import SimpleChip from './Views/SimpleChip';

const Team = [
  {
    name: 'Mrrc Doyle',
    designation: 'Contact Person',
    img: USER
  },
  {
    name: 'Michael Anderson',
    designation: 'Principal Investigator',
    img: USER
  },
  {
    name: 'Donald Trump',
    designation: 'Chief Technician',
    img: USER
  }
]

const Collaborators = [
  {
    name: 'Mrrc Doyle',
    designation: 'Contact Person',
  },
  {
    name: 'Michael Anderson',
    designation: 'Principal Investigator',
  },
  {
    name: 'Donald Trump',
    designation: 'Chief Technician',
  }
]

const LINKS = [
  {
    title: 'Protocol',
    href: '/'
  },
  {
    title: 'Dataset',
    href: '/'
  }
]

const DETAILS_LIST = [
  {
    title: 'Error Index',
    value: 335
  },
  {
    title: 'Template Schema Version',
    value: '1.2.3'
  },
  {
    title: 'Award Number',
    value: 'OT2OD023848'
  }

];

const about = ["Cardiac", "Electrophysiology", "Patch Clamp", "Cardiac", "Electrophysiology", "Patch Clamp" ]

const PrimaryDetailView = () => {
  return (
    <>
      <Box className="tab-content">
        <Typography component="h3">Details</Typography>
        <SimpleLabelValue label={'Created On'} value={"February 2, 2021"} />

        <Box className="tab-content-row">
          <Typography component="label">About</Typography>
          <SimpleChip chips={about}/>
        </Box>
        <SimpleLabelValue label={'Label'} value={"Stellate neurons passive active and synaptic evoked membrane properties (1)-mouse"} />
        
        <Box className="tab-content-row">
          <List component="nav" aria-label="main">
            {
              DETAILS_LIST?.map((item) => (
                <ListItemText>
                  <Typography component="label">{item?.title}</Typography>
                  <Typography>{item?.value}</Typography>
                </ListItemText>
              ))
            }
          </List>
        </Box>

        <Box className="tab-content-row">
          <Typography component="label">Links</Typography>
          {
            LINKS?.map((row) => <Links href={row?.href} title={row?.title} />)
          }
        </Box>
      </Box>

      <Box className="tab-content">
        <Typography component="h3">Collaborators</Typography>
        <CustomChips members={Team} heading={'Team'} />
        <CustomChips members={Collaborators} heading={'Collaborators'} />
      </Box>
    </>
  );
};

export default PrimaryDetailView;
