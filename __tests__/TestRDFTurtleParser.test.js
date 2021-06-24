import { parseTurtleFileData, parseJSONData, createGraphNodes, createGraphRelationships, createGraphData } from '../__mocks__/DataParser';
const fs = require('fs');

const localTurtleFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/N_dataset_29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const localTurtleJSONFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json";

test('Test Downloading External Turtle File', async () => {
  // Test downloading json file to match local file
  //TODO : Replace undefined with call to method
  expect(fs.readFileSync(localTurtleFile)).toEqual(undefined);
});

test('Test Downloading External JSON File', async () => {
  // Test downloading json file to match local file
  //TODO : Replace undefined with call to method 
  expect(undeffs.readFileSync(localTurtleJSONFile)ined).toEqual(undefined);
});

test('Test Parsing Turtle File', async () => {
  //TODO : Replace undefined with call to method
  expect(parseTurtleFileData()).toEqual(undefined);
});

test('Test Parsing path-metadata JSON File', async () => {
  //TODO : Replace undefined with call to method
  expect(parseJSONData).toEqual(undefined);
});

test('Test Creating Graph Nodes', async () => {
  //TODO : Replace undefined with call to method
  expect(createGraphNodes()).toEqual(createGraphNodes());
});

test('Test Creating Graph Relationships', async () => {
  //TODO : Replace undefined with call to method
  expect(createGraphRelationships).toEqual(undefined);
});

test('Test Creating Graph Data', async () => {
  //TODO : Replace undefined with call to method
  expect(createGraphData).toEqual(undefined);
});