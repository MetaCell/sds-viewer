import * as LayoutActions from '@metacell/geppetto-meta-client/common/layout/actions';
import * as Actions from '../redux/actions';

/**
 * Custom middleware, right now the actions below are just an example, this is just a scaffolding for later.
 */
export const sdsMiddleware = store => next => action => {
    switch (action.type) {
        case LayoutActions.layoutActions.REMOVE_WIDGET:
            const id = action.data.id;
            const state = store.getState();
            if (state.sdsState.datasets.includes(id)) {
                store.dispatch(Actions.deleteDataset(id))
            }
            break;
        case LayoutActions.layoutActions.SET_LAYOUT:
            break;
        case Actions.ADD_DATASET:
            break;
        case Actions.DELETE_DATASET:
            break;
        case Actions.SELECT_INSTANCE:
            break;
        default:
            break;
    }

    next(action);
};
