import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as modificacionActions from '../actions/administracion.actions';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AbmService } from '../../services/administracion.services/abm.service';

import { MODULOS } from '../../shared/administracion/actions';

//ngrx
import { Store, select } from '@ngrx/store';
import { AdministracionState } from '../administracion.reducers';

@Injectable()
export class ModificacionAdministracionEffects {

    constructor(
        private actions$: Actions,
        public _abm: AbmService,
        private store: Store<AdministracionState>,
    ) {
    }

    @Effect({ dispatch: false })
    actualizarGrilla$ = this.actions$.ofType(modificacionActions.ModificacionActionTypes.CAMBIAR_GRILLA_EFFECTS)
        .pipe(
            switchMap((action) => {
                //Del reducer de DATOS tomar el nombre de la tabla
                return this._abm.alta_modificacion(action['datos'])
                    .pipe(
                        map(moviles => {
                            /*
                            let objetoDispatch: any = { type: MODULOS[this._abm.url_modulo][3].type, datos: action['datos'] };
                            objetoDispatch['datos'] = action['datos'];
                            objetoDispatch['type'] = MODULOS[this._abm.url_modulo][3].type;
                            */
                            //console.log(objetoDispatch);
                            this.store.dispatch({ type: MODULOS[this._abm.url_modulo][3].type, datos: action['datos'] });
                            //new modificacionActions.ModifClientesAction(objetoDispatch);
                        }),
                        catchError(error => {
                            this.store.dispatch({ payload: error, type: 'CAMBIAR_GRILLA_FAIL' });
                            return of(new modificacionActions.CambiarGrillaFail(error));
                        })
                    );
            })
        );

    @Effect({ dispatch: false })
    filtrarGrilla$ = this.actions$.ofType(modificacionActions.ModificacionActionTypes.FILTRAR_GRILLA_EFFECTS)
        .pipe(
            switchMap((action) => {
                //Del reducer de DATOS tomar el nombre de la tabla
                return this._abm.filtrado(action['datos'])
                    .pipe(
                        map(moviles => {
                            /*
                            console.warn(moviles);
                            let objetoDispatch: any = [];
                            objetoDispatch['datos'] = moviles['datos'];
                            objetoDispatch['type'] = MODULOS[this._abm.url_modulo][2].type;
                            console.warn(objetoDispatch);
                            */
                            this.store.dispatch({ datos: moviles['datos'], type: MODULOS[this._abm.url_modulo][2].type });
                            //new modificacionActions.ModifClientesAction(objetoDispatch);
                        }),
                        catchError(error => of(new modificacionActions.CambiarGrillaFail(error)))
                    );
            })
        );

}
