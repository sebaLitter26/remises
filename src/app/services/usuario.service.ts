import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { UbicacionService } from './ubicacion.service';

import { of, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UsuarioService {



    constructor(
        private _api: ApiService,
        private _ubi: UbicacionService,
    ) { }


    getUsers() {

        return this._api.get('usuarios', {})
            .pipe(
                map(resp => resp['data'])
            );

    }

    getUserById() {
        return new Observable(observer => {
            observer.next(this._ubi.usuario);
        });
        /*
        return this._ubi.usuario;
        return this._api.get(`${this.url}/users/${id}`)
            .pipe(
                map(resp => resp['data'])
            );
            */
    }

}
