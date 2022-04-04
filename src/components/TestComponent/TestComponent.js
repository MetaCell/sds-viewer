import React, { useState } from 'react';
import Splinter from '../../utils/Splinter';
import { FileHandler } from '../../utils/filesHandler';

export default class TestComponent extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            urlJSON: "",
            urlTurtle: "",
            jsonFile: undefined,
            turtleFile: undefined,
        }

        this.splinter = undefined;
        this.fileHandler = new FileHandler();
        this.handleLocalJSON = this.handleLocalJSON.bind(this);
        this.handleLocalTurtle = this.handleLocalTurtle.bind(this);
        this.handleUrlJSONUpdate = this.handleUrlJSONUpdate.bind(this);
        this.handleUrlTurtleUpdate = this.handleUrlTurtleUpdate.bind(this);
        this.handleUrlJSONDownload = this.handleUrlJSONDownload.bind(this);
        this.handleUrlTurtleDownload = this.handleUrlTurtleDownload.bind(this);
    }

    handleLocalJSON(event) {
        var callback = fileData => {
            this.setState({jsonFile: fileData});
        }
        this.fileHandler.get_local_file(event.target.files[0], callback);
    }

    handleLocalTurtle(event) {
        var callback = fileData => {
            this.setState({turtleFile: fileData});
        }
        this.fileHandler.get_local_file(event.target.files[0], callback);
    }

    handleUrlJSONUpdate(event) {
        this.setState({urlJSON: event.target.value});
    }

    handleUrlTurtleUpdate(event) {
        this.setState({urlTurtle: event.target.value});
    }

    handleUrlJSONDownload(event) {
        var callback = fileData => {
            this.setState({jsonFile: fileData});
        }
        this.fileHandler.get_remote_file(this.state.urlJSON, callback, () => {});
    }

    handleUrlTurtleDownload(event) {
        var callback = fileData => {
            this.setState({turtleFile: fileData});
        }
        this.fileHandler.get_remote_file(this.state.urlTurtle, callback, () => {});
    }

    render() {
        // var url = "https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17%3A28%3A22%2C384227-07%3A00/datasets/N%3Adataset%3A29df9b97-a20b-469c-bf48-9389f1e31a11.ttl"
        if (this.state.turtleFile !== undefined && this.state.jsonFile !== undefined && this.splinter === undefined) {
            this.splinter = new Splinter(this.state.jsonFile, this.state.turtleFile);
            this.splinter.processDataset();
            // let _graph = this.splinter.get_graph();
            // let _nodes = this.splinter.get_nodes();
            // let _node = this.splinter.get_node("dataset id");
        }

        return (
            <div>
                <h4> Select a dataset JSON file (from local filesystem or remote using the input / submit) </h4>
                <div>
                    <input type="file" onChange={this.handleLocalJSON} />
                </div>
                <div>
                    <button onClick={this.handleUrlJSONDownload}>Load url</button>
                    <input type="text" value={this.state.jsonFile !== undefined ? "filled" : this.state.urlJSON} onChange={this.handleUrlJSONUpdate} />
                </div>

                <h4> Select a dataset Turtle file (from local filesystem or remote using the input / submit) </h4>
                <div>
                    <input type="file" onChange={this.handleLocalTurtle} />
                </div>
                <div>
                    <button onClick={this.handleUrlTurtleDownload}>Load url</button>
                    <input type="text" value={this.state.turtleFile !== undefined ? "filled" : this.state.urlTurtle} onChange={this.handleUrlTurtleUpdate} />
                </div>
            </div>
        )
    }
}
