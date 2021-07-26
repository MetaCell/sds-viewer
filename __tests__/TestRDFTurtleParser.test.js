import axios from "axios";
jest.mock('axios');

const localTurtleFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/N_dataset_29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const localTurtleJSONFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json";
const externalTurtleFileURL = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17:28:22,384227-07:00/datasets/N%3Adataset%3A29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const externalTurtleJSONFileURL = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17%3A28%3A22%2C384227-07%3A00/path-metadata/29df9b97-a20b-469c-bf48-9389f1e31a11/LATEST_RUN/path-metadata.json"
const pathMetadataJSONFileParsed = require('./resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json');

const FileHandler = require('../src/utils/filesHandler');
const Splinter = require('../src/utils/Splinter');
const fileHandler = new FileHandler();

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

  it('Turtle File Parsed Correctly', async () => {
    // TODO : See what the library doing turtle parsing returns to implement this test
    expect(splinter.getTurtle()).toEqual(null);
  });

  it('JSON File Parsed Correctly', async () => {
   expect(splinter.getJson()).toEqual(pathMetadataJSONFileParsed);
  });

  it('Graph Data Structured Correctly', async () => {
    let graph = splinter.create_graph();
    expect(graph).toHaveProperty("nodes");
    expect(graph).toHaveProperty("links");

    graph?.nodes?.forEach( node => {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("type");
      expect(node).toHaveProperty("label");
      expect(node).toHaveProperty("proxies");
    });

    graph?.links?.forEach( link => {
      expect(link).toHaveProperty("startNode");
      expect(link).toHaveProperty("endNode");
    });
  });
});