import { v4 as uuidv4 } from 'uuid';
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
            if (action.data !== undefined) {
                if (window.datasets === undefined) {
                    window.datasets = {};
                }
                const _uuid = uuidv4();
                const splinter = new Splinter(action.data.dataset.json, action.data.dataset.turtle);
                window.datasets[_uuid] = {
                    graph: "test",
                    tree: "test"
                    // graph: splinter.getGraph(),
                    // tree: splinter.getTree()
                }
                return {
                    ...state,
                    datasets: [...state.datasets, _uuid]
                };
            }
            break;
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
