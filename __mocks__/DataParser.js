const turtleFileParsed = require('./resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/TurtleFileParsed.json');

export const parseTurtleFileData = async () => {
    //TODO : Add mock data expected from N3 parser 
    return { data : {}};
};

export const parseJSONData = async () => {
    //TODO : Add mock data 
    return Promise.resolve({ data : {} });
};

export const createGraphNodes = async () => {
    //TODO : Add mock data 
    return Promise.resolve({ nodes : [] });
};

export const createGraphRelationships = async () => {
    //TODO : Add mock data 
    return Promise.resolve({ relationships : [] });
};

export const createGraphData = async () => {
    //TODO : Add real graphto test
    return Promise.resolve({ data : { nodes : [], links : [] } });
};