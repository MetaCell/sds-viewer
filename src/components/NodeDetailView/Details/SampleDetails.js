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
import {useDispatch, useSelector} from 'react-redux'
import {useEffect} from "react";
import {updateMetaDataModelDetails} from "../../../redux/actions";


const SampleDetails = (props) => {
    const { node } = props;
    const dispatch = useDispatch();

    const samplePropertiesModel = useSelector(state => state.sdsState.metadata_model.sample);

    useEffect(() => {
        if (samplePropertiesModel) {
            const dataArray = samplePropertiesModel
                ?.filter(property => property.visible)
                .map(property => {
                    const propValue = node.graph_node.attributes[property.property]?.[0];

                    let dataObj = { label: property.label, value: null };

                    if (isValidUrl(propValue)) {
                        dataObj.value = propValue;
                    } else if (typeof propValue === "object") {
                        dataObj.value = node.graph_node.attributes[property.property];
                    } else if (typeof propValue === "string") {
                        dataObj.value = propValue;
                    }

                    return dataObj;
                })
                .filter(obj => obj.value !== null);
            dispatch(updateMetaDataModelDetails('sample', dataArray))
        }
        return () => {
            dispatch(updateMetaDataModelDetails('sample', []))
        }
    }, [samplePropertiesModel])

    return (
        <Box id={node?.graph_node?.attributes.localId + detailsLabel}>
            <Divider />
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
