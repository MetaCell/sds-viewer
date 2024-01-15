import {
    Box,
    Typography
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';
import { useSelector } from 'react-redux'
import { isValidUrl } from './utils';

const FileDetails = (props) => {
    const { node } = props;
    const filePropertiesModel = useSelector(state => state.sdsState.metadata_model.file);

    return (
        <Box className="secondary-sidebar_body" id={node?.graph_node?.attributes.identifier + detailsLabel}>
            <Box className="tab-content">
                <SimpleLabelValue label={""} value={""} heading={"File Details"} />

                {filePropertiesModel?.map( property => {
                    if ( property.visible ){
                        const propValue = node.graph_node.attributes[property.property];
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

                        else if ( typeof propValue === "number" ){
                            return (<SimpleLabelValue label={property.label} value={propValue} />)
                        }

                        return (<> </>)
                    }
                })}
            </Box>
        </Box>
    );
};

export default FileDetails;
