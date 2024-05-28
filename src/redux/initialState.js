import * as Actions from './actions';
import * as LayoutActions from '@metacell/geppetto-meta-client/common/layout/actions';
import { rdfTypes } from "../utils/graphModel";
import {TOGGLE_METADATA_ITEM_VISIBILITY, UPDATE_METADATA_ITEMS_ORDER} from "./actions";

const savedMetadataModel = localStorage.getItem("metadata_model");
const initialMetadataModel = savedMetadataModel ? JSON.parse(savedMetadataModel) : {
    dataset: [...rdfTypes.Dataset.properties],
    subject: [...rdfTypes.Subject.properties],
    sample: [...rdfTypes.Sample.properties],
    collection : [...rdfTypes.Collection.properties],
    group: [...rdfTypes.Group.properties],
    file: [...rdfTypes.File.properties]
};
export const sdsInitialState = {
    "sdsState": {
        datasets: [],
        available_datasets : [],
        all_tree: [],
        error_message: null,
        instance_selected: {
            dataset_id: null,
            graph_node: null,
            tree_node: null,
            source: ""
        },
        group_selected: {
            dataset_id: null,
            graph_node: null,
            tree_node: null,
            source: ""
        },
        layout : {},
        settings_panel_visible : false,
        metadata_model : initialMetadataModel
    }
};


export default function sdsClientReducer(state = {}, action) {
    switch (action.type) {
        case Actions.SELECT_GROUP:
            if (action.data !== undefined) {
                const splinter = window.datasets[action.data.dataset_id].splinter;
                const graph_node = splinter.nodes.get(action.data.graph_node);
                const tree_node = splinter.tree_map.get(action.data.tree_node);
                return {
                    ...state,
                    group_selected: {
                        dataset_id: action.data.dataset_id,
                        graph_node: graph_node ? graph_node : null,
                        tree_node: tree_node ? tree_node : null,
                        source: action.data.source
                    }
                };
            }
            break;
        case Actions.SELECT_INSTANCE:
            if (action.data !== undefined) {
                const splinter = window.datasets[action.data.dataset_id].splinter;
                const graph_node = splinter.nodes.get(action.data.graph_node);
                const tree_node = splinter.tree_map.get(action.data.tree_node);
                return {
                    ...state,
                    instance_selected: {
                        dataset_id: action.data.dataset_id,
                        graph_node: graph_node ? graph_node : null,
                        tree_node: tree_node ? tree_node : null,
                        source: action.data.source
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
                return {
                    ...state,
                    datasets: ids,
                    instance_selected: {
                        dataset_id: action.data.dataset.id,
                        graph_node: action.data.dataset.graph.nodes[0],
                        tree_node: action.data.dataset.graph.nodes[0].tree_reference,
                    }
                };
            } else {
                return state;
            }
            case Actions.SET_DATASET_LIST:
                return {
                    ...state,
                    available_datasets: action.data.datasets
                };
        case Actions.DELETE_DATASET:
            if (action.data !== undefined) {
                delete window.datasets[action.data.dataset_id];
                const index = state.datasets.indexOf(action.data.dataset_id);
                const ids = [...state.datasets.slice(0, index), ...state.datasets.slice(index + 1)]
                return {
                    ...state,
                    datasets: ids,
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
        case TOGGLE_METADATA_ITEM_VISIBILITY:
            const { groupTitle, itemId } = action.data;
            const updatedMetadataModel = { ...state.metadata_model };
            const groupIndex = updatedMetadataModel[groupTitle].findIndex(item => item.key === itemId);

            if (groupIndex !== -1) {
                const itemToToggle = updatedMetadataModel[groupTitle][groupIndex];
                itemToToggle.visible = !itemToToggle.visible;

                // Toggle visibility first, then reorder items
                updatedMetadataModel[groupTitle].sort((a, b) => {
                    if (a.visible === b.visible) {
                        // Preserve the original order for items with the same visibility
                        return updatedMetadataModel[groupTitle].indexOf(a) - updatedMetadataModel[groupTitle].indexOf(b);
                    }
                });
            }
            localStorage.setItem("metadata_model", JSON.stringify(updatedMetadataModel));

            return {
                ...state,
                metadata_model: { ...updatedMetadataModel }
            };
        case UPDATE_METADATA_ITEMS_ORDER:
            const {  title, newItemsOrder } = action.payload;
            const updatedMetadataModelOrder = {
                ...state.metadata_model,
                [title]: newItemsOrder,
            };
            localStorage.setItem("metadata_model", JSON.stringify(updatedMetadataModelOrder));
            return {
                ...state,
                metadata_model: updatedMetadataModelOrder,
            };
        case LayoutActions.layoutActions.SET_LAYOUT:
            return { ...state, layout : action.data.layout};
        case Actions.TOGGLE_METADATA_SETTINGS:
            return { ...state, settings_panel_visible : action.data.visible};
        default:
            return state;
    }
}
