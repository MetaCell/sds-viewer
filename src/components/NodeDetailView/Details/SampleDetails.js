import React from "react";
import {
    Box,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';
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
        title = node.graph_node.attributes?.label[0];
    // the below is the case where we have data only from the graph
    } else {
        idDetails = node.tree_node.id + detailsLabel;
        title = "Undefined Sample name";
    }

    return (
        <Box className="secondary-sidebar_body" id={idDetails}>
            <Box className="tab-content">
                <SimpleLabelValue label={'Label'} value={title} heading={'Sample Details'} />

                { iterateSimpleValue('Assigned group', node?.graph_node?.attributes?.hasAssignedGroup) }
                { iterateSimpleValue('Derived information as participant', node?.graph_node?.attributes?.hasDerivedInformationAsParticipant) }
                { iterateSimpleValue('Digital artifact', node?.graph_node?.attributes?.hasDigitalArtifactThatIsAboutIt) }
                { iterateSimpleValue('Participant in performance of', node?.graph_node?.attributes?.participantInPerformanceOf) }
                { iterateSimpleValue('Derived from subject', node?.graph_node?.attributes?.wasDerivedFromSubject) }
                { iterateSimpleValue('Extracted from Anatomical region', node?.graph_node?.attributes?.wasExtractedFromAnatomicalRegion) }
            </Box>
        </Box>
    );
};

export default SampleDetails;
