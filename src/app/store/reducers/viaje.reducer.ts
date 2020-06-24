import { Viaje, Direccion } from '../../models/index.models';
import * as fromViajes from '../actions';

export interface ViajeState {
  viaje: Viaje ;
  direccion: Direccion ;
  coordenadas: any;
  localidades: any;
  viajes: Viaje[];
  sidenav: boolean;
}

const estadoInicial: ViajeState ={
  viaje: null,
  direccion: null,
  coordenadas: [],
  localidades: [],
  viajes: [],
  sidenav: false,
}


export function viajeReducer (state=estadoInicial, action: fromViajes.viajeActions): ViajeState {

    switch ( action.type ){
      case fromViajes.CARGAR_NUEVO_VIAJE:
        if(state.direccion){
          (Object.entries(action.direccion)).forEach((valor)=>{
            if(valor[1]==""){
              action.direccion[valor[0]]=state.direccion[valor[0]];
            };
          });
        }
        return Object.assign({}, state, {
              direccion: action.direccion
          })

/*****************************************************************************/
      case fromViajes.CARGAR_VIAJES_EFFECTS:
        return {
          ...state
        };

      case fromViajes.CARGAR_VIAJES_EFFECTS_SUCCESS:
        return {
          ...state,
          viajes: [...action.viajes]
        };
/*****************************************************************************/

      case fromViajes.MODIFICACION_VIAJE:
        return Object.assign({}, state, {
              viaje: action.viaje
          })

      case fromViajes.CLICK_MAPA:
        return Object.assign({}, state, {
              coordenadas: action.coordenadas
          })
/*
      case fromViajes.CARGAR_VIAJES:
          return Object.assign({}, state, {
              viajes: action.viajes
          })
          */

      case fromViajes.CARGAR_LOCALIDADES:
        return Object.assign({}, state, {
              localidades: action.localidades
          })

      case fromViajes.REDIMENSION_SIDENAV:
        return Object.assign({}, state, {
          sidenav: action.sidenav
        })

      default:
        return state;

    }

}
