const N3 = require('n3');

class Splinter {
    constructor(jsonFile, turtleFile) {
        this.jsonFile = jsonFile;
        this.turtleFile = turtleFile;
        this.jsonData = this.#setJson();
        this.turtleData = this.#setTurtle();
    }

    #setJson() {
        if (typeof this.jsonFile === 'object' && this.jsonFile !== null) {
            return this.jsonFile;
        } else {
            return JSON.parse(this.jsonFile);
        }
    }

    #setTurtle() {
        const parser = new N3.Parser();
        return parser.parse(this.turtleFile);
    }

    getJson() {
        return this.jsonData;
    }

    getTurtle() {
        return this.turtleData;
    }

    processTurtle() {
        console.log("to be implemented, transform the quads in our internal model for the force-graph component");
    }

    processJSON() {
        console.log("to be implemented, transform the json data in our internal model for the force-graph component");
    }

    mergeData() {
        console.log("to be implemented, merge data between json and turtle to create the graph (not sure is required)");
    }

    create_graph() {
        console.log("##### This is the json dataset ####" + this.jsonData);
        console.log("\n\n\n");
        console.log("##### This is the turtle data  #####"+ this.turtleData);
        console.log("\n\n\n");
    }
}

module.exports = Splinter