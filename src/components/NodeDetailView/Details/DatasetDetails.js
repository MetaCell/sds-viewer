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
                // Add title for the group
                position.y += 10; // Adjust spacing as needed
                doc.setFont('helvetica', 'bold'); // Set font weight to bold
                doc.text(groupName, position.x, position.y);
                position.y += 15; // Adjust spacing after title
                doc.setFont('helvetica', 'normal'); // Reset font style to normal
                // Iterate over each item in the group
                groupData.forEach(({ label, value }) => {
                    const text = `${label}: ${Array.isArray(value) ? value.map(item => item.value).join(', ') : value}`;

                    // Check if the text will fit on the current page
                    if (position.y + doc.getTextDimensions(text).h > doc.internal.pageSize.getHeight()) {
                        doc.addPage();
                        position.y = 10; // Reset position to the top of the new page
                    }

                    // Split text if it exceeds the page width
                    const splittedText = doc.splitTextToSize(text, doc.internal.pageSize.getWidth() - 20); // Adjust margin as needed

                    // Add each line of splitted text to the PDF
                    splittedText.forEach((line) => {
                        doc.text(line, position.x, position.y);
                        position.y += 10;
                    });
                    position.y += 2;
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
