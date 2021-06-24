import { parseTurtleFileData, parseJSONData, createGraphNodes, createGraphRelationships, createGraphData } from '../__mocks__/DataParser';
const fs = require('fs');

const localTurtleFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/N_dataset_29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const localTurtleJSONFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json";

const FileHandler = require('../src/utils/filesHandler');
const fileHandler = new FileHandler();
test('Test Downloading External Turtle File', async () => {
  // Test downloading json file to match local file
  //TODO : Replace undefined with call to method
  let url = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17:28:22,384227-07:00/datasets/N%3Adataset%3A29df9b97-a20b-469c-bf48-9389f1e31a11.ttl"
  var callback = fileData => {
    return fileData
  };
  expect(await fileHandler.get_remote_file(url, callback)).toEqual(fs.readFileSync(localTurtleFile));
});

test('Test Downloading External JSON File', async () => {
  // Test downloading json file to match local file
  //TODO : Replace undefined with call to method
  let url = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17%3A28%3A22%2C384227-07%3A00/path-metadata/29df9b97-a20b-469c-bf48-9389f1e31a11/LATEST_RUN/path-metadata.json"
  var callback = fileData => {
    return fileData
  };
  expect(await fileHandler.get_remote_file(url, callback)).toEqual(fs.readFileSync(localTurtleJSONFile));
});

test('Test Parsing Turtle File', async () => {
  //TODO : Replace undefined with call to method
  expect(undefined).toEqual(parseTurtleFileData());
});

test('Test Parsing path-metadata JSON File', async () => {
  //TODO : Replace undefined with call to method
  expect(undefined).toEqual(parseJSONData);
});

test('Test Creating Graph Nodes', async () => {
  //TODO : Replace undefined with call to method
  expect(undefined).toEqual(createGraphNodes());
});

test('Test Creating Graph Relationships', async () => {
  //TODO : Replace undefined with call to method
  expect(undefined).toEqual(createGraphRelationships);
});

test('Test Creating Graph Data', async () => {
  //TODO : Replace undefined with call to method
  expect(undefined).toEqual(createGraphData);
});