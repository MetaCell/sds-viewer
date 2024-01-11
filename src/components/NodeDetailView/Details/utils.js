import SimpleLabelValue from './Views/SimpleLabelValue';

export const iterateSimpleValue = (label, value) => {
    if (value !== undefined) {
        const results = value.map( (item, index) => {
            return (<SimpleLabelValue key={label + "_key_" + index} label={label} value={item} />);
        });
        return results;
    } else {
        return (<> </>);
    }
}

export const simpleValue = (label, value) => {
    if (value !== undefined) {
        return (<SimpleLabelValue key={label} label={label} value={value} />);
    } else {
        return (<> </>);
    }
}

export const isValidUrl = (urlString) => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}