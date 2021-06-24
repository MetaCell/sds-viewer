import { parseTurtleFileData, parseJSONData, createGraphNodes, createGraphRelationships, createGraphData } from '../__mocks__/DataParser';
const fs = require('fs');

const localTurtleFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/N_dataset_29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const localTurtleJSONFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json";

test('Test Downloading External Turtle File', async () => {
  // Test downloading json file to match local file
  //TODO : Replace undefined with call to method
  expect(undefined).toEqual(fs.readFileSync(localTurtleFile));
});

test('Test Downloading External JSON File', async () => {
  // Test downloading json file to match local file
  //TODO : Replace undefined with call to method 
  expect(undefined).toEqual(fs.readFileSync(localTurtleJSONFile));
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