import { rdfTypes } from '../../utils/graphModel';
import NodeHeader from "./Headers/Header";
import FileHeader from './Headers/FileHeader';
import PersonHeader from './Headers/PersonHeader';
import DatasetHeader from './Headers/DatasetHeader';
import ProtocolHeader from './Headers/ProtocolHeader';
import CollectionHeader from "./Headers/CollectionHeader";
import Details from './Details/Details';
import FileDetails from './Details/FileDetails';
import PersonDetails from './Details/PersonDetails';
import SampleDetails from './Details/SampleDetails';
import DatasetDetails from './Details/DatasetDetails';
import SubjectDetails from './Details/SubjectDetails';
import ProtocolDetails from './Details/ProtocolDetails';
import PerformanceDetails from './Details/PerformanceDetails';
import GroupDetails from './Details/GroupDetails';
import CollectionDetails from './Details/CollectionDetails'
import Settings from "./settings/Settings"
var DetailsFactory = function () {
    this.createDetails = function (node) {
        let details = null;
        let type = undefined;
        if (node.graph_node !== undefined && node.graph_node !== null) {
            type = node.graph_node.type;
        } else {
            type = node.tree_node.type;
        }
        switch(type) {
            case rdfTypes.Collection.key:
                details = new Collection(node);
                break;
            case rdfTypes.Group.key:
                details = new Group(node);
                break;
            case rdfTypes.Dataset.key:
                details = new Dataset(node);
                break;
            case rdfTypes.Protocol.key:
                details = new Protocol(node);
                break;
            case rdfTypes.Sample.key:
                details = new Sample(node);
                break;
            case rdfTypes.Subject.key:
                details = new Subject(node);
                break;
            case rdfTypes.Performance.key:
                details = new Performance(node);
                break;
            case rdfTypes.File.key:
                details = new File(node);
                break;
            case rdfTypes.Person.key:
                details = new Person(node);
                break;
            default:
                details = new Unknown(node);
        }

        return details;
    }
}

const Collection = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <CollectionHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <CollectionDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <CollectionHeader node={node} />
                <CollectionDetails node={node} />
            </>
        )
    }

    nodeDetail.getSettings = () => {
        return (
            <>
                <Settings node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Group = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <CollectionHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <GroupDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <CollectionHeader node={node} />
                <GroupDetails node={node} />
            </>
        )
    }
    
    nodeDetail.getSettings = () => {
        return (
            <>
                <Settings node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Dataset = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <DatasetHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <DatasetDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <DatasetHeader node={node} />
                <DatasetDetails node={node} />
            </>
        )
    }

    nodeDetail.getSettings = () => {
        return (
            <>
                <Settings node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Protocol = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <ProtocolHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <ProtocolDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <ProtocolHeader node={node} />
                <ProtocolDetails node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Sample = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <CollectionHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <SampleDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <CollectionHeader node={node} />
                <SampleDetails node={node} />
            </>
        )
    }

    nodeDetail.getSettings = () => {
        return (
            <>
                <Settings node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Subject = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <CollectionHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <SubjectDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <CollectionHeader node={node} />
                <SubjectDetails node={node} />
            </>
        )
    }

    nodeDetail.getSettings = () => {
        return (
            <>
                <Settings node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Performance = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <CollectionHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <PerformanceDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <CollectionHeader node={node} />
                <PerformanceDetails node={node} />
            </>
        )
    }

    nodeDetail.getSettings = () => {
        return (
            <>
                <Settings node={node} />
            </>
        )
    }
    return nodeDetail;
};

const File = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <FileHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <FileDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <FileHeader node={node} />
                <FileDetails node={node} />
            </>
        )
    }

    nodeDetail.getSettings = () => {
        return (
            <>
                <Settings node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Person = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <PersonHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <PersonDetails node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <PersonHeader node={node} />
                <PersonDetails node={node} />
            </>
        )
    }
    return nodeDetail;
};

const Unknown = function (node) {
    const nodeDetail = {
        node: node
    };
    nodeDetail.getHeader = () => {
        return (
            <>
                <NodeHeader node={node} />
            </>
        )
    };

    nodeDetail.getDetail = () => {
        return (
            <>
                <Details node={node} />
            </>
        )
    };

    nodeDetail.getAll = () => {
        return (
            <>
                <NodeHeader node={node} />
                <Details node={node} />
            </>
        )
    }
    return nodeDetail;
};

export default DetailsFactory;
