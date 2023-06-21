export const ADD_DATASET = 'ADD_DATASET'
export const DELETE_DATASET = 'DELETE_DATASET'
export const SET_DATASET_LIST = 'SET_DATASET_LIST'
export const SELECT_INSTANCE = 'SELECT_INSTANCE'
export const TRIGGER_ERROR = 'TRIGGER_ERROR'
export const SELECT_GROUP = 'SELECT_GROUP'

export const addDataset = dataset => ({
    type: ADD_DATASET,
    data: { dataset: dataset },
});


export const deleteDataset = dataset_id => ({
    type: DELETE_DATASET,
    data: { dataset_id: dataset_id },
});

export const setDatasetsList = datasets => ({
    type: SET_DATASET_LIST,
    data: { datasets: datasets },
});

export const selectInstance = instance => ({
    type: SELECT_INSTANCE,
    data: {
        dataset_id: instance.dataset_id,
        graph_node: instance.graph_node,
        tree_node: instance.tree_node,
        source: instance.source
    },
});

export const selectGroup = instance => ({
    type: SELECT_GROUP,
    data: {
        dataset_id: instance.dataset_id,
        graph_node: instance.graph_node,
        tree_node: instance.tree_node,
        source: instance.source
    },
});

export const triggerError = message => ({
    type: TRIGGER_ERROR,
    data: { error_message: message },
});