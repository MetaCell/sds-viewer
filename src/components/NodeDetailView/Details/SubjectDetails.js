import {
    Box,
    Divider,
    Typography,
} from "@material-ui/core";
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import Links from './Views/Links';
import {  simpleValue } from './utils';
import { detailsLabel } from '../../../constants';
import { rdfTypes } from "../../../utils/graphModel";
import { isValidUrl } from './utils';
import { useSelector } from 'react-redux'

const SubjectDetails = (props) => {
    const { node } = props;

    const subjectPropertiesModel = useSelector(state => state.sdsState.metadata_model.subject);

    const getGroupNode = (groupName, node)=> {
        let n = node.graph_node.parent;
        let match = false;
        while ( n && !match ) {
            if ( n.name === groupName ) {
              match = true;
            } else {
              n = n.parent;
            }
        }

        return n;
    }

    return (
        <Box id={node?.graph_node?.id + detailsLabel}>
            <Divider />
            <Box className="tab-content">
                <SimpleLabelValue label={""} value={""} heading={"Subject Details"} />

                {subjectPropertiesModel?.map( property => {
                    if ( property.visible ){
                        const propValue = node.graph_node.attributes[property.property]?.[0];
                        if ( property.isGroup ){
                            return (<Box className="tab-content-row">
                                        <Typography component="label">{property.label}</Typography>
                                        <SimpleLinkedChip chips={[{ value : node.graph_node.attributes[property.property]}]} node={getGroupNode(node.graph_node.attributes[property.property]?.[0], node)} />
                                    </Box>)
                        }

                        else if ( isValidUrl(propValue) ){
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

export default SubjectDetails;
