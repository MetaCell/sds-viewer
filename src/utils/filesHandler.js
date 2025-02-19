import axios from 'axios';

export default class FileHandler {
    get_local_file(path, callback, progressCallback) {
        if (path === undefined) return undefined;

        const reader = new FileReader();

        reader.onload = function (response) {
            callback(response.target.result);
        };

        reader.onprogress = function (data) {
            if (data.lengthComputable) {
                const progress = parseInt((data.loaded / data.total) * 100, 10);
                progressCallback(progress);
            }
        };

        reader.readAsText(path);
    }

    get_remote_file(url, callback, errorCallback) {
        axios
            .get(url, {
                crossDomain: true,
                responseType: "text", // Updated for browser compatibility
                onDownloadProgress: (progressEvent) => {
                    // Optionally handle download progress
                },
            })
            .then((response) => {
                callback(url, response.data);
            })
            .catch((error) => {
                console.error("Error fetching remote file:", error);
                if (errorCallback) errorCallback(error);
            });
    }
}
