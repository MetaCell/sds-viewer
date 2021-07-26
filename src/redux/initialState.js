import Splinter from '../utils/Splinter';
import * as Actions from './actions';

export const sdsInitialState = {
    "sdsState": {
        datasets: [],
        error_message: null,
        instance_selected: undefined
    }
};


export default function sdsClientReducer(state = {}, action) {
    switch (action.type) {
        case Actions.SELECT_INSTANCE:
            if (action.data !== undefined) {
                return {
                    ...state,
                    instance_selected: action.data
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
                return {
                    ...state,
                    datasets: [...state.datasets, action.data.dataset.id]
                };
            } else {
                return state;
            }
        case Actions.DELETE_DATASET:
            if (action.data !== undefined) {
                delete window[action.data.id];
                const index = state.datasets.indexOf(action.data.id);
                return {
                    ...state,
                    datasets: [...state.datasets.slice(0, index),
                    ...state.datasets.slice(index + 1)]
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
