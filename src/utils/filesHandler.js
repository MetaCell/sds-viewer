const axios = require('axios');

class FileHandler {

    get_local_file(path, callback) {
        if (path === undefined)
            return undefined;
        const reader = new FileReader();

        reader.onload = function(response) {
            callback(response.target.result)
        };

        reader.readAsText(path);
    }

    get_remote_file(url, callback) {
        // The proxy is required for the issue with CORS to be resolved.
        const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
        axios.get(url, {crossDomain: true, responseType: "stream"} )
            .then(response => {
                callback(response.data);
            })
                .catch(error => {
                console.log(error);
                callback(undefined);
            });
    }
}

module.exports = FileHandler