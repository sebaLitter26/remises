import { Calle } from '../../models/index.models';
import * as fromCalles from '../actions';

export interface CalleState {
    calle: Calle;
    lastUpdate: Date;
    calles: Calle[];
    actualizarVista: Date;
    modificar_calles: Calle[]
}

const estadoInicial: CalleState = {
    calle: null,
    lastUpdate: null,
    calles: [],
    actualizarVista: null,
    modificar_calles: []
}


export function calleReducer(state = estadoInicial, action: fromCalles.calleActions): CalleState {

    switch (action.type) {
        case fromCalles.CARGAR_NUEVA_CALLE:
            return Object.assign({}, state, {
                direccion: action.direccion,
                lastUpdate: new Date()
            })

        /*****************************************************************************/
        case fromCalles.CARGAR_CALLES_EFFECTS:
            //console.log('CARGAR_CALLES', action)
            return {
                ...state,
                lastUpdate: new Date()
            };

        case fromCalles.CARGAR_CALLES_EFFECTS_SUCCESS:
            //console.log('CARGAR_CALLES_EFFECTS_SUCCESS', action);
            return {
                ...state,
                calles: [...action.calles],
                lastUpdate: new Date()
            };

        case fromCalles.CARGAR_CALLES_EFFECTS_FAIL:
            //console.log('CARGAR_CALLES_EFFECTS_FAIL', action);
            break;


        case fromCalles.MODIFICAR_CALLE:
            var index = state.calles.findIndex(t => t.idcallejero === action.calle.idcallejero);
            //console.log(action.calle.idcallejero);
            //console.log('MODIFICAR_CALLE', index, action.calle);
            if (index < 0) { index = state.calles.length; }
            //console.log(index);
            return Object.assign({}, state, {
                calles: [
                    ...state.calles.slice(0, index),
                    Object.assign({}, state.calles[index], action.calle),
                    ...state.calles.slice(index + 1)
                ],
                calle: action.calle,//state.calles[index],
                lastUpdate: new Date()
            });

        case fromCalles.MODIFICAR_VARIAS_CALLES:
            return {
                ...state,
                modificar_calles: [...action.calles],
                lastUpdate: new Date()
            };


        case fromCalles.CARGAR_NUEVA_CALLE_EFFECTS_SUCCESS:
            //console.log('CARGAR_NUEVA_CALLE_EFFECTS_SUCCESS', action);
            break;


        case fromCalles.CARGAR_NUEVA_CALLE_EFFECTS_FAIL:
            //console.log('CARGAR_NUEVA_CALLE_EFFECTS_FAIL', action);
            break;

        case fromCalles.ACTUALIZAR_VISTA_MAPA:
            var dato: any;
            //console.warn(action.dato);

            return Object.assign({}, state, {
                actualizarVista: (action.dato != null) ? action.dato : new Date()
            });

        default:
            return state;
    }
}
