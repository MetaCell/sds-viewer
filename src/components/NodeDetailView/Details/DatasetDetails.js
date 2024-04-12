import {
    Box,
    Typography,
    Divider,
    IconButton
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Links from './Views/Links';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';
import { isValidUrl } from './utils';
import { useSelector } from 'react-redux'
import {DatasetIcon} from "../../../images/Icons";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';

const DatasetDetails = (props) => {
    const { node } = props;
    const datasetPropertiesModel = useSelector(state => state.sdsState.metadata_model.dataset);
    const [copiedDOI, setCopiedDOI] = useState({});

    useEffect( () => {
        let properties = {};
        datasetPropertiesModel?.map( property => {
            if ( property.link ){
                properties[property.label] =false;
            }
        });
        setCopiedDOI(properties)
    }, [] );

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

                        if ( property.link ){
                            const value = node.graph_node.attributes[property.link.property]?.[0];
                            return (<Box className="tab-content-row">
                                <Typography component="label">{property.label}</Typography>
                                <Box className='title-container'>
                                    <Tooltip
                                        open={copiedDOI[property.label]}
                                        title="DOI Copy"
                                    >
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            aria-label="Copy Content"
                                            onClick={() => {
                                                navigator.clipboard.writeText(value);
                                                const newClipboardState = { ...copiedDOI, [property.label] : true};
                                                setCopiedDOI(newClipboardState)
                                            }}>
                                            <FileCopyIcon size="small"/>
                                        </IconButton>
                                    </Tooltip>
                                    <Links key={`detail_links_dataset`} href={value} title={propValue} />
                                </Box>
                            </Box>)
                        }

                        if ( isValidUrl(propValue) ){
                            return (<Box className="tab-content-row">
                                <Typography component="label">{property.label}</Typography>
                                <Links key={`detail_links_dataset`} href={propValue} title={property.label} />
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
