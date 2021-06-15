import React, { useState } from 'react';

const N3 = require('n3');
const axios = require('axios');

export default class Splinter extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            turtleFile: undefined
        }

        this.PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
        this.URL = 'https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-04-12T17%3A28%3A22%2C384227-07%3A00/datasets/N%3Adataset%3A29df9b97-a20b-469c-bf48-9389f1e31a11.ttl';
    }

    render() {
        
        axios.get(this.PROXY_URL+this.URL, {responseType: "stream"} )
            .then(response => {
                const parser = new N3.Parser();
                parser.parse(response.data);
                //response.data.pipe(fs.createWriteStream("todays_picture.png"));
            })
                .catch(error => {
                console.log(error);
            });

        return (
            <div>
                Just a quick test with the RDF file
            </div>
        )
    }
}
