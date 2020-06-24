import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Observable } from 'rxjs';
//import { map, startWith, debounceTime, distinctUntilChanged, combineLatest, take } from 'rxjs/operators';

import { UbicacionService, PopupService, ApiService } from '../../../services/index.services';

import { Calle } from '../../../models/index.models';
//import { Direccion } from '../../../models/index.models';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer'

import {
    ACTUALIZAR_VISTA_MAPA
} from '../../../store/actions';


@Component({
    selector: 'editar-calle',
    templateUrl: './editar-calle.component.html',
    styleUrls: ['./editar-calle.component.scss'],
    providers: [], //Inyección de dependencias
})

export class EditarCalleComponent implements OnInit {

    formGroup = this._formBuilder.group({
        alias: [''],
        //altura: [''],
        desde_impa: [''],
        desde_par: [''],
        desde_x: [''],
        desde_y: [''],
        hasta_impa: [''],
        hasta_par: [''],
        hasta_x: [''],
        hasta_y: [''],
        fecha_modif: new Date(),
        //idnew FormControl([Validators.required, Validators.maxLength(10), Validators.minLength(4)]),

        localidad: [''],
        nombre: [''],
        sentido: [''],
        tipocalle: [2],
        cantidad_tramo: [100]
    });

    //filteredOptions: Observable<Direccion[]>;

    //direcciones: Direccion[] = [];
    //dire: any = {};
    //localidades = [];
    //locality: string = 'Localidad';
    //altura: number = 0;
    //direccion: string = '';
    //mostrarLupita: boolean;
    //selected:string = '';

    edicionCorrecta: boolean = false;
    borradoCorrecto: boolean = false;
    calle: Calle = null;
    cantidad_tramo_ant: number = 0;

