import React, {useEffect} from "react";
import {
    Box,
    Typography,
    Divider, Button,
} from "@material-ui/core";
import Links from './Views/Links';
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import { detailsLabel } from '../../../constants';
import { isValidUrl } from './utils';
import {useDispatch, useSelector} from 'react-redux'
import {DatasetIcon} from "../../../images/Icons";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {updateMetaDataModelDetails} from "../../../redux/actions";
function linkify(text) {
    const linkRegex = /(http[s]?:\/\/[^\s]+)/gi;

    return text.replace(linkRegex, url => `${url}`);
}
const DatasetDetails = (props) => {
    const { node } = props;
    const dispatch = useDispatch();

    const datasetPropertiesModel = useSelector(state => state.sdsState.metadata_model.dataset);
    const propertiesModelDetails = useSelector(state => state.sdsState.metadata_model_details);
    const exportToPDF = () => {
        const doc = new jsPDF();
        let position = {
            x: 10,
            y: 10
        };

        setReportHeader(doc, 'Details', position, null, false);

        Object.entries(propertiesModelDetails).forEach(([groupName, groupData]) => {
            if (groupData.length > 0) {
                position.y += 10;
                doc.text(groupName.charAt(0).toUpperCase() + groupName.slice(1) + ' Details', position.x, position.y);
                position.y += 15;
                doc.setFontSize(12);

                groupData.forEach(({ label, value }) => {
                    const text = `${label}:\n${Array.isArray(value) ? value.map(item => item.value).join(', ') : value}`;

                    const textHeight = doc.getTextDimensions(text).h;
                    if (position.y + textHeight > doc.internal.pageSize.getHeight()) {
                        doc.addPage();
                        position.y = 15;
                    }

                    const splittedText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 20);
                    splittedText.forEach((line) => {
                        doc.text(line, position.x, position.y);
                        position.y += 10;
                    });

                    position.y += 10;
                });
            }
        });

        doc.save('details.pdf');
    };
    const setReportHeader = (doc, title, position, assessment, isAssessment) => {
        const xCentered = (doc.internal.pageSize.getWidth() / 2) - (doc.getStringUnitWidth(title) * doc.internal.getFontSize() / 2);
        doc.text(title, xCentered, position.y, { align: 'center' });
        position.y += 20;
    };

    useEffect(() => {
        if (datasetPropertiesModel) {
            const dataArray = datasetPropertiesModel
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
            dispatch(updateMetaDataModelDetails('dataset', dataArray))
        }   return () => {
            dispatch(updateMetaDataModelDetails('dataset', []))
        }
    }, [datasetPropertiesModel])

    return (
        
        <Box id={node.graph_node?.id + detailsLabel}>
            <Divider />
            <Box className="tab-content">
                <Box className='title-container' sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <DatasetIcon />
                        <Typography component="h3">Dataset Details</Typography>
                    </Box>
                    <Button className="containedSecondary" disableElevation onClick={exportToPDF}>Export PDF</Button>
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
