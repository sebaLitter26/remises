import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
//import {  } from '../../services/api.service';
import { ApiService } from '../../services/index.services';

import { ConfiguracionService } from './configuracion.service';
/**
 * @title Table with a sticky columns
 */
@Component({
    selector: 'app-configuracion',
    templateUrl: './configuracion.component.html',
    styleUrls: ['./configuracion.component.scss'],
})
export class ConfiguracionComponent implements OnInit {



    permisos: any;
    parametros: any;
    permisohabilitado: any;
    permisos_especiales: any;
    grupos: any;

    agregarEspecialControl = new FormControl();
    menu: any[] = [];
    filteredOptions: Observable<string[]>;
    idusuario: number;
    idmenuopcion: number;

    idparametrogrupo: number;


    persona_especial: any;
    agregar_persona_especial: any;

    agregar_especial: boolean = true;


    error: string = "";

    fields: any;

    usuario: any = {};
    usuario_empresa = 0;
    empresas: any[] = [];




    public form: FormGroup;
    unsubcribe: any

    subject_parametros$ = new Subject<any>();
    subject_parametro_nuevo$ = new Subject<any>();
    nuevo: any[] = [];

    valor: any;

    idparametroconfig: number;




    formCities = new FormGroup({
        cities: new FormArray([
            new FormControl('SF'),
            new FormControl('NY'),
        ]),
    });

    get cities(): FormArray { return this.formCities.get('cities') as FormArray; }

    addCity() { this.cities.push(new FormControl()); }

    onSubmit() {
        console.log(this.cities.value);  // ['SF', 'NY']
        console.log(this.formCities.value);    // { cities: ['SF', 'NY'] }
    }

    setPreset() { this.cities.patchValue(['LA', 'MTV']); }





    constructor(

        private _api: ApiService,
        private _formBuilder: FormBuilder,
        private _configuracion: ConfiguracionService,
        public snackBar: MatSnackBar,
    ) {

        //this.usuario['idempresa'] = 0;
    }

    /*displayedColumns =
        ['codigo', 'valor'];
    //dataSource = ELEMENT_DATA;
*/
    ngOnInit() {
        this.solicitar_parametros();


        this.form = new FormGroup({
            fields: new FormControl(JSON.stringify(this.fields))
        })
        this.unsubcribe = this.form.valueChanges.subscribe((update) => {
            //console.log('updated form', update);
            this.fields = JSON.parse(update.fields);
        });

        //console.log('nuevo', this.nuevo);


        /*
                this.filteredOptions = this.agregarEspecialControl.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value))
                );
                */

    }


    solicitar_empresas() {

        this._api.post('getEmpresas', {}).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });

            this.empresas = response['jsData'];
            this.cargar_nuevo_parametro();

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }



    solicitar_parametros() {


        this._api.post('getParametrosEmpresa', {}).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });

            this.parametros = response['jsData'];
            this.usuario = response['usuario'];
            this.usuario_empresa = this.usuario.idempresa;
            if (this.usuario.idempresa == 0)
                this.solicitar_empresas();



            this.parametros.forEach((campo: any) => {
                campo['opciones'] = JSON.parse(campo['opciones']);
            });


            this.grupos = this.parametros.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj['idparametrogrupo']).indexOf(obj['idparametrogrupo']) === pos;
            });
            //console.log(this.grupos);
            this.solicitar_grupos_parametros(this.grupos[0].idparametrogrupo);




        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }

    solicitar_grupos_parametros(idparametrogrupo: number) {
        this.menu = this.parametros.filter(mapObj => mapObj['idparametrogrupo'] == idparametrogrupo);
        this.idparametrogrupo = idparametrogrupo;

        this.subject_parametros$.next(this.menu);


    }

    cargar_nuevo_parametro() {
        this.idparametroconfig = null;
        if (this.usuario_empresa != 0)
            return;

        this.nuevo = [{
            codigo: "tipo",
            etiqueta: "Tipo de input",
            nombre: "Nuevo Parametro",
            opciones: [{ key: "text", valor: "Text" }, { key: "dropdown", valor: "Dropdown" }, { key: "radio", valor: "Radio" }, { key: "checkbox", valor: "Checkbox" }],
            requerido: "0",
            tipo: "dropdown",
            placeholder: "Ingrese el tipo de input",
            valor: "text"
        }, {
            codigo: "etiqueta",
            etiqueta: "Nombre parametro",
            //nombre: "Nombre del parametro",
            //opciones: [{ key: "text", valor: "text" }, { key: "dropdown", valor: "Dropdown" }, { key: "radio", valor: "Radio" }, { key: "checkbox", valor: "Checkbox" }],
            requerido: "0",
            tipo: "text",
            placeholder: "Ingrese el nombre del Parametro",
            //valor: "nombre del parametro"
        },
        {
            codigo: "codigo",
            etiqueta: "codigo unico",
            //nombre: "Nombre del parametro",
            //opciones: [{ key: "text", valor: "text" }, { key: "dropdown", valor: "Dropdown" }, { key: "radio", valor: "Radio" }, { key: "checkbox", valor: "Checkbox" }],
            requerido: "0",
            tipo: "text",
            placeholder: "Ingrese el codigo identificatorio unico",
            //valor: "variable_unica"
        },
        {
            codigo: "placeholder",
            etiqueta: "placeholder",
            //nombre: "Nombre del parametro",
            //opciones: [{ key: "text", valor: "text" }, { key: "dropdown", valor: "Dropdown" }, { key: "radio", valor: "Radio" }, { key: "checkbox", valor: "Checkbox" }],
            requerido: "0",
            tipo: "text",
            placeholder: "Ingrese el descripcion a ingresar en el campo",
            //valor: "variable_unica"
        },
        {
            codigo: "opciones",
            etiqueta: "opciones",
            //nombre: "Nombre del parametro",
            //opciones: [{ key: "text", valor: "text" }, { key: "dropdown", valor: "Dropdown" }, { key: "radio", valor: "Radio" }, { key: "checkbox", valor: "Checkbox" }],
            requerido: "0",
            tipo: "text",
            placeholder: "codigo1:valor1 [, codigo2:valor2] [, codigoN:valorN]",
            //valor: "variable_unica"
        },


        {
            codigo: "requerido",
            etiqueta: "Es_Requerido",
            //nombre: "nuevo Parametro",
            opciones: [{ key: "1", valor: "Si" }, { key: "0", valor: "No" }],
            requerido: "0",
            tipo: "radio",
            //placeholder: "Ingrese el tipo de input",
            valor: "0"
        },

        {
            codigo: "idparametrogrupo",
            etiqueta: "Grupo al que pertenece",
            //nombre: "nuevo Parametro",
            opciones: this.grupos.map((grupo: any) => { return { key: grupo.idparametrogrupo, valor: grupo.nombre } }),
            requerido: "0",
            tipo: "dropdown",
            //placeholder: "Ingrese el tipo de input",
            // valor: "1"
        },
        {
            codigo: "idempresas",
            etiqueta: "empresas excluidas",
            //nombre: "Nombre del parametro",
            opciones: this.empresas.map((empresa: any) => { return (+empresa.estado == 1) ? { key: empresa.idempresa, valor: empresa.codigo } : null }),
            requerido: "0",
            tipo: "text",
            //placeholder: "codigo1:valor1 [, codigo2:valor2] [, codigoN:valorN]",
            //valor: "variable_unica"
        }];
        //console.log('nuevo', this.nuevo);
        this.subject_parametro_nuevo$.next(this.nuevo);
    }





    getColor(i) {
        let color = ['lightyellow', 'lightblue', 'lightgreen', 'lightred', 'lightpurple'][i];
        return { background: color, color: 'darkorange' };
    }

    modificar_parametro(estrucura_parametro) {
        if (this.usuario_empresa != 0)
            return;
        //console.log('modificar_parametro', estrucura_parametro);
        this.nuevo.forEach(dato => {

            if (dato['codigo'] == 'opciones') {
                var opciones_json: string = '';

                let opciones = estrucura_parametro[dato.codigo];//dato['valor'];
                if (opciones) {
                    opciones.forEach((opcion => {
                        opciones_json += opcion['key'].trim() + ':' + opcion['valor'].trim() + ',';

                    }));
                    dato['valor'] = opciones_json.slice(0, -1);
                }

            } else
                dato['valor'] = estrucura_parametro[dato.codigo];
        });
        this.valor = estrucura_parametro['valor'];
        this.idparametroconfig = estrucura_parametro['idparametroconfig'];
        //console.log('dato_modif', this.nuevo);
        this.subject_parametro_nuevo$.next(this.nuevo);
    }

    onUpload(parametros_modificados) {
        //console.log('onupload', parametros_modificados);
        if (parametros_modificados['codigo']) {
            this.modificar_parametro(parametros_modificados);
            return;
        }

        let datos = {
            parametros: JSON.stringify(parametros_modificados)
        };


        this._api.post('setParametrosEmpresa', datos).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });

            this.snackBar.open('Se modificaron los parametros correctamente', 'CERRAR', {
                duration: 7000,
            });
            /*
                        this.parametros = response['jsData'];
                        console.log('parametros', this.parametros);



                        this.parametros.forEach((campo: any) => {
                            campo['opciones'] = JSON.parse(campo['opciones']);
                        });


                        this.grupos = this.parametros.filter((obj, pos, arr) => {
                            return arr.map(mapObj => mapObj['idparametrogrupo']).indexOf(obj['idparametrogrupo']) === pos;
                        });
                        this.solicitar_grupos_parametros(this.grupos[0].idparametrogrupo);
                        */

        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }


    onUpload_nuevo(parametros_modificados) {
        //console.log('onupload', parametros_modificados);
        var opciones_json: any = [];
        if (parametros_modificados['opciones'] && parametros_modificados['opciones'] != '[]') {

            let opciones = parametros_modificados['opciones'].split(",");
            opciones.forEach((opcion => {
                let opt = opcion.split(":");
                let dato = {};
                dato['key'] = opt[0].trim();
                dato['valor'] = opt[1].trim();
                opciones_json.push(dato);
            }));

            parametros_modificados['opciones'] = JSON.stringify(opciones_json);

        }
        //console.log('opciones', JSON.stringify(opciones_json));

        //parametros_modificados['idempresas'] = null;
        if (this.idparametroconfig)
            parametros_modificados['idparametroconfig'] = this.idparametroconfig;

        let datos = {};

        console.log('onUpload_nuevo', parametros_modificados);
        //datos['parametros'] = parametros_modificados;

        this._api.post('nuevoParametrosEmpresa', parametros_modificados).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });

            let dato_nuevo = response['jsData'][0];

            dato_nuevo['opciones'] = (dato_nuevo['opciones']) ? JSON.parse(dato_nuevo['opciones']) : '';
            dato_nuevo['valor'] = this.valor;
            if (this.idparametroconfig) {
                let itemIndex = this.parametros.findIndex(param => param.codigo == dato_nuevo.codigo);
                this.parametros[itemIndex] = dato_nuevo;
            } else
                this.parametros.push(dato_nuevo);
            this.idparametroconfig = null;
            this.solicitar_grupos_parametros(dato_nuevo.idparametrogrupo);


        },
            error => {
                console.log(<any>error);
                this.snackBar.open(error['error']['descripcion'], 'CERRAR', {
                    duration: 7000,
                });
            }
        );
    }
    /*
        getFields() {
            //return this.fields;


            console.log('menu', this.menu);
            return this.subject_parametros$.asObservable();


            //return this._configuracion.permiso_seleccionado(this.menu);
            //return this.menu;
        }
        */

    ngDistroy() {
        this.unsubcribe();
    }





}
