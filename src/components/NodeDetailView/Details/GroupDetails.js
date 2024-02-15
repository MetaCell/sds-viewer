import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux'
import {
    Box,
    Divider,
    Typography
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';
import { isValidUrl } from './utils';
import {updateMetaDataModelDetails} from "../../../redux/actions";

const GroupDetails = (props) => {
    const { node } = props;
    const dispatch = useDispatch();

    const groupPropertiesModel = useSelector(state => state.sdsState.metadata_model.group);

    useEffect(() => {
        if (groupPropertiesModel) {
            const dataArray = groupPropertiesModel
                ?.filter(property => property.visible)
                .map((property, index) => {
                    const propValue = node.graph_node[property.property];
                    let dataObj = { label: property.label, value: null };

                    if (isValidUrl(propValue)) {
                        dataObj.value = propValue;
                    } else if (typeof propValue === "object") {
                        dataObj.value = node.graph_node.attributes[property.property];
                    } else if (typeof propValue === "string") {
                        dataObj.value = propValue;
                    }
                    else if ( typeof propValue === "number" ){
                        dataObj.value = propValue;
                    }
                    return dataObj;
                })
                .filter(obj => obj.value !== null);
            dispatch(updateMetaDataModelDetails('group', dataArray, true))
        }
        return () => {
            dispatch(updateMetaDataModelDetails('group', []))
        }
    }, [groupPropertiesModel])

    return (
        <Box className="secondary-sidebar_body" id={node?.graph_node?.id + detailsLabel}>
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
