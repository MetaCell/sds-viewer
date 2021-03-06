import SimpleLabelValue from './Views/SimpleLabelValue';

export const iterateSimpleValue = (label, value) => {
    if (value !== undefined) {
        const results = value.map( (item, index) => {
            return (<SimpleLabelValue key={label + "_key_" + index} label={label} value={value} />);
        });
        return results;
    } else {
        return (<> </>);
    }
}
