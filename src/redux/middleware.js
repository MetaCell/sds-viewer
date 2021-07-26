import * as GeppettoActions from '@metacell/geppetto-meta-client/common/actions/actions';
import * as Actions from '../redux/actions';

/**
 * Custom middleware, right now the actions below are just an example, this is just a scaffolding for later.
 */
export const sdsMiddleware = store => next => action => {

    switch (action.type) {
        case GeppettoActions.clientActions.MODEL_LOADED:
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