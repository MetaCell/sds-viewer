import React from "react";
import {
    Box,
    Typography,
    Divider,
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import USER from "../../../images/user.svg";
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';
import { rdfTypes } from "../../../utils/graphModel";
import { isValidUrl } from './utils';
import {DatasetIcon} from "../../../images/Icons";

const DatasetDetails = (props) => {
    const { node } = props;

    let datasetPropertiesModel = [...rdfTypes["Dataset"].properties];

    return (
        
        <Box id={node.graph_node?.id + detailsLabel}>
            <Divider />
            <Box className="tab-content">
                <Box className='title-container'>
                    <DatasetIcon />
                    <Typography component="h3">Dataset Details</Typography>
                </Box>
                {datasetPropertiesModel?.map( property => {
                    if ( property.visible ){
                        const propValue = node.graph_node.attributes[property.property]?.[0];
                        if ( isValidUrl(propValue) ){
                            return (<Box className="tab-content-row">
                                <Typography component="label">{property.label}</Typography>
                                <Links key={`detail_links_dataset`} href={propValue} title={property.label + " Link"} />
                            </Box>)
                        }

                        if ( typeof propValue === "object" ){
                            return (<Box className="tab-content-row">
                                        <Typography component="label">{property.label}</Typography>
                                        <SimpleLinkedChip chips={node.graph_node.attributes[property.property]} />
                                    </Box>)
                        }

                        if ( typeof propValue === "string" ){
                            return (<SimpleLabelValue label={property.label} value={propValue} />)
                        }

                        return (<> </>)
                    }
                })}
            </Box>
        </Box>
    );
};

export default DatasetDetails;
