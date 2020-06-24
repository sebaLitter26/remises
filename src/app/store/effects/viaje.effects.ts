import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import * as acciones from '../actions';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UbicacionService } from '../../services/ubicacion.service';

@Injectable()
export class ViajeEffects {

    constructor(
        private actions$: Actions,
        public _ubi: UbicacionService
    ) { }

    @Effect()
    cargarViajes$ = this.actions$.ofType(acciones.CARGAR_VIAJES_EFFECTS)
        .pipe(
            switchMap(() => {
                return this._ubi.getViajes()
                    .pipe(
                        map(viajes => new acciones.CargarViajesEffectsSuccess(viajes)),
                        //catchError(error => of(new acciones.CargarMovilesFail(error)))
                    );
            })
        );


}
