import {
    Box,
    Typography,
} from "@material-ui/core";
import SimpleLabelValue from './Views/SimpleLabelValue';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import Links from './Views/Links';
import { detailsLabel } from '../../../constants';
import { rdfTypes } from "../../../utils/graphModel";
import { isValidUrl } from './utils';


const SampleDetails = (props) => {
    const { node } = props;

    let samplePropertiesModel = [...rdfTypes["Sample"].properties];

    return (
        <Box id={node?.graph_node?.attributes.localId + detailsLabel}>
            <Box className="tab-content">
                <SimpleLabelValue label={""} value={""} heading={"Sample Details"} />

                {samplePropertiesModel?.map( property => {
                    if ( property.visible ){
                        const propValue = node.graph_node.attributes[property.property]?.[0];
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

export default SampleDetails;
