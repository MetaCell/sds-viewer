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
import { NODES } from '../../../constants';

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

const about = ["Cardiac", "Electrophysiology", "Patch Clamp", "Cardiac", "Electrophysiology", "Patch Clamp"]


const SubjectDetails = (props) => {
    const { node } = props;

    let title = "";
    // both tree and graph nodes are present, extract data from both
    if (node.tree_node && node.graph_node) {
        title = node.graph_node.name;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node.tree_node) {
        title = node.tree_node.basename;
    // the below is the case where we have data only from the graph
    } else {
        title = node.graph_node.name;
    }

    return (
        <Box className="secondary-sidebar_body">
            <Box className="tab-content">
                <SimpleLabelValue label={'Created On'} value={"February 2, 2021"} heading={'Details'} />

                <Box className="tab-content-row">
                    <Typography component="label">About</Typography>
                    <SimpleChip chips={about} />
                </Box>
                <SimpleLabelValue label={'Subject Name'} value={title} />

                <Box className="tab-content-row">
                    <List component="nav" aria-label="main">
                        {
                            DETAILS_LIST?.map((item, index) => (
                                <ListItemText key={`detail_list_${index}`}>
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
                        LINKS?.map((row, index) => <Links key={`detail_links_${index}`} href={row?.href} title={row?.title} />)
                    }
                </Box>
            </Box>

            <Box className="tab-content">
                <Typography component="h3">Collaborators</Typography>
                <CustomChips members={Team} heading={'Team'} />
                <CustomChips members={Collaborators} heading={'Collaborators'} />
            </Box>
        </Box>
    );
};

export default SubjectDetails;
