import axios from "axios";
jest.mock('axios');
const FileHandler = require('../src/utils/filesHandler');
const Splinter = require('../src/utils/Splinter');
const fileHandler = new FileHandler();
const fs = require("fs");

const localTurtleFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/N_dataset_29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const localTurtleJSONFile = __dirname + "/resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json";
const externalTurtleFileURL = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17:28:22,384227-07:00/datasets/N%3Adataset%3A29df9b97-a20b-469c-bf48-9389f1e31a11.ttl";
const externalTurtleJSONFileURL = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17%3A28%3A22%2C384227-07%3A00/path-metadata/29df9b97-a20b-469c-bf48-9389f1e31a11/LATEST_RUN/path-metadata.json"
const pathMetadataJSONFileParsed = require('./resources/dataset:29df9b97-a20b-469c-bf48-9389f1e31a11/path-metadata.json');

const EXPECTED_EDGES_COUNT = 18;
const EXPECTED_NODES_COUNT = 541;
const EXPECTED_TURTLE_QUADS = 97;

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
});

describe('Test Splinter File', () => {
  let splinter;
  beforeAll(() => {
    const turtleStream = fs.createReadStream(localTurtleFile);
    splinter =  new Splinter(JSON.stringify(pathMetadataJSONFileParsed), turtleStream);
  });

  it('Process Turtle File', async (done) => {
    try {
      await splinter.extractTurtle();
      expect(splinter.getTurtle().length).toBe(EXPECTED_TURTLE_QUADS)
      done()
    } catch (e) {
      done.fail(e)
    }
  });

  it('Process JSON File', async () => {
    splinter.processJSON();
    expect(splinter.getJson()).toEqual(pathMetadataJSONFileParsed);
  });

  it('Graph Created Correctly', async () => {
    let graph = splinter.create_graph();
    expect(graph.nodes).not.toMatchObject({});
  });

  // Test the nodes for the graph
  it('Graph Nodes Extracted Correctly', async () => {
    const nodes = splinter.nodes;
    expect(nodes).toBe(EXPECTED_NODES_COUNT);

    // The nodes for the graph must each have these properties
    nodes.forEach( node => {
      expect(node).toHaveProperty("id");
      expect(node).toHaveProperty("type");
      expect(node).toHaveProperty("proxies");
      expect(node).toHaveProperty("label");
      expect(node).toHaveProperty("properties");
    });
  });

  // Test the edges for the graph
  it('Graph Edges Extracted Correctly', async () => {
    const edges = splinter.edges;
    //Expected number of edges were created for loaded dataset
    expect(edges.length).toBe(EXPECTED_EDGES_COUNT);

    // The nodes for the graph must each have these properties
    edges.forEach( edge => {
      expect(edge).toHaveProperty("startNode");
      expect(edge).toHaveProperty("endNode");
    });
  });

  /**
   * Tests the graph is populated with nodes and links.
   * The graphRoot elemented tested here is what the geppetto graph library uses.
   **/
  it('Graph Root Nodes and Links Structured Correctly', async () => {
    let graph = splinter.graphRoot;

    /**
     * The graph root must have "nodes" and "links" as arrays, this is expected by the 
     * graphing library.
     **/
    expect(graph).toHaveProperty("nodes");
    expect(Array.isArray(graph.nodes)).toBe(true);
    expect(graph).toHaveProperty("links");
    expect(Array.isArray(graph.links)).toBe(true);

    // The nodes for the graph must each have these properties
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