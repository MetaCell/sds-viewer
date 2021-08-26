import * as Actions from './actions';

export const sdsInitialState = {
    "sdsState": {
        datasets: [],
        all_tree: [],
        error_message: null,
        instance_selected: {
            graph_node: null,
            tree_node: null
        }
    }
};


export default function sdsClientReducer(state = {}, action) {
    switch (action.type) {
        case Actions.SELECT_INSTANCE:
            if (action.data !== undefined) {
                return {
                    ...state,
                    instance_selected: {
                        graph_node: action.data.graph_node,
                        tree_node: action.data.tree_node
                    }
                };
            }
            break;
        case Actions.ADD_DATASET:
            if (action.data !== undefined && !state.datasets.includes(action.data.dataset.id)) {
                if (window.datasets === undefined) {
                    window.datasets = {};
                }
                window.datasets[action.data.dataset.id] = {
                    graph: action.data.dataset.graph,
                    tree: action.data.dataset.tree,
                    splinter: action.data.dataset.splinter
                };
                const ids = [...state.datasets, action.data.dataset.id]
                const _trees = ids.map(item => {
                    return window.datasets[item].tree
                });
                return {
                    ...state,
                    all_tree: _trees,
                    datasets: ids
                };
            } else {
                return state;
            }
        case Actions.DELETE_DATASET:
            if (action.data !== undefined) {
                delete window[action.data.id];
                const ids = [...state.datasets.slice(0, index), ...state.datasets.slice(index + 1)]
                const index = state.datasets.indexOf(action.data.id);
                const _trees = ids.map(item => {
                    return window.datasets[item].tree
                });
                return {
                    ...state,
                    datasets: ids,
                    all_tree: _trees,
                };
            }
            break;
        case Actions.TRIGGER_ERROR:
            if (action.data.error_message !== undefined) {
                return {
                    ...state,
                    error_message: action.data.error_message
                };
            }
            break;
        default:
            return state;
    }
}
