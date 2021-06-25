import { parseTurtleFileData, parseJSONData, mergedData, createGraphData } from '../__mocks__/DataParser';
import axios from "axios";
jest.mock('axios');

const localTurtleFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/N_dataset_29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const localTurtleJSONFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json";
const externalTurtleFileURL = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17:28:22,384227-07:00/datasets/N%3Adataset%3A29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const externalTurtleJSONFileURL = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17%3A28%3A22%2C384227-07%3A00/path-metadata/29df9b97-a20b-469c-bf48-9389f1e31a11/LATEST_RUN/path-metadata.json"
const pathMetadataJSONFileParsed = require('./resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json');

const FileHandler = require('../src/utils/filesHandler');
const fileHandler = new FileHandler();

const Splinter = require('../src/utils/Splinter');

beforeEach(() => {
  jest.clearAllMocks();
});

test('Test Downloading External Turtle File', async (done) => {
  axios.get.mockResolvedValue();
  
  // Tests GET method of axios was execeuted
  var callback = fileData => {
    expect(axios.get).toHaveBeenCalledTimes(1);
    done();
  };
  fileHandler.get_remote_file(externalTurtleFileURL, callback);
});

test('Test Downloading External JSON File', async (done) => {
  axios.get.mockResolvedValue();
  
  var callback = fileData => {
    expect(axios.get).toHaveBeenCalledTimes(1);
    done();
  };
  fileHandler.get_remote_file(externalTurtleJSONFileURL, callback);
});

test('Test Loading Local Turtle File', async (done) => {
  // Spy on FileReader
  const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');

  var callback = fileData => {
    expect(readAsTextSpy).toBeCalledWith(new Blob());
    done();
  };

  fileHandler.get_local_file(new Blob(), callback);
});

test('Test Loading Local JSON File', async (done) => {
  // Spy on FileReader
  const readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');

  var callback = fileData => {
    expect(readAsTextSpy).toBeCalledWith(new Blob());
    done();
  };
  fileHandler.get_local_file(new Blob(), callback);
});

describe('Test Splinter File', () => {
  let splinter;
  beforeEach(() => {
    splinter =  new Splinter(JSON.stringify(pathMetadataJSONFileParsed), null);
  });

  it('Test Parsing Turtle File', async () => {
    expect(splinter.getTurtle()).toEqual(parseTurtleFileData());
  });

  it('Test Parsing path-metadata JSON File', async () => {
   expect(splinter.getJson()).toEqual(parseJSONData());
  });

  it('Test Merge Data', async () => {
   expect(splinter.mergeData()).toEqual(mergedData());
  });

  it('Test Creating Graph Data', async () => {
    expect(splinter.create_graph()).toEqual(createGraphData());
  });
});