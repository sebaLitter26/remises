import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';

import * as usuarioActions from '../../../store/actions';
import { Usuario } from '../../../models/usuario.model';

import { ApiService, UbicacionService } from '../../../services/index.services'

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {

    user: Usuario;
    loading: boolean;
    error: any;

    constructor(
        private router: ActivatedRoute,
        private store: Store<AppState>,
        private _api: ApiService,
        private _ubi: UbicacionService,

    ) { }

    ngOnInit() {
        console.log('cargo UsuarioComponent');
        this.router.params
            .subscribe(params => {
                const id = params['id'];
                this.store.dispatch(new usuarioActions.CargarUsuario(id));
            });

        this.store.select('usuario')
            .subscribe(usuario => {

                this.user = usuario.user;
                this.loading = usuario.loading;
                this.error = usuario.error;

            });


    }


    modificar_usuario() {
        console.log('usuario', this.user);
        this._api.post('modificarUsuario', this.user).subscribe((usuario_modificado) => {
            console.log('usuario_modificado', usuario_modificado);
        });
    }

    eliminar_usuario() {
        this._api.post('eliminarUsuario', this.user).subscribe((usuario_borrado) => {
            console.log('usuario_borrado', usuario_borrado);
            this._ubi.cerrar_session();
        });
    }

}
