export const fetchHeaders = async (url) => {
    try {
      const response = await fetch(url, {
        method: 'HEAD', // Use HEAD method to fetch headers only
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const headersObj = {};
      response.headers.forEach((value, key) => {
        headersObj[key] = value;
      });

      return headersObj?.["last-modified"];
    } catch (err) {
      console.log("Error retrieving headers " , err)
    }
  };