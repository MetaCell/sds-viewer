import {
    Box,
    Divider,
    Typography,
} from "@material-ui/core";
import SimpleLinkedChip from './Views/SimpleLinkedChip';
import SimpleLabelValue from './Views/SimpleLabelValue';
import Links from './Views/Links';
import { detailsLabel } from '../../../constants';
import { isValidUrl } from './utils';
import { useSelector } from 'react-redux'

const SubjectDetails = (props) => {
    const { node } = props;

    const subjectPropertiesModel = useSelector(state => state.sdsState.metadata_model.subject);

    const getGroupNode = (group, node)=> {
        let n = node.graph_node.parent;
        let match = false;
        while ( n && !match ) {
            if ( n.name === group?.value ) {
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
                        // Skip raw value/unit fields for age and weight
                        if (["ageUnit", "ageValue", "ageBaseUnit", "ageBaseValue", "weightUnit", "weightValue"].includes(property.property)) {
                            return <></>;
                        }

                        let propValue = node.graph_node.attributes[property.property]?.[0];

                        // Combine age or weight values/units when split across attributes
                        if (property.property === "hasAge" && !propValue) {
                            const ageVal = node.graph_node.attributes?.ageValue?.[0];
                            const ageUnit = node.graph_node.attributes?.ageUnit?.[0];
                            if (ageVal !== undefined || ageUnit !== undefined) {
                                propValue = `${ageVal ?? ""} ${ageUnit ?? ""}`.trim();
                            }
                        }

                        if (property.property === "animalSubjectHasWeight" && !propValue) {
                            const weightVal = node.graph_node.attributes?.weightValue?.[0];
                            const weightUnit = node.graph_node.attributes?.weightUnit?.[0];
                            if (weightVal !== undefined || weightUnit !== undefined) {
                                propValue = `${weightVal ?? ""} ${weightUnit ?? ""}`.trim();
                            }
                        }

                        if ( property.isGroup ){
                            const rawValue = node.graph_node.attributes[property.property];
                            const propValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
                            const normalizedArray = Array.isArray(rawValue) ? rawValue : [rawValue];
                            let chipNode = getGroupNode(normalizedArray[0], node)
                            if ( normalizedArray?.length > 0 ) {
                                if ( normalizedArray?.[0]?.link  ) {
                                    normalizedArray[0].link = chipNode?.link
                                }
                            }
                            if ( chipNode !== undefined ){
                                return (
                                    <Box className="tab-content-row">
                                    <Typography component="label">{property.label}</Typography>
                                    <SimpleLinkedChip
                                        chips={[normalizedArray[0]]}
                                        node={chipNode}
                                    />
                                    </Box>
                                );
                            }
                        }

                        else if ( isValidUrl(propValue) ){
                            return (<Box className="tab-content-row">
                                <Typography component="label">{property.label}</Typography>
                                <Links key={`detail_links_dataset`} href={propValue} title={property.label + " Link"} />
                            </Box>)
                        }

                        else if ( typeof propValue === "object" ){
                            if ( isValidUrl(node.graph_node.attributes[property.property]?.[0]?.value) ){
                                return (<Box className="tab-content-row">
                                    <Typography component="label">{property.label}</Typography>
                                    <Links key={`detail_links_dataset`} href={node.graph_node.attributes[property.property]?.[0]?.value} title={property.label + " Link"} />
                                </Box>)
                            }
                            else return (<SimpleLabelValue label={property.label} value={node.graph_node.attributes[property.property]?.[0]?.value} />)
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
