import {
    Box,
    Divider,
    Typography,
} from "@material-ui/core";
import Links from './Views/Links';
import { detailsLabel } from '../../../constants';

const PersonDetails = (props) => {
    const { node } = props;

    let title = "";
    let idDetails = "";
    // both tree and graph nodes are present, extract data from both
    if (node?.tree_node && node?.graph_node) {
        title = node.graph_node.name;
        idDetails = node.graph_node.id + detailsLabel;
    // the below is the case where we have data only from the tree/hierarchy
    } else if (node?.tree_node) {
        title = node.tree_node.basename;
        idDetails = node.tree_node.id + detailsLabel;
    // the below is the case where we have data only from the graph
    } else {
        title = node.graph_node.name;
        idDetails = node.graph_node.id + detailsLabel;
    }

    return (
        <Box id={idDetails}>
            <Divider />
            <Box className="tab-content">
                <Typography component="h3">Person Details</Typography>
                <Box className="tab-content-row">
                    <Typography component="label">Name</Typography>
                    <Links key={`name_href_link`} href={node.graph_node?.id} title={title.toString()} />
                    {/* <SimpleLabelValue label={'Name'} value={title.toString()} heading={'Contributor Details'} /> */}
                </Box>
            </Box>
        </Box>
    );
};

export default PersonDetails;
