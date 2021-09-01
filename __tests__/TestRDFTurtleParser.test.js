import axios from "axios";
import Splinter from '../src/utils/Splinter';

jest.mock('axios');
const FileHandler = require('../src/utils/filesHandler');
const fileHandler = new FileHandler();
const fs = require("fs");

const config = require("./resources/config.json");

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Test File Handler', () => {
  test('Test Downloading External Turtle File', async (done) => {
    axios.get.mockResolvedValue();
    
    // Tests GET method of axios was execeuted
    var callback = fileData => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      done();
    };
    fileHandler.get_remote_file(config.externalDatasets.Dataset1.turtleFile, callback);
  });

  test('Test Downloading External JSON File', async (done) => {
    axios.get.mockResolvedValue();
    
    var callback = fileData => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      done();
    };
    fileHandler.get_remote_file(config.externalDatasets.Dataset1.jsonFile, callback);
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
});

const testDataset = (dataset)=> describe('Test Dataset ' + dataset.name + ' Processing', () => {
  let splinter;
  let graph;
  beforeAll(async() => {
    const turtleStream = fs.createReadStream(__dirname + dataset.turtleFile);
    const pathMetadataJSONFileParsed = require(__dirname + dataset.jsonFile);
    splinter =  new Splinter(JSON.stringify(pathMetadataJSONFileParsed), turtleStream);
  });

  // Test the edges for the graph
  it('Test Graph Creation from Dataset', async () => {
    graph = await splinter.getGraph();
    expect(graph).toHaveProperty("nodes");
    expect(graph).toHaveProperty("links");
  });

  // Test the edges for the graph
  it('Graph Edges Extracted Correctly', async () => {
    // The links for the graph must each have these properties
    graph.links.forEach( edge => {
      expect(edge).toHaveProperty("source");
      expect(edge).toHaveProperty("target");
    });

    //Expected number of edges were created for loaded dataset
    expect(graph.links.length).toBe(dataset.expectedLinks);
  });

  /**
   * Tests the graph is populated with nodes and links.
   * The graphRoot elemented tested here is what the geppetto graph library uses.
   **/
  it('Graph Root Nodes Structured Correctly', async () => {
    /**
     * The graph root must have "nodes" and "links" as arrays, this is expected by the 
     * graphing library.
     **/
    expect(Array.isArray(graph.nodes)).toBe(true);

    // The nodes for the graph must each have these properties
    graph?.nodes?.forEach( node => {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("type");
      expect(node).toHaveProperty("name");
      expect(node).toHaveProperty("proxies");
      expect(node).toHaveProperty("level");
      expect(node).toHaveProperty("types");
      expect(node).toHaveProperty("properties");
      expect(node).toHaveProperty("tree_reference");
    });
    
    //Expected number of edges were created for loaded dataset
    expect(graph.nodes.length).toBe(dataset.expectedNodes);
  });
});

describe('Test Splinter : Dataset to Graph Processing ', () => {
  Object.keys(config.localDatasets).map( (key) => { 
    return testDataset(config.localDatasets[key])
  });
});