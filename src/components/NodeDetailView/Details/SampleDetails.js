import React from "react";
import {
    Box,
    Typography,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';
import Links from './Views/Links';
import { iterateSimpleValue } from './utils';
import { detailsLabel } from '../../../constants';

const SampleDetails = (props) => {
    const { node } = props;

    let title = "";
    let idDetails = "";
    // both tree and graph nodes are present, extract data from both
    if (node?.tree_node && node?.graph_node) {
        idDetails = node.tree_node.id + detailsLabel;
        title = node.tree_node.basename;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node?.graph_node) {
        idDetails = node.graph_node.id + detailsLabel;
        title = node.graph_node.attributes?.label ? node.graph_node.attributes?.label[0] : "";
    // the below is the case where we have data only from the graph
    } else {
        idDetails = node.tree_node.id + detailsLabel;
        title = "Undefined Sample name";
    }

    return (
        <Box id={idDetails}>
            <Box className="tab-content">
                { node.graph_node.attributes?.hasUriHuman && node.graph_node.attributes?.hasUriHuman[0] !== ""
                    ? (<Box className="tab-content-row">
                            <Typography component="h3">{"Sample Details"}</Typography>
                            <Typography component="label">Label</Typography>
                        </Box>)
                    : (<SimpleLabelValue label={'Label'} value={title} heading={'Sample Details'} />)
                }

                { iterateSimpleValue('Assigned group', node?.graph_node?.attributes?.hasAssignedGroup) }
                { iterateSimpleValue('Digital artifact', node?.graph_node?.attributes?.hasDigitalArtifactThatIsAboutIt) }
                { iterateSimpleValue('Extracted from Anatomical region', node?.graph_node?.attributes?.wasExtractedFromAnatomicalRegion) }
            </Box>
        </Box>
    );
};

export default SampleDetails;
