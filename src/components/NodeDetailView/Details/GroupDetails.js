import {
    Box,
    Divider,
    Typography
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';
import { useSelector } from 'react-redux'
import { isValidUrl } from './utils';

const GroupDetails = (props) => {
    const { node } = props;
    const groupPropertiesModel = useSelector(state => state.sdsState.metadata_model.group);
    
    return (
        <Box className="secondary-sidebar_body" id={node?.graph_node?.name + detailsLabel}>
            <Divider />
            <Box className="tab-content">
                <SimpleLabelValue label={""} value={""} heading={"Group Details"} />

                {groupPropertiesModel?.map( property => {
                    if ( property.visible ){
                        const propValue = node.graph_node[property.property];
                        if ( isValidUrl(propValue) ){
                            return (<Box className="tab-content-row">
                                <Typography component="label">{property.label}</Typography>
                                <Links key={`detail_links_dataset`} href={propValue} title={property.label + " Link"} />
                            </Box>)
                        }

                        else if ( typeof propValue === "object" ){
                            return (<Box className="tab-content-row">
                                        <Typography component="label">{property.label}</Typography>
                                        <SimpleLinkedChip chips={node.graph_node[property.property]} />
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

export default GroupDetails;
