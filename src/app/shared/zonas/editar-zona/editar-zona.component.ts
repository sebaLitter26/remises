import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged, combineLatest, take } from 'rxjs/operators';

import { UbicacionService, PopupService, ApiService } from '../../../services/index.services';

//import { Calle } from '../../../models/index.models';
//import { Direccion } from '../../../models/index.models';

import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer'

import {
    ACTUALIZAR_VISTA_MAPA
} from '../../../store/actions';


@Component({
    selector: 'editar-zona',
    templateUrl: './editar-zona.component.html',
    styleUrls: ['./editar-zona.component.scss'],
    providers: [], //Inyección de dependencias
})

export class EditarZonaComponent implements OnInit {

    //@Output() onSubmit = new EventEmitter();
    @Input() parametros: Observable<any[]>;

    formGroup = this._formBuilder.group({
        modo: [''],
        //altura: [''],
        estado: [''],
        sentidoparada: [''],
        idzonamigrar: [''],
        zonasmensajes: [''],
        ordenparadas: [''],
        color: [''],
        hasta_x: [''],
        hasta_y: [''],
        fecha_modif: new Date(),
        //idnew FormControl([Validators.required, Validators.maxLength(10), Validators.minLength(4)]),

        localidad: [''],
        nombre: [''],
        sentido: [''],
        tipozona: [2],
        //cantidad_tramo: [100]
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
    zona: any = null;

    zonas_selector: any;//= [{ nombre: "16N", idzona: 590 }, { nombre: "18N", idzona: 577 }, { nombre: "1", idzona: 410 }, { nombre: "43", idzona: 534 }, { nombre: "37", idzona: 550 }, { nombre: "47", idzona: 593 }, { nombre: "39N", idzona: 589 }, { nombre: "34", idzona: 513 }, { nombre: "34N", idzona: 586 }, { nombre: "19N", idzona: 553 }, { nombre: "31N", idzona: 556 }, { nombre: "46", idzona: 543 }, { nombre: "8", idzona: 429 }, { nombre: "3", idzona: 415 }];
    //cantidad_tramo_ant: number = 0;

    editar_mas: boolean = false;



    constructor(
        private _formBuilder: FormBuilder,
        private router: Router,
        private _dialog: PopupService,
        public _ubi: UbicacionService,
        private _api: ApiService,
        private store: Store<AppState>     //ngrx
        //private menucito: MatMenu;
    ) {




    }

    ngOnInit() {
        /*      this._ubi.getFormularioCallejero().pipe(take(1)).subscribe((columnas) => {
                    console.log('columnas', columnas);
                });             */
        if (this._ubi.usuario_logueado) {
            this.parametros.subscribe((zona: any) => {


                this.crear_form(zona);

                this.borradoCorrecto = false;
                this.edicionCorrecta = false;
            });
        }


    }

    descartar_cambios() {
        document.getElementById('popup-closer').click();

    }



    crear_form(zona) {
        if (!zona) {
            return;
        }
        if (!zona.tipozona)
            zona.tipozona = 1;
        if (!zona.sentido)
            zona.sentido = 0;
        if (!zona.sentidoparada)
            zona.sentidoparada = 0;

        this.zonas_selector = zona.zonas_selector;
        this.zona = zona;
        console.log('zona a editar', this.zona);

        this.formGroup = new FormGroup({
            modo: new FormControl(this.zona.modo, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            estado: new FormControl(+this.zona.estado, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            sentidoparada: new FormControl(+this.zona.sentidoparada, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            idzonamigrar: new FormControl(+this.zona.idzonamigrar, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            zonasmensajes: new FormControl(+this.zona.zonasmensajes, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            ordenparadas: new FormControl(+this.zona.ordenparadas, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            color: new FormControl(+this.zona.color, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            nombre: new FormControl(this.zona.nombre, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            sentido: new FormControl(+this.zona.sentido, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),
            tipozona: new FormControl(+this.zona.tipozona, [Validators.required, Validators.maxLength(10), Validators.minLength(4)]),

        });
        //console.log(this.formGroup.getRawValue());
    }


    modificar_zona() {
        let zona_modificada = { nombre: this.formGroup.get('nombre').value, modo: this.formGroup.get('modo').value };
        //this._ubi.validar_usuario(logueo);

        //console.log('Formulario ', logueo);
        //this.api
    }

    reiniciar_datos() {
        //this.cantidad_tramo_ant = Math.abs(this.zona.ordenparadas - this.zona.sentidoparada + 1);
        this.formGroup.reset({
            modo: this.zona.modo,
            //altura: this.zona.altura,
            estado: this.zona.estado,
            sentidoparada: this.zona.sentidoparada,
            idzonamigrar: this.zona.idzonamigrar,
            zonasmensajes: this.zona.zonasmensajes,
            ordenparadas: this.zona.ordenparadas,
            color: this.zona.color,
            nombre: this.zona.nombre,
            tipozona: +this.zona.tipozona,
        });
    }

    /*
        invertir_sentido() {
            this._api.post('invertirSentido', this.zona).subscribe(response => {
                console.log(response);
                //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
                this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
                //this.borradoCorrecto=true;
                this.edicionCorrecta = true;
                this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: { idzona: this.zona.idzona } });
            },
                error => {
                    console.log(<any>error);
                }
            );
        }
    
        */

    borrar_tramo() {
        console.log('zona borrar', this.zona);
        if (!this.zona)
            return;


        this._dialog.abrir({
            width: '400px',
            height: '250px',
            data: {
                pregunta: "¿Desea Borrar el tramo seleccionado?",
                titulo: this.zona.nombre,
                //fecha: new Date(),
            }
        }).subscribe(datos => {
            if (datos) {
                console.log("cerro dialog", datos);
                this._ubi.borrar_zona_ubi(this.zona).subscribe(response => {
                    console.log(response);
                    this.descartar_cambios();
                    //this.descartar_cambios();
                    //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
                    //this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
                    //this.borradoCorrecto = true;
                    //this.edicionCorrecta = true;
                    //this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: { idzona: this.zona.idzona } });
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


        /*
            //this.formGroup.controls['cantidad_tramo'].setValue(cantidad_tramo);
            var sentidoparada = +this.formGroup.get('sentidoparada').value;

            this.formGroup.patchValue({
                estado: altura + 1,
                sentidoparada: altura,
                ordenparadas: altura + cantidad_tramo - 1,
                color: altura + cantidad_tramo,
                //cantidad_tramo: (this.zona.ordenparadas - this.zona.sentidoparada + 1),
            });
            */
    }

    cambio_localidad_manual() {
        console.log('cambio_localidad_manual');
    }

    onSubmit() {
        this.focus();
        let formulario = this.formGroup.getRawValue();
        //console.log(this.formGroup.getRawValue());
        //console.log(this.zona);
        if (this.zona.idzona != -1)
            formulario['idzona'] = this.zona.idzona;
        this.validar(formulario);/*

        formulario['zona'] = this.nombreCalle;
        formulario['lat'] = this.puntoPedido.lat;
        formulario['lon'] = this.puntoPedido.lon;
        formulario['localidad'] = this._ubi.localidad;
        delete formulario['seleccion_buscador'];
        delete formulario['viajeProgramado'];
         */

        this._api.post('grabarZona', formulario).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
            this.edicionCorrecta = true;
            setTimeout(this.descartar_cambios, 2500);
            //this.store.dispatch({ type: ACTUALIZAR_VISTA_MAPA, dato: null });
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