    editar_mas: boolean = false;



    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private _dialog: PopupService,
        public _ubi: UbicacionService,
        private _api: ApiService,
        private store: Store<AppState>     //ngrx
        //private menucito: MatMenu;
    ) { }

    ngOnInit() {
        /*      this._ubi.getFormularioCallejero().pipe(take(1)).subscribe((columnas) => {
                    console.log('columnas', columnas);
                });             */

        if (this._ubi.usuario_logueado) {
            this.store.select(state => state['callejero'].callejero.calle).subscribe((calle) => {
                this.crear_form(calle);
                console.log('calle a editar', calle);
                this.borradoCorrecto = false;
                this.edicionCorrecta = false;
            });
        }
    }

    descartar_cambios() {
        document.getElementById('popup-closer').click();

    }



    crear_form(calle) {
        if (!calle) {
            return;
        }
        if (!calle.tipocalle)
            calle.tipocalle = 1;
        if (!calle.sentido)
            calle.sentido = 0;
        if (!calle.localidad)
            calle.localidad = this._ubi.localidad;
        if (!calle.desde_par)
            calle.desde_par = 0;
        if (!calle.hasta_impa)
            this.cantidad_tramo_ant = 100;
        else
            this.cantidad_tramo_ant = Math.abs(calle.hasta_impa - calle.desde_par + 1);
        this.calle = calle;

        this.formGroup = new FormGroup({
            alias: new FormControl(this.calle.alias, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            //altura: new FormControl(+this.calle.altura, [Validators.required, Validators.minLength(4)]),
            desde_impa: new FormControl(+this.calle.desde_impa, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            desde_par: new FormControl(+this.calle.desde_par, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            desde_x: new FormControl(+this.calle.desde_x, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            desde_y: new FormControl(+this.calle.desde_y, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            hasta_impa: new FormControl(+this.calle.hasta_impa, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            hasta_par: new FormControl(+this.calle.hasta_par, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            hasta_x: new FormControl(+this.calle.hasta_x, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            hasta_y: new FormControl(+this.calle.hasta_y, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),

            //idthis.callejero: new FormControl(this.calle.idthis.callejero, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            localidad: new FormControl(this.calle.localidad, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            nombre: new FormControl(this.calle.nombre, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            sentido: new FormControl(+this.calle.sentido, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            tipocalle: new FormControl(+this.calle.tipocalle, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            cantidad_tramo: new FormControl(this.cantidad_tramo_ant, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
        });
        //console.log(this.formGroup.getRawValue());
    }


    modificar_calle() {
        let calle_modificada = { nombre: this.formGroup.get('nombre').value, alias: this.formGroup.get('alias').value };
        //this._ubi.validar_usuario(logueo);

        //console.log('Formulario ', logueo);
        //this.api
    }

    reiniciar_datos() {
        this.cantidad_tramo_ant = Math.abs(this.calle.hasta_impa - this.calle.desde_par + 1);
        this.formGroup.reset({
            alias: this.calle.alias,
            //altura: this.calle.altura,
            desde_impa: this.calle.desde_impa,
            desde_par: this.calle.desde_par,
            desde_x: this.calle.desde_x,
            desde_y: this.calle.desde_y,
            hasta_impa: this.calle.hasta_impa,
            hasta_par: this.calle.hasta_par,
            hasta_x: this.calle.hasta_x,
            hasta_y: this.calle.hasta_y,
            cantidad_tramo: this.cantidad_tramo_ant,
            //idthis.callejero: new FormControl(this.calle.idthis.callejero, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),

            localidad: this.calle.localidad,
            nombre: this.calle.nombre,
            sentido: +this.calle.sentido,
            tipocalle: +this.calle.tipocalle,
        });
    }


    invertir_sentido() {
        this._api.post('invertirSentido', this.calle).subscribe(response => {
            console.log(response);
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
            //this.borradoCorrecto=true;
            this.edicionCorrecta = true;
            this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: { idcallejero: this.calle.idcallejero } });
        },
            error => {
                console.log(<any>error);
            }
        );
    }

    borrar_tramo() {
        console.log('calle borrar', this.calle);
        if (!this.calle)
            return;


        this._dialog.abrir({
            width: '400px',
            height: '250px',
            data: {
                pregunta: "¿Desea Borrar el tramo seleccionado?",
                titulo: this.calle.nombre,
                altura: this.calle.altura,
                //fecha: new Date(),
                localidad: this.calle.localidad
            }
        }).subscribe(datos => {
            if (datos) {
                console.log("cerro dialog", datos);
                this._ubi.borrar_calle_ubi(this.calle).subscribe(response => {
                    console.log(response);
                    this.descartar_cambios();
                    //this.descartar_cambios();
                    //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
                    //this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
                    //this.borradoCorrecto = true;
                    //this.edicionCorrecta = true;
                    this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: { idcallejero: this.calle.idcallejero } });
                },
                    error => {
                        console.log(<any>error);
                    }
                );

            } else {
                // User clicked 'Cancel' or clicked outside the dialog
            }
        });
    }

    focus() {
        let cantidad_tramo = +this.formGroup.get('cantidad_tramo').value;

        cantidad_tramo += (cantidad_tramo % 2 == 1) ? 1 : 0;
        this.formGroup.controls['cantidad_tramo'].setValue(cantidad_tramo);
        var altura = +this.formGroup.get('desde_par').value;

        this.formGroup.patchValue({
            desde_impa: altura + 1,
            desde_par: altura,
            hasta_impa: altura + cantidad_tramo - 1,
            hasta_par: altura + cantidad_tramo,
            //cantidad_tramo: (this.calle.hasta_impa - this.calle.desde_par + 1),
        });
    }

    cambio_localidad_manual() {
        console.log('cambio_localidad_manual');
    }

    onSubmit() {
        this.focus();
        let formulario = this.formGroup.getRawValue();
        //console.log(this.formGroup.getRawValue());
        //console.log(this.calle);
        if (this.calle.idcallejero != -1)
            formulario['idcallejero'] = this.calle.idcallejero;
        this.validar(formulario);/*

        formulario['calle'] = this.nombreCalle;
        formulario['lat'] = this.puntoPedido.lat;
        formulario['lon'] = this.puntoPedido.lon;
        formulario['localidad'] = this._ubi.localidad;
        delete formulario['seleccion_buscador'];
        delete formulario['viajeProgramado'];
         */

        this._api.post('grabarCalle', formulario).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
            this.edicionCorrecta = true;
            setTimeout(this.descartar_cambios, 2500);
            this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: null });
        },
            error => {
                console.log(<any>error);
            }
        );
    }

    validar(form: any) {
        /*
        console.log(numerico(form));

        form.forEach(valor=>{
          switch(typeof(valor)){
            case 'number':

            case 'string':



          }
        })
        function numerico(valor){
          console.log(typeof(valor));
          if(typeof(valor)=='number')
            return true;
          else
            return false;
        }
        function string(palabra){
          if(typeof(valor)=='number')
            return true;
          else
            return false;
        }*/
    }



}
