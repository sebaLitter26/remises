import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
//import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FnModificacionPresu } from './funciones_modificacion_presu.component';
import { BusquedaCallejeroPresu } from './busqueda_callejero_presu.component';

import { ApiService, UbicacionService, PopupService } from '../../../services/index.services';


import { Direccion } from '../../../models/index.models';

import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Store, select, } from '@ngrx/store';
import { AppState } from '../../../store/app.reducer';

import * as moment from 'moment';

import {
    MODIFICACION_VIAJE,
    CARGAR_NUEVO_VIAJE,
    CLICK_MAPA
} from '../../../store/actions';

interface objetoPorLocalidad {
    localidad: String;
    calles: any[];
}

@Component({
    selector: 'app-presupuesto',
    templateUrl: './presupuesto.component.html',
    styleUrls: ['./presupuesto.component.scss'],
    providers: [BusquedaCallejeroPresu],
})

export class PresupuestoComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild("calle") calleInput: ElementRef;
    @ViewChild("altura") alturaInput: ElementRef;
    @ViewChild("interseccion") interseccionInput: ElementRef;

    private subscripcionADomiciliosFrecuentes: Subscription = null;

    //private busquedaCallejeroComponent: BusquedaCallejeroPresu;
    //FLAGS
    adicionalesAdministrativos: boolean = false;
    busquedaInfructuosa: boolean = false;
    direccionValida: boolean = false;
    calleValida: boolean = false;
    buscaCallejero: boolean = false;
    geoCoding: boolean = false;
    busquedaManual: boolean = false;
    errorGeocoding: boolean = false;
    tengoDomicilio: boolean = false;
    viajeAhora: boolean = true;
    validacionOptativos: boolean = false;

    firstFormGroup: any;
    secondFormGroup: any;
    formGroup: FormGroup;


    //DATOS TEMPORALES PARA LA BúSQUEDA
    nombreCalle: string = '';
    alturaCalle: number;
    cuandoLlega: string = '';
    entreCalles: string = '';
    observacion: string;

    datosCalle: Direccion;          //Son los datos temporales que almaceno cuando encuentro la calle (sin haberle marcado una altura)
    puntoPedido: any;               //Datos que utilizo para luego hacer el submit, por ejemplo, cuando agrego un punto manualmente con el marcador.
    responseCalle: any;
    tipoViaje: string;             //Si es "programado" o "lo antes posible"
    programado: any[];
    datosAdministrativos: any;

    tipo: string = '';             //Para ver la acción del formulario, considero si el dato que estoy viendo es "altura" o "nombrecalle"

    //Variables del formulario
    errorDeCalle: boolean = false;
    errorDeAltura: boolean = false;
    errorDeInterseccion: boolean = false;
    horaMinima: string = "";
    horaMaxima: string = "24:00";
    domicilioSeleccionado: any;
    localidades_domicilios: any[];

    orderForm: FormGroup;
    direcciones: FormArray;



    funciones: any;
    buscadorCallejero: any;

    filteredOptions: Observable<objetoPorLocalidad[]>;
    filtradoInterseccion: Observable<objetoPorLocalidad[]>;

    minDate = new Date();
    maxDate = this.agregar_dias(new Date(), 1);
    //hora: string = this.maxDate.getHours().toString();
    //now = moment();

    constructor(
        private store: Store<AppState>,     //ngrx  (store)
        private _formBuilder: FormBuilder,
        private router: Router,
        private _api: ApiService,
        public _ubi: UbicacionService,
        private _dialog: PopupService,
        private busquedaCallejeroComponent: BusquedaCallejeroPresu,
    ) {
        this.funciones = new FnModificacionPresu(this._ubi);
        this.buscadorCallejero = new BusquedaCallejeroPresu(this._ubi, this.store);
    }

    ngOnDestroy() {
        this.subscripcionADomiciliosFrecuentes.unsubscribe();
    }

    ngOnInit() {
        this.reiniciar_datos(); //Carga los datos por defecto para el viaje (datos iniciales del formulario)

        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });

        let forms = [
            this._formBuilder.group({
                altura: [''],
                interseccion: [''],
                localidadControl: [''],
                calle: [''],
                cantidad: [''],
                observacion: [''],
                seleccion_buscador: [''],
                viajeProgramado: [''],
            }),
            this._formBuilder.group({
                altura: [''],
                interseccion: [''],
                localidadControl: [''],
                calle: [''],
                cantidad: [''],
                observacion: [''],
                seleccion_buscador: [''],
                viajeProgramado: [''],
            }),
        ];

        this.orderForm = this._formBuilder.group({
            //customerName: '',
            //email: '',
            direcciones: this._formBuilder.array(forms)
        });
        //this.addItem();

        this.subscripcionADomiciliosFrecuentes = this._ubi.observableDomiciliosFrecuentes$.subscribe(() => {
            var domicilioSeleccionado = this._ubi.domicilioSeleccionado;
            if (domicilioSeleccionado) {
                this.formGroup.patchValue({
                    calle: domicilioSeleccionado.calle,
                    altura: domicilioSeleccionado.altura,
                    interseccion: domicilioSeleccionado.interseccion,
                    localidadControl: domicilioSeleccionado.localidad,
                });
            }
        });

        this.store.select(state => state.viaje.coordenadas).subscribe((punto) => {
            //Esta función sirve para que cuando ingreso una dirección con una altura incorrecta, permita tomar un punto del mapa.
            //Sólo prestará atención al click en un punto cuando ya haya cargado un dato incorrecto.
            console.warn("Estoy en el subscribe del punto");
            var response: any;
            response = this.funciones.discernir(punto, this.calleValida, this.errorDeInterseccion, this.direccionValida, this.datosCalle, this.alturaCalle, this.busquedaManual, this.nombreCalle).subscribe((devolucion) => {
                console.log(devolucion);
                if (devolucion) {
                    this.puntoPedido = devolucion.puntoPedido;
                    this.direccionValida = devolucion.direccionValida;
                    this.geoCoding = devolucion.geoCoding;
                    this.nombreCalle = devolucion.nombreCalle;
                    if (this.geoCoding) {

                        this.errorGeocoding = devolucion.errorGeocoding;
                        if (devolucion.errorGeocoding) {
                            console.warn("Fui a getCallejero y no encontré nada...");
                            this.reiniciar_datos();
                            setTimeout(() => this.errorGeocoding = false, 10000);
                            return;
                        }

                        if (devolucion.interseccion != '')
                            devolucion.observaciones = ''
                        this.entreCalles = devolucion.observaciones;
                        this.formGroup.patchValue({
                            calle: this.nombreCalle,
                            altura: devolucion.alturaPosicionada,
                            interseccion: devolucion.interseccion,
                            localidadControl: devolucion.localidad,
                        });
                        this.formGroup.controls['altura'].enable();
                    }
                }
            });
        });

        //Tomo datos del SELECT de localidades.
        let observableLocalidad_ = this.formGroup.get("localidadControl").valueChanges.pipe(
            distinctUntilChanged()
        );
        observableLocalidad_.subscribe(value => {
            this._ubi.localidad = value;
        });

        //Datos de AUTOCOMPLETE de nombre de calle.
        this.filteredOptions = this.formGroup.get("calle").valueChanges.pipe(
            startWith<string | any>(''),
            debounceTime(500),
            distinctUntilChanged(),
            map(calle => this.busquedaCallejero_calle(calle)),    //Busqueda en callejero o en Photon
        );

        //Datos del INPUT de la altura de la calle
        let observableAltura_ = this.formGroup.get("altura").valueChanges.pipe(
            startWith<string | any>(''),
            debounceTime(500),
            distinctUntilChanged()
        );
        observableAltura_.subscribe(value => {
            //this.busquedaManual=true;
            if (!this.geoCoding)
                this.buscaCallejero ? this.busquedaCallejero_numeral(value) : this._filter(value, "altura")  //Busqueda en callejero o en Photon
        });

        //Datos del INPUT de la intersección de la calle
        this.filtradoInterseccion = this.formGroup.get("interseccion").valueChanges.pipe(
            startWith<string | any>(''),
            debounceTime(500),
            distinctUntilChanged(),
            map(calle => this.busquedaCallejero_numeral_interseccion(calle))    //Busqueda en callejero o en Photon
        );

        /*Búsqueda con Photon o callejero
                this.formGroup.get("seleccion_buscador").valueChanges.subscribe(valor => {
                    console.log("CAMBIO DEL TOGGLE", valor);
                    this.buscaCallejero = valor;
                });
        */


    }

    createDireccion(): FormGroup {
        return this._formBuilder.group({
            altura: [''],
            interseccion: [''],
            localidadControl: [''],
            calle: [''],
            cantidad: [''],
            observacion: [''],
            seleccion_buscador: [''],
            viajeProgramado: [''],
        });
    }

    addD(): void {
        this.direcciones = this.orderForm.get('direcciones') as FormArray;
        //this.direcciones.push(this.createItem());
    }


    /*BUSQUEDA CON EL CALLEJERO*/
    busquedaCallejero_calle(calle: any): objetoPorLocalidad[] {
        this.localidades_domicilios = [];

        if (calle && !this.geoCoding) {
            if (typeof (calle) != 'object') {  //Cuando tipeo una calle en el input pero no la selecciono en el select, paso por acá.
                var callesCoincidentes: objetoPorLocalidad[] = [];
                calle = this._ubi.eliminar_tildes(calle);
                this.nombreCalle = calle;
                this.errorGeocoding = false

                this._ubi.buscarCalle(calle).subscribe(response => {

                    this._ubi.localidades.forEach(localidadPosible => {
                        var elementoTemporal: objetoPorLocalidad;
                        elementoTemporal = {
                            localidad: '',
                            calles: [],
                        };
                        elementoTemporal.localidad = localidadPosible;
                        response.jsData.forEach(nombre => {
                            if (nombre.localidad.toLowerCase() == localidadPosible.toLowerCase())
                                elementoTemporal.calles.push(nombre)
                        })
                        if (elementoTemporal.calles.length > 0)
                            callesCoincidentes.push(elementoTemporal)
                    });
                });
                return callesCoincidentes;

            } else {  //Paso por aquí cuando seleccioné una calle del select.
                this.calleValida = true;
                this.nombreCalle = calle.nombre;
                console.warn(calle);
                this._ubi.localidad = calle.localidad
                this.datosCalle = calle;
                if (this.nombreCalle != '') {
                    //Posicionamiento inicial de la calle. Si no la encuentra, que vaya 100 más (hasta que la encuentre...)
                    this.busquedaCallejero_numeral('-1', true);
                    if (this.geoCoding) {
                        this.formGroup.patchValue({
                            altura: '',
                        });
                        this.geoCoding = false;
                    }
                    this.formGroup.controls['altura'].enable();
                    this.alturaInput.nativeElement.focus();
                }
            }
        }
    }

    busquedaCallejero_numeral(numeral: string, posicionamiento: boolean = false) {

        if (this.nombreCalle != '') {

            var altura = Number(numeral);
            var calle = this.nombreCalle;
            this._ubi.buscarNumeral(calle, numeral, this._ubi.localidad).subscribe(response => {
                if (response.jsData[0]) {
                    this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: response.jsData[0] });

                    this._ubi.localidad = response.jsData[0].localidad;
                    this.formGroup.patchValue({
                        localidadControl: this._ubi.localidad,
                    });

                    if (!posicionamiento && altura > 1) {
                        this.puntoPedido = {};
                        this.puntoPedido.lat = response.jsData[0].lat;
                        this.puntoPedido.lon = response.jsData[0].lon;
                        this.direccionValida = true
                        this.errorDeAltura = false;
                    }
                }
                else {
                    if (posicionamiento) {
                        return;
                    }
                    console.error("No se ha encontrado la altura!");
                    this.alturaCalle = Number(numeral);
                    this.errorDeAltura = true;
                    this.direccionValida = false;
                    this.busquedaInfructuosa = true;
                    this.busquedaManual = true;
                    this.interseccionInput.nativeElement.focus();
                }
            });
        }
        /*
              this.busquedaCallejeroComponent.busquedaCallejero_numeral(numeral, posicionamiento).subscribe((objeto)=>{

                this.direccionValida = objeto.direccionValida
                this.errorDeAltura = objeto.errorDeAltura;
                this.busquedaInfructuosa = objeto.busquedaInfructuosa;
                this.busquedaManual=objeto.busquedaManual;

                if (objeto.direccionValida){
                  this.puntoPedido=objeto.puntoPedido
                }
                else{
                  this.interseccionInput.nativeElement.focus();
                }
              });*/
    }

    busquedaCallejero_numeral_interseccion(interseccion: any): objetoPorLocalidad[] {
        if (interseccion && this.datosCalle != null) {
            if (typeof (interseccion) != 'object') {  //Cuando tipeo una calle en el input pero no la selecciono en el select, paso por acá.
                var callesCoincidentes: objetoPorLocalidad[] = [];
                interseccion = this._ubi.eliminar_tildes(interseccion);

                this._ubi.buscarCalle(interseccion, this._ubi.localidad).subscribe(response => {
                    this._ubi.localidades.forEach(localidadPosible => {
                        var elementoTemporal: objetoPorLocalidad;
                        elementoTemporal = {
                            localidad: '',
                            calles: [],
                        };
                        elementoTemporal.localidad = localidadPosible;

                        response.jsData.forEach(nombre => {
                            if (nombre.localidad.toLowerCase() == localidadPosible.toLowerCase())
                                elementoTemporal.calles.push(nombre)
                        })
                        if (elementoTemporal.calles.length > 0)
                            //var objetoCalle = new Direccion({name:nombre.nombre});
                            callesCoincidentes.push(elementoTemporal)
                    });
                });
                setTimeout(() => {
                    if (callesCoincidentes.length == 0) {
                        this.errorDeInterseccion = true;
                        this.busquedaInfructuosa = true;
                        this.alturaInput.nativeElement.focus();
                    }
                }, 1500);
                return callesCoincidentes;
            } else if (!this.direccionValida) {  //Paso por aquí cuando seleccioné una calle del select.
                var actual = this.nombreCalle;
                console.log(interseccion);
                this._ubi.buscarNumeral(actual, interseccion.nombre).subscribe(response => {
                    console.log(response);
                    if (response.jsData[0]) {
                        this.puntoPedido = {};
                        this.puntoPedido.lat = response.jsData[0].lat;
                        this.puntoPedido.lon = response.jsData[0].lon;
                        this.direccionValida = true;
                        this.errorDeInterseccion = false;
                        this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: response.jsData[0] });
                    } else {
                        this.errorDeInterseccion = true;
                        this.direccionValida = false;
                        this.busquedaInfructuosa = true;
                        this.busquedaManual = true;
                        this.alturaInput.nativeElement.focus();
                    }
                });
            }

        }
    }

    cambio_localidad_manual() {
        this.reiniciar_datos();
        //this.relocalizarMapaPhoton(value);
        this.relocalizarMapaPostgres(this._ubi.localidad);
    }

    relocalizarMapaPostgres(value: string) {
        this._ubi.obtener_xy_localidad(value).subscribe(respuesta => {
            this.dispatch_localidad([respuesta.jsData[0].lon, respuesta.jsData[0].lat]);
        })
    }

    /*FIN BUSQUEDA CON EL CALLEJERO*/

    /*BUSQUEDA CON PHOTON*/
    private _filter(input: any, tipo: string): Direccion[] {
        this.tipo = tipo;
        var string_query = '';
        if (this.tipo == "nombre_calle") {
            if (typeof (input) != 'object') {  //Cuando tipeo una calle en el input pero no la selecciono en el select, paso por acá.
                string_query = input.toLowerCase();
                this.nombreCalle = input;
                return this.busquedaPhoton(string_query);
            } else {  //Paso por aquí cuando seleccioné una calle del select.
                this.nombreCalle = input.name;
                this.datosCalle = input;
                this.formGroup.controls['altura'].enable();
                this.alturaInput.nativeElement.focus();
                this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: this.datosCalle });
            }
        }
        if (this.tipo == "altura") {
            string_query = input + ' ' + this.nombreCalle;
            return this.busquedaPhoton(string_query);
        }
    }

    busquedaPhoton(dire: any): Direccion[] {
        var string_query_photon: string;
        var dires: Direccion[] = [];

        if (dire != '') {
            string_query_photon = this._ubi.pais + ', ' + this._ubi.localidad + ', ' + dire;
        } else
            return;

        console.log('Búsqueda', string_query_photon);

        this.direccionValida = false;

        switch (this.tipo) {
            case "nombre_calle":
                var key = "highway";
                var value = "";
                break;
            case "altura":
                var key = "place";
                var value = "house_number";
                break;
            default:
                console.log("TIPO INCORRECTO!");
                return;
        }

        this._ubi.obtener_busqueda({ q: string_query_photon }, key, value).subscribe((result: any) => {

            var busquedaCorrecta: boolean = false;
            this.busquedaInfructuosa = false;

            if (result.type == 'FeatureCollection') {
                if (result.features.length == 0 && this.tipo == "altura") {
                    this.busquedaInfructuosa = true;
                }

                result.features.forEach((lugar: any) => {
                    var dir: Direccion = this.ordenar_dato_busqueda(lugar);

                    //dir.city = this._ubi.eliminar_tildes(dir.city);

                    if ((this.tipo == "nombre_calle") /*&& (dir.city == this._ubi.localidad)*/ && (dir.country == "Argentina")) {
                        busquedaCorrecta = !busquedaCorrecta;
                        dires.push(dir);
                        console.error("Estoy seteando mal CalleValida");
                        this.calleValida = true;
                    }

                    else if (this.tipo == "altura" && this.calleValida) {
                        this.busquedaInfructuosa = true;
                        if (!busquedaCorrecta) {
                            this.direccionValida = this.condiciones_direccionValida(dir);
                            this.puntoPedido = dir;
                            if (this.direccionValida) {
                                this.busquedaInfructuosa = false;
                                busquedaCorrecta = true;
                                console.log(dir);
                                this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: dir });
                            }
                            else {
                                //SI NO ENCUENTRO LA DIRECCION; QUE BUSQUE LA MÁS CERCANA
                                //VA a buscar 100 antes o 100 después, y así se va alejando hasta que la encuentra.
                            }
                            //return dires;
                            //dires.push(dir);
                        }
                    }
                });

                if ((!busquedaCorrecta) && (this.busquedaInfructuosa) && this.datosCalle) {
                    console.warn("DISPATCH");
                    this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: this.datosCalle });

                }
            }
        });

        return dires;
    }

    condiciones_direccionValida(dir: Direccion): boolean {
        if (
            (dir.street == this.nombreCalle) &&
            (Number(dir.housenumber) == this.alturaCalle) &&
            /*(dir.city == this._ubi.localidad) &&*/
            (dir.country == "Argentina")
        ) {
            console.warn("LUGAR ENCONTRADO!");
            return true;
        }
        console.error("NO ENCONTRÉ");
        return false;
    }


    ordenar_dato_busqueda(lugar: any): Direccion {
        let coords = lugar.geometry.coordinates;
        let dire = new Direccion(lugar.properties);

        dire.lat = coords[1];
        dire.lon = coords[0];

        return dire;
    }

    relocalizarMapaPhoton(value: string) {
        var busqueda = this._ubi.pais + ', ' + value;
        this._ubi.obtener_busqueda({ q: busqueda }, "place", 0).subscribe((result: any) => {
            for (var i = 0; i < result.features.length; i++) {
                switch (value) {
                    case "Centenario":
                        if (result.features[i].properties.state == "Neuquén") {
                            this.dispatch_localidad(result.features[i].geometry.coordinates);
                            return;
                        }
                        break;

                    case "San Carlos":
                    case "San Lorenzo":
                    case "Abasto":
                        if (result.features[i].properties.state == "Buenos Aires") {
                            this.dispatch_localidad(result.features[i].geometry.coordinates);
                            return;
                        }
                        break;

                    default:
                        this.dispatch_localidad(result.features[i].geometry.coordinates);
                        return;
                }
            }
        });
    }
    //FIN BÚSQUEDA PHOTON

    dispatch_localidad(valor: any) {
        var enviar = new Direccion;

        enviar.lon = valor[0];
        enviar.lat = valor[1];

        /*Posicionamiento mediante el "extend"
        enviar.lon = (valor.extent[0] + valor.extent[2]) / 2;
        enviar.lat = (valor.extent[1] + valor.extent[3]) / 2;
  */
        this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: enviar });
    }

    ubicar() {
        this._ubi.obtener_coordinadas_actuales();
    }

    displayCalle(lugar?: any): string | undefined {
        //BÚSQUEDA DEL NOMBRE DE LA CALLE
        if (typeof (lugar) == "string") {
            return lugar;
        }
        let direccion = '';
        if (!lugar)
            return direccion;
        if (lugar.nombre /*&& lugar.city*/)
            direccion = lugar.nombre;
        return lugar ? direccion : undefined;
        //IF LUGAR.CITY != de la elegida en el select, cambiarla.
    }

    focusCalle() {
        if (this.formGroup.get("altura").value) {
            this.reiniciar_datos();
        }
    }

    focusAltura() {
        if (!this.datosCalle && !this.geoCoding)
            this.errorDeCalle = true;
    }

    blurCalle() {
        this.formGroup.controls['altura'].enable();
    }

    reiniciar_datos() {
        //Reset de variables
        this.errorDeCalle = false;
        this.errorDeAltura = false;
        this.errorDeInterseccion = false;
        this.busquedaInfructuosa = false;
        this.direccionValida = false;
        this.geoCoding = false;
        this.busquedaManual = false;
        this.tengoDomicilio = false

        this.calleValida = false;
        this.datosCalle = null;
        this.puntoPedido = null;
        this.alturaCalle = null;
        this.nombreCalle = "";
        this.entreCalles = '';


        let vaciarCoordenadasDeClick = new Direccion;
        //this.store.dispatch({ type: CLICK_MAPA, coordenadas: vaciarCoordenadasDeClick });

        this.limpiar_formulario();
    }

    limpiar_formulario() {

        this.horaMinima = moment(this.minDate).add(30, 'minutes').format('HH:mm');
        //Reset de formulario
        this.formGroup.reset({
            altura: '',
            localidadControl: this._ubi.localidad,
            calle: '',
            fechaeventual: this.minDate,
            horaeventual: this.horaMinima,
            cantidad: 1,
            observacion: false,
            seleccion_buscador: this.buscaCallejero,
            interseccion: '',
            viajeProgramado: false,
        });
        this.formGroup.controls['altura'].disable();


    }

    ngAfterViewInit() {
        this.buscaCallejero = true;
        setTimeout(() => {
            this.calleInput.nativeElement.focus();
        }, 500);
    }

    agregar_dias(dt, n) {
        return new Date(dt.setDate(dt.getDate() + n));
    }

    /*
        onSubmit() {
            //console.warn(this.observacion);
            let formulario = this.formGroup.getRawValue();


            formulario['calle'] = this.nombreCalle;
            formulario['lat'] = this.puntoPedido.lat;
            formulario['lon'] = this.puntoPedido.lon;
            formulario['localidad'] = this._ubi.localidad;
            delete formulario['seleccion_buscador'];


            if (formulario.interseccion) {
                if (typeof (formulario.interseccion) != "string")
                    formulario.interseccion = formulario.interseccion.nombre
                formulario['calle'] += ' y ' + formulario['interseccion'];
                delete formulario['interseccion'];
            }

            if (!formulario['altura'])
                formulario['altura'] = 0
            formulario['idpasajero'] = 0;
            this._dialog.abrir({
                width: '400px',
                height: '400px',
                data: { pregunta: "¿Desea confirmar el pedido?", titulo: formulario['calle'] + ' ' + formulario['altura'], bajada: formulario['observacion'], fecha: formulario.fechaeventual, hora: formulario.horaeventual }
            }).subscribe(datos => {
                if (datos) {
                    if (this.adicionalesAdministrativos)
                        Object.assign(formulario, this.datosAdministrativos);
                    this.mandar_formulario(formulario);

                } else {
                    // User clicked 'Cancel' or clicked outside the dialog
                }
            });
        }
        */

    onSubmit() {
        //coordinates=8.34234,48.23424%7C8.34423,48.26424
        let coords = {
            coordinates: '-57.552895,-38.058795' + '|' + '-57.54731,-37.98941',
            preference: 'shortest',
        }

        let trayecto = this._ubi.trazar_ruta(coords);
        if (trayecto) {
            console.log('Trayecto', trayecto);
        }
    }


    mandar_formulario(datos) {
        this._api.post('nuevoViaje', datos).subscribe(response => {
            //this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: datos });
            this.reiniciar_datos();     //Al hacer click en "Confirmar viaje", se limpian los datos del formulario (para posibilitar que luego se realice otro pedido)
        },
            error => {
                console.log(<any>error);
            }
        );
    }
}
