import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
//import {  } from '../../services/api.service';
import { ApiService } from '../../services/index.services';

import { RolesService } from './roles.service';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {



    permisos: any;
    permisos_habilitados: any;
    permisohabilitado: any;
    permisos_especiales: any;
    menu: any;
    grupos: any;

    agregarEspecialControl = new FormControl();
    usuarios: any[] = [];
    filteredOptions: Observable<string[]>;
    idusuario: number;
    idmenuopcion: number;

    idgrupo: number;


    persona_especial: any;
    agregar_persona_especial: any;

    agregar_especial: boolean = false;

    error: string = "";



    //perfil: FormControl ;



    constructor(

        private _api: ApiService,
        private _formBuilder: FormBuilder,
        private _roles: RolesService,
        public snackBar: MatSnackBar,
    ) {


    }

    displayedColumns =
        ['descripcion', 'permisoshabilitados']; //, 'star'];

    dataSource = null; 


        


    ngOnInit() {

        this.solicitar_permisos();
        this.obtener_grupos();
        this.solicitar_menu();
        this.solicitar_usuarios();

        this.filteredOptions = this.agregarEspecialControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
        );

    }


    private _filter(value: string): string[] {

        if (value !== null && typeof value === 'object') {
            this.agregar_persona_con_permiso(value);
            return;
        }
        if (!value) {
            var usu = this.usuarios.filter(option => +option.idgrupo == +this.idgrupo);
            console.log('usu', usu, this.idgrupo);
            return usu;
        }

        console.log(value);
        const filterValue = value.toLowerCase();

        return this.usuarios.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0 && option.idgrupo == this.idgrupo);

    }

    displayFn(user?: any): string | undefined {

        return user ? user.nombre + ' ' + user.apellido + ' (' + user.documento + ')' : undefined;
    }






    solicitar_permisos_habilitados(selected: any) {
        this.idgrupo = +selected;
        this.permisos_especiales = [];
        this.persona_especial = null;

        let datos_permisos = {
            idusuario: +this.idusuario,
            idgrupo: +selected,
        };
        this._api.post('menuPermisos', datos_permisos).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });

            this.permisos_habilitados = response['jsData'];
            //console.log('menuPermisos', this.permisos_habilitados);

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }

    recorrer_permisos_a_mostrar(permiso_nro) {
        var permisos = [];
        //console.log('permisohabilitado', permiso_nro, this.permisohabilitado);
        if (this.permisos) {
            this.permisos.forEach((permiso) => {
                if ((+permiso_nro & +permiso.idpermiso) == +permiso.idpermiso)
                    permisos.push(permiso);

            });
        }
        return permisos;
    }

    solicitar_usuarios() {
        this._api.post('getUsuarios', {}).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            this.usuarios = response['jsData'];

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }

    solicitar_menu() {
        this._api.post('menu', {}).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            this.menu = response['jsData'];
            this.dataSource =  new MatTableDataSource(this.menu);


        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }

    solicitar_permisos() {
        this._api.post('getPermisos', {}).subscribe(response => {
            this.permisos = response['jsData'];

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }



    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    /*
        solicitar_permiso_especiales(element) {

            var dato = {
                idgrupo: this.idgrupo,
                idmenuopcion: +element.idmenuopcion,
                //permisos: +permiso_boton.idpermiso,
                idusuario: +this.idusuario,

            }
            this._api.post('menuPermisoEspeciales', dato).subscribe(response => {
                //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
                this.permisos_habilitados[dato.idmenuopcion].usuariosespeciales = response['jsData'];

            },
                error => {
                    console.log(<any>error);
                    this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                        duration: 7000,
                    });
                }
            );
        }
    */
    obtener_grupos() {
        this._api.post('getGrupos', {}).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            this.grupos = response['jsData'];

            this.idusuario = response['usuario'].idusuario;

            this.solicitar_permisos_habilitados(this.grupos[0].idgrupo);


        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }


    getEstadoPermiso(element, permiso_boton) {
        let estadoClase = 'permiso-deshabilitado';

        var permiso_habilitado = this.permisosMenu(element.idmenuopcion);


        if (permiso_habilitado && (+permiso_habilitado['permisos'] & +permiso_boton.idpermiso) == permiso_boton.idpermiso)
            estadoClase = 'permiso-habilitado';
        return estadoClase;
    }





    getEstadoPermisoEspeciales(element, permiso_boton) {
        let estadoClase = 'permiso-deshabilitado';

        if ((+element.permisos & +permiso_boton.idpermiso) == permiso_boton.idpermiso)
            estadoClase = 'permiso-habilitado';


        return estadoClase;
    }




    /*

    select getparametro('despachar_extension', 12);


    select setparametro('despachar_extension', 12, '4');

     */
    agregar_persona_con_permiso(persona_especial) {

        var dato = {
            idgrupo: this.idgrupo,
            idmenuopcion: this.idmenuopcion,
            permisos: 0,
            idusuario: +persona_especial.idusuario,
            modificar: false
        }

        this._api.post('setPermiso', dato).subscribe(response => {

            persona_especial['idgrupo'] = response['jsData'][0].idgrupo;
            persona_especial['idmenuopcion'] = response['jsData'][0].idmenuopcion;
            persona_especial['permisos'] = response['jsData'][0].permisos;

            var usuarios_especi = this.permisosMenu(+response['jsData'][0].idmenuopcion);

            usuarios_especi['usuariosespeciales'].push(persona_especial);

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
        //this.agregarEspecialControl.reset();
        this.agregar_especial = false;
        this.persona_especial = persona_especial;



    }

    permisosMenu(idmenuopcion) {


        var resp = [];
        if (this.permisos_habilitados) {
            this.permisos_habilitados.forEach((permiso_habilitado) => {

                if (+idmenuopcion && +permiso_habilitado.idmenuopcion == +idmenuopcion) {

                    resp = permiso_habilitado;
                }

            });
        }

        return resp;
    }

    usuariosEspeciales(idmenuopcion, modo) {

        var resp = this.permisosMenu(idmenuopcion);

        if (resp && resp['usuariosespeciales'])
            resp = (modo) ? resp['usuariosespeciales'] : resp['usuariosespeciales'].length;
        else
            resp = (modo) ? [] : null;

        return resp;
    }

    cambiar_permiso_grupo(element, permiso_boton) {


        var dato = {
            idgrupo: this.idgrupo,
            idmenuopcion: element.idmenuopcion,
            permisos: +permiso_boton.idpermiso,
            idusuario: 0,
            modificar: false
        }

        this.permisos_habilitados.forEach((permiso_habilitado) => {

            if (permiso_habilitado && +permiso_habilitado.idmenuopcion == +dato.idmenuopcion) {
                dato.modificar = true;
                permiso_habilitado.permisos = +permiso_habilitado.permisos;
                if ((+permiso_habilitado.permisos & +permiso_boton.idpermiso) == +permiso_boton.idpermiso)
                    permiso_habilitado.permisos -= +permiso_boton.idpermiso;
                else
                    permiso_habilitado.permisos += +permiso_boton.idpermiso;

                dato.permisos = +permiso_habilitado.permisos;
                //console.log('permisos', dato.permisos);
            }



        });

        this._api.post('setPermiso', dato).subscribe(response => {

            if (!dato.modificar)
                this.permisos_habilitados[this.permisos_habilitados.length] = response['jsData'][0];

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );

    }


    cambiar_permiso_especial(element, permiso_boton) {


        var dato = {
            idgrupo: this.idgrupo,
            idmenuopcion: element.idmenuopcion,
            permisos: +permiso_boton.idpermiso,
            idusuario: element.idusuario,
            modificar: false
        }
        //console.log('idmenuopcion', element, dato);
        /*


                if (!element.idmenuopcion) {
                    var idmenuopcion = this.permisos_especiales.filter(value => +element.idusuario == +value.idusuario);
                    console.log('idmenuopcion', idmenuopcion);
                    dato.idmenuopcion = idmenuopcion[0].idmenuopcion;
                }
                */


        //console.log('cambiar estado especial', element, dato, this.permisos_especiales);
        //var usuarpermiso_habilitadoio_especial = this.permisos_especiales[+element['idmenuopcion']].filter(value => +element.idusuario == +value.idusuario);

        var permiso_habilitado = this.usuariosEspeciales(dato.idmenuopcion, true).filter(value => +element.idusuario == +value.idusuario)[0];
        console.log('permisos', permiso_boton, permiso_habilitado);
        if (permiso_habilitado) {
            dato.modificar = true;
            permiso_habilitado.permisos = +permiso_habilitado.permisos;
            if ((+permiso_habilitado.permisos & +permiso_boton.idpermiso) == +permiso_boton.idpermiso)
                permiso_habilitado.permisos -= +permiso_boton.idpermiso;
            else
                permiso_habilitado.permisos += +permiso_boton.idpermiso;

            dato.permisos = +permiso_habilitado.permisos;

        }




        this._api.post('setPermiso', dato).subscribe(response => {
            console.log(dato);
            if (!dato.modificar)
                this.permisos_especiales[+element['idmenuopcion']][this.permisos_especiales.length] = response['jsData'][0];

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );

    }

    delete_perfil_especial(dato) {
        //var permiso_habilitado = this.usuariosEspeciales(dato.idmenuopcion, true).filter(value => +element.idusuario == +value.idusuario)[0];
        this._api.post('borrarPermiso', dato).subscribe(response => {

            var respu = response['jsData'][0];
            var usuarios_especi = this.permisosMenu(+response['jsData'][0].idmenuopcion);
            //console.log('delete', usuarios_especi.usuariosespeciales, dato);
            usuarios_especi['usuariosespeciales'] = usuarios_especi['usuariosespeciales'].filter(value => +respu.idusuario != +value.idusuario);
            this.persona_especial = null;



        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }

    remove(array, element): any[] {
        return array.filter(word => word.idusuario != element.idusuario);

    }



    getColor(i) {
        let color = ['lightyellow', 'lightblue', 'lightgreen', 'lightred', 'lightpurple'][i];
        return { background: color };
    }





}

/*

export interface PermisosElement {
    idmenuopcion: number;
    descripcion: string;
    observacion: string;
    permisoshabilitados: number;
    idempresas: number;
    ruta: string;
    idmenuopcionpadre: number;
    verenmenu: number
}

const ELEMENT_DATA: PermisosElement[] = [
    { idmenuopcion: 1, descripcion: "Usuarios", observacion: null, permisoshabilitados: 9, idempresas: null, ruta: "lists/usuarios", idmenuopcionpadre: null, verenmenu: 1 },

];
*/
