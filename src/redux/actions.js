export const ADD_DATASET = 'ADD_DATASET'
export const DELETE_DATASET = 'DELETE_DATASET'
export const SELECT_INSTANCE = 'SELECT_INSTANCE'
export const TRIGGER_ERROR = 'TRIGGER_ERROR'

export const addDataset = dataset => ({
    type: ADD_DATASET,
    data: { dataset: dataset },
});

export const deleteDataset = dataset_id => ({
    type: DELETE_DATASET,
    data: { dataset_id: dataset_id },
});

export const selectInstance = instance => ({
    type: SELECT_INSTANCE,
    data: {
        graph_node: instance.graph_node,
        tree_node: instance.tree_node
    },
});

export const triggerError = message => ({
    type: TRIGGER_ERROR,
    data: { error_message: message },
});