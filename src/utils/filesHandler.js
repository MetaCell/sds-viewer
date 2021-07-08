const axios = require('axios');

class FileHandler {

    get_local_file(path, callback, progressCallback) {
        if (path === undefined)
            return undefined;

        const reader = new FileReader();

        reader.onload = function(response) {
            callback(response.target.result)
        };

        reader.onprogress = function (data) {
            if (data.lengthComputable) {
                var progress = parseInt((data.loaded / data.total) * 100, 10);
                progressCallback(progress);
            }
        };

        reader.readAsText(path);
    }

    get_remote_file(url, callback) {
        axios.get(url, {
            crossDomain: true,
            responseType: "stream",
            onDownloadProgress: (progressEvent) => {
                // Progress callback to be used for the loader.
                console.log("### axios progress event ###");
            }
        }).then(response => {
            callback(response.data);
        }).catch(error => {
            console.log(error);
            callback(undefined);
        });
    }
}

module.exports = FileHandler