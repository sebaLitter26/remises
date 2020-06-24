import { Movil } from '../../models/index.models';
import * as fromMoviles from '../actions';

export interface MovilState {
    moviles: Movil[];
    loaded: boolean;
    loading: boolean;
    error: any;
}

const estadoInicial: MovilState = {
    moviles: [],
    loaded: false,
    loading: false,
    error: null
}

export function movilReducer(state = estadoInicial, action: fromMoviles.movilActions): MovilState {

    switch (action.type) {
        case fromMoviles.CARGAR_MOVILES:
            /*
                return Object.assign({}, state, {
                    moviles: [...action.moviles]
                })
                */
            return {
                ...state,
                loading: true,
                error: null
            };

        case fromMoviles.CARGAR_MOVILES_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                moviles: [...action.moviles]
            };

        case fromMoviles.CARGAR_MOVILES_FAIL:
            return {
                ...state,
                loaded: false,
                loading: false,
                error: {
                    status: action.payload.status,
                    message: action.payload.message,
                    url: action.payload.url
                }
            };


        default:
            return state;
    }
}
