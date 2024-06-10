import {
    Box,
    Divider,
    Typography,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import Links from './Views/Links';
import { detailsLabel } from '../../../constants';
import { isValidUrl } from './utils';
import { useSelector } from 'react-redux'


const CollectionDetails = (props) => {
    const { node } = props;

    const collectionPropertiesModel = useSelector(state => state.sdsState.metadata_model.collection);
    return (
        <Box id={node?.graph_node?.attributes?.localId + detailsLabel}>
            <Divider />
            <Box className="tab-content">
                <SimpleLabelValue label={""} value={""} heading={"Folder Details"} />

                {collectionPropertiesModel?.map( property => {
                    if ( property.visible ){
                        const propValue = node?.tree_node?.[property.property] || node?.graph_node?.attributes?.[property.property];
                        if ( isValidUrl(propValue) ){
                            return (<Box className="tab-content-row">
                                <Typography component="label">{property.label}</Typography>
                                <Links key={`detail_links_dataset`} href={propValue} title={property.label + " Link"} />
                            </Box>)
                        }

                        else if ( typeof propValue === "object" ){
                            return (<Box className="tab-content-row">
                                        <Typography component="label">{property.label}</Typography>
                                        <SimpleLinkedChip chips={node.graph_node.attributes[property.property]} />
                                    </Box>)
                        }

                        else if ( typeof propValue === "string" ){
                            return (<SimpleLabelValue label={property.label} value={propValue} />)
                        }

                        return (<> </>)
                    }
                })}
            </Box>
        </Box>
    );
};

export default CollectionDetails;
