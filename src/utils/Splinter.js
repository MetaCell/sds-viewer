const N3 = require('n3');

class Splinter {
    constructor(jsonFile, turtleFile) {
        this.jsonFile = jsonFile;
        this.turtleFile = turtleFile;
        this.jsonData = this.setJson();
        this.turtleData = this.setTurtle();
    }

    setJson() {
        if (typeof this.jsonFile === 'object' && this.jsonFile !== null) {
            return this.jsonFile;
        } else {
            return JSON.parse(this.jsonFile);
        }
        
    }

    setTurtle() {
        const parser = new N3.Parser();
        return parser.parse(this.turtleFile);
    }

    create_graph() {
        console.log("##### This is the json dataset ####" + this.jsonData);
        console.log("\n\n\n");
        console.log("##### This is the turtle data  #####"+ this.turtleData);
        console.log("\n\n\n");
    }
}

module.exports = Splinter