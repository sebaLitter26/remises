import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApiService } from './api.service';
import { EstilosService } from './estilos.service';


import { MatSnackBar } from '@angular/material';
import { Router, RouterLinkActive } from '@angular/router';

//import { NavbarComponent } from '../shared/index.components';

import { Direccion, Viaje } from '../models/index.models';

import { of, Observable, Subject, throwError } from 'rxjs';

import { take, map, catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import * as actions from '../store/actions';


import {
    MODIFICACION_VIAJE,
    CARGAR_NUEVO_VIAJE,
    CARGAR_MOVILES,
    CARGAR_LOCALIDADES
} from '../store/actions';

import { APP_ROUTES } from '../app-routing.module';


@Injectable({
    providedIn: 'root'
})
export class UbicacionService {

    private buscadorDeDomicilios = new Subject<void>();
    public observableDomiciliosFrecuentes$ = this.buscadorDeDomicilios.asObservable();

    domicilioSeleccionado: any;
    pais: string;
    viajes: any[];
    moviles: any[];
    navItems$: Observable<any[]> = null;
    domiciliosPasajero: any[];
    rutaInicio: string;
    rutaInicioDespacho: string;
    routa: any = [''];
    ruteoInicial: boolean = true;
    promesa_menu: any;
    isPasajero: boolean = false;
    localidadesCargadas: boolean = false;
    camposObligatorios: boolean = false;
    camposAdministrativos: any[];

    zonas: any;

    usuario_logueado: boolean = false;
    usuario: any = null;

    hostname: any;

    subscripciones_pedidos: boolean = false;

    localidades: string[];
    localidad: string = 'Localidad';
    coords = { lat: -34, lon: -54 };



    constructor(
        private _api: ApiService,
        public snackBar: MatSnackBar,
        private router: Router,
        private _estilos: EstilosService,
        private store: Store<AppState>     //ngrx
    ) {
        console.error('creacion UbicacionService', Date());
    }

    obtener_coordinadas_actuales(coords = null) {

        //  return new Observable(observer => {

        //var dire = new Direccion();
        console.warn("Obtener coordinadas actuales");
        if (!coords) {
            //var coordenadas;
            if (this.usuario_logueado) {
                navigator.geolocation.getCurrentPosition(
                    (pos: any) => {
                        //console.log(`More or less ${pos.coords.accuracy} meters.`, pos);
                        let dire = { lat: +pos.coords.latitude, lon: +pos.coords.longitude };
                        //observer.next(coordenadas);
                        this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: dire });
                    },
                    (err) => {
                        let dire = { lat: +this.hostname.lat, lon: +this.hostname.lon };
                        this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: dire });
                        console.warn(`ERROR(${err.code}): ${err.message}`);
                        //observer.next(coordenadas);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            } else {
                if (this.hostname) {
                    //coordenadas = { lat: +this.hostname.lat, lon: +this.hostname.lon };
                    let dire = { lat: +this.hostname.lat, lon: +this.hostname.lon };
                    this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: dire });
                }
            }
        } else {
            let dire = { lat: +this.hostname.lat, lon: +this.hostname.lon };
            //console.warn(`ERROR(${err.code}): ${err.message}`);
            this.store.dispatch({ type: MODIFICACION_VIAJE, viaje: dire });

        }
        //  }).pipe(take(1));
    }


    getDomiciliosPasajero() {
        console.log(this.isPasajero);
        if (this.isPasajero) {
            this._api.post('getPasajerosDomicilios', { idpasajero: this.usuario.idpasajero }).subscribe(response => {
                this.domiciliosPasajero = response.jsData;
                //console.warn(this.domiciliosPasajero);
            });
        }
    }

    cambioDeDomicilio() {
        this.buscadorDeDomicilios.next();
    }


    cerrar_session() {
        this._api.borrar_session();
        this.usuario_logueado = false;
        this.subscripciones_pedidos = false;
        delete (this.domiciliosPasajero);
        this.isPasajero = false;
        this.router.navigate(['']);
    }

    traeme_el_menu() {

        
        if(this.navItems$ == null){
            this.promesa_menu = this._api.post('getBotonesMenu', {}).pipe(
                take(1),
                map(resp => resp['jsData'][0]),
                catchError((err: any) => {
                    let msg = '';
                    this.error_logueo(err);
                    return throwError(err);
    
                }));
            }

        

        this.promesa_menu.subscribe(response => {

            this.navItems$ = of(response.botones_menu);
            this.rutaInicio = "";
            this.rutaInicioDespacho = response.default_route;

            console.log('rutaInicio '  , this.rutaInicio, response);
            console.log('router', this.router.url); 

            APP_ROUTES.forEach( (ruta:any)=>{
                if( ruta.path ==  response.default_route){
                    this.rutaInicio = response.default_route;
                }
            });


            console.log('rutaInicio2 ' , this.rutaInicio, this.rutaInicioDespacho);

            this.routa =  (this.rutaInicio=="") ? ['despacho', this.rutaInicioDespacho] : [this.rutaInicio];
            this.router.navigate(this.routa);
            
            //if (this.rutaInicio != "pedidos" && this.ruteoInicial == true && window.location.hash == '#/')
            // this.router.navigate(['despacho', this.rutaInicio]);
            this.ruteoInicial = false;
        });
        

    }


    trazar_ruta(coords) {
        return this._api.rutas('directions', coords).pipe(
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        ).subscribe(response => {
            if (response.features.length > 0) {

                let resp = {
                    coords: this.get_obj_propiedad(response.features[0], 'coordinates'),
                    segments: this.get_obj_propiedad(response.features[0], 'segments'),
                }
                console.log(resp);
                return resp;

            } else
                return false;
        });
    }


    validar_usuario(identificacion) {
        this._api.post('validarUsuario', identificacion).subscribe(response => {
            this._api.sessionid = response.sessionid;
            this.ruteoInicial = true;
            this.carga_hostname(response);
            //this.hostname = response.hostname;
            //this.usuario = response.usuario;
            this.usuario_logueado = true;
            this._api.guardar_storage();

            //this._navbarrita.cargar_localidad();
            //this.obtener_viajes_usuario();
            //this.posicionarse_mapa();


            //if (response.usuario.estado != '1')
            //this.router.navigate(['/despacho']);

        }, error => {
            console.log(error);
            if (error.error.codigo == 90) {
                //this.router.navigate(['pedidos']);
                this.router.navigate(this.routa);
                //this.router.navigate([{ outlets: { primary: ['pedidos']}]);

            } else if (error.error.codigo > 0) {
                this.snackBar.open(error.error.descripcion, 'OK', {
                    //duration: 5000,
                });
            }
        }
        );

    }


    checkeo_inicial_logueado() {
        this._api.cargar_storage();
        this.validar_hostname(true);
        //this.obtener_viajes_usuario(true);
    }


    getMoviles() {
        return this._api.post('getMoviles', {}).pipe(
            map(resp => resp['jsData']),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        );
    }


    obtener_moviles() {
        this.subscripciones_pedidos = this.router.url.includes("pedidos");

        if (this.subscripciones_pedidos) {
            this.store.dispatch(new actions.CargarMoviles());
            setTimeout(() => { this.obtener_moviles(); }, 10000);
        }
    }

    borrar_calle_ubi(elimina_calle) {
        return this._api.post('borrarTramo', elimina_calle);

    }




    actualizar_calle_ubi(calle_modificada) {
        //console.log('calle_modificada', calle_modificada);
        return this._api.post('actualizarTramo', calle_modificada);
    }


    getViajes() {
        return this._api.post('getViajesUsuario', {}).pipe(
            map(resp => this.modificar_viajes(resp['jsData'])),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
            /*            this.viajes.forEach((viaje: any) => {
                            viaje['estilos'] = this.get_estado(viaje.estado);
                        });*/
        );
    }


    modificar_viajes(viajes: Viaje[]) {
        viajes.forEach((viaje: any) => {
            viaje['estilos'] = this.get_estado(viaje.estado);
        });
        //this.viajes=viajes;
        return viajes;
    }


    obtener_viajes_usuario() {
        this.subscripciones_pedidos = this.router.url.includes("pedidos");

        if (this.subscripciones_pedidos) {
            this.store.dispatch(new actions.CargarViajesEffects());
            setTimeout(() => { this.obtener_viajes_usuario() }, 10000);
        }

    }




    borrar_zona_ubi(elimina_zona) {
        return this._api.post('borrarZona', elimina_zona);

    }

    agregar_zona_ubi(agregar_zona) {
        return this._api.post('agregarZona', agregar_zona).pipe(
            map(resp => resp['jsData']),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        );
    }




    actualizar_zona_ubi(zona_modificada) {
        console.log('zona_modificada', zona_modificada);
        return this._api.post('actualizarZona', zona_modificada);
    }


    error_logueo(resp) {
        let error = resp['error'];
        console.log('Descripcion del Error ', error['descripcion']);
        if (error.codigo == 2 || resp.status >= 400) {
            this.snackBar.open(error.descripcion, 'OK', {
                duration: 5000,
            });
            this.router.navigate(this.routa);
            //this.router.navigate(['pedidos']);
        }

        //else return resp['jsData'];

    }





    tramos_callejero(localidad) {
        this.store.dispatch(new actions.CargarCallejeroEffects(localidad));
    }

    getCallejero(localidad) {
        return this._api.post('getCallejeroXY', localidad).pipe(
            map(resp => resp['jsData']),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        );
    }

    getCallejeroDescripcion(localidad) {
        return this._api.post('getCallejeroXYDescripcion', localidad).pipe(
            map(resp => resp['jsData']),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        );
    }

    getFormularioCallejero() {
        return this._api.post('getFormularioCallejero', {}).pipe(
            map(resp => resp['jsData']),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        );
    }

    get_estado(estado: number) {
        let pedido = { color: 'white', background: 'black', blink: true, texto: 'Viaje' };
        switch (+estado) {
            case 0:  //Pendiente  verde
            //pedido = { color: 'white', background: '#13E833', blink: false, texto: 'Pendiente' };
            case 93:
            case 94:  //Pendiente  verde
                pedido = { color: 'white', background: '#13E833', blink: false, texto: 'Pendiente' };
                break;
            case 1:  //Buscando Movil
            case 96:
            case 98:
                pedido = { color: 'black', background: '#CBFFD2', blink: true, texto: 'Buscando Movil ' };
                break;
            case 2:   //Asignado  naranja

            case 3:    //Asignado   naranja
                pedido = { color: 'white', background: 'orange', blink: false, texto: 'Asignado' };
                break;
            case 4:    //En Domicilio   narnaja blink
                pedido = { color: 'black', background: 'orange', blink: true, texto: 'En Domicilio' };
                break;
            case 5:    //Iniciado    rojo
                pedido = { color: 'black', background: 'red', blink: false, texto: 'Iniciado' };
                break;
            case 6:    //Finalizado  rojo blink

            case 7:    //Finalizado  rojo blink
                pedido = { color: 'black', background: 'red', blink: true, texto: 'Finalizado' };
                break;

            case 97:  //Negativo     rojo blink
                pedido = { color: 'white', background: 'red', blink: true, texto: 'Negativo' };
                break;

            case 99:   //Anulado
                pedido = { color: 'white', background: 'blue', blink: false, texto: 'Anulado' };
                break;
            default:

        }

        return pedido;
    }


    validar_hostname(primera_vez: boolean) {
        this._api.post('validarHostname', {}).subscribe(response => {
            if (primera_vez) {
                this.carga_hostname(response);
            }


        }, error => {

            if (error.error.codigo > 0) {
                console.log(error);
                setTimeout(() => { this.validar_hostname(false) }, 10000);
                //this.hostname = error.error.hostname;
                this.carga_hostname(error.error);

                this.cerrar_session();

                this.snackBar.open(error.error.descripcion, 'OK', {
                    duration: 5000,
                });
            }
        }
        );



    }



    carga_hostname(response: any) {


        this.usuario = response.usuario;
        this.hostname = response.hostname;

        console.log('hostname ', this.hostname);
        //this.obtener_coordinadas_actuales();
        this.localidades = response.hostname.localidad.split(',');

        this.cargar_localidades().subscribe(response => {
            console.log('Cargo Localidades',response);
         });
        this._estilos.global(this.hostname);

        this.pais = response.hostname.pais;

        if (this.usuario.idpasajero) {
            this.isPasajero = true;
        }

        if (this.usuario.idusuario) {
            this.usuario_logueado = true;
            //this.subscripciones_pedidos = true;

            this.obtener_viajes_usuario();
            this.obtener_moviles();
            this.getCamposAdministrativos();

            if (this.ruteoInicial) { 
                this.traeme_el_menu();
                
            }

        } else {
            this.usuario_logueado = false;
        }
    }

    cargar_localidades(): Observable<any> {

        return new Observable(observer => {
            if (!this.localidadesCargadas) {
                var i = 0;
                this.localidades.forEach(ciudad => {
                    ciudad = this.eliminar_tildes(ciudad);
                    this.localidades[i] = ciudad;
                    i++;
                });
                this.localidad = this.localidades[0];

                this.obtener_xy_localidad(this.localidad).subscribe((respuesta) => {
                    this.coords = { lat: +respuesta.jsData[0].lat, lon: +respuesta.jsData[0].lon };
                    console.warn("Estas son las coordenadas de %s : ", this.localidad, this.coords)
                    this.store.dispatch({ type: CARGAR_LOCALIDADES, localidades: this.localidad });
                    this.localidadesCargadas = true;
                    observer.next(this.localidadesCargadas);
                    observer.complete();
                });
            }else {
                observer.next(this.localidadesCargadas);
                observer.complete();
            }

        });


    }


    getZonas() {
        return this._api.post('getZonasConfig', {}).pipe(
            map(resp => resp['jsData']),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        );
        //console.log('zonas', this.zonas);
        /*
        response.jsData.forEach(respuesta => {
            if (respuesta.obligatorio == 1)
                this.camposObligatorios = true
        });
        */
        //});
    }

    getCamposAdministrativos() {
        this._api.post('getCamposUsuario', {}).pipe(
            map(resp => resp['jsData']),
            catchError((err: any) => {
                let msg = '';
                this.error_logueo(err);
                return throwError(err);

            })
        ).subscribe(response => {
            this.camposAdministrativos = response;
            console.log('getCamposAdministrativos', this.camposAdministrativos);
            response.forEach(respuesta => {
                if (respuesta.obligatorio == 1)
                    this.camposObligatorios = true
            });
        });
    }

    eliminar_tildes(ciudad: string): string {
        ciudad = ciudad.replace(/á/gi, "a");
        ciudad = ciudad.replace(/é/gi, "e");
        ciudad = ciudad.replace(/í/gi, "i");
        ciudad = ciudad.replace(/ó/gi, "o");
        ciudad = ciudad.replace(/ú/gi, "u");
        return (ciudad);
    }


    obtener_info_viaje(id_viaje: number, id_movil: number) {
        return this._api.post('getViajeLog', { idviaje: id_viaje, idmovil: id_movil });
    }


    cancelar_viaje(id_viaje: number) {
        return this._api.post('anularViaje', { idviaje: id_viaje });
    }
    /*
        buscarCalle(params): Promise<any> {
          return new Promise((resolve, reject)=>{
            this._api.post('getCalle', { calle: params }).subscribe(success=>{
              console.warn("Llegó la respuesta", success);
              resolve (success);
            });
          });
        }
        */

    buscarCalle(params, localidad: string = ''): Observable<any> {
        return this._api.post('getCalle', { calle: params, localidad: localidad });
    }

    buscarCalleSincronica(params): Observable<any> {
        return this._api.postSincronico('getCalle', { calle: params });
    }

    /*
    async buscarCalle(params){
      const response = await this._api.post('getCalle', { calle: params }).toPromise() ;
      return response.json();
    }
    */
    buscarNumeral(calle, altura, localidad: string = ''): Observable<any> {
        return this._api.post('getNumeral', { calle: calle, altura: altura, localidad: localidad });
    }

    reverseGeocoding(lat, lon): Observable<any> {
        return this._api.post("getCallejeroXY", { lat: lat, lon: lon });
    }

    obtener_direccion_reverse(coordenadas): Direccion | undefined {
        var direccion: Direccion = undefined;
        console.log('coords', coordenadas);
        this._api.geocoding('reverse', coordenadas).subscribe(response => {

            if (response.features.length > 0) {
                console.log("obtener_direccion", response);

                let coords = this.get_obj_propiedad(response.features[0], 'coordinates');
                direccion = this.get_obj_propiedad(response.features[0], 'properties');
                direccion.lat = coords[1];
                direccion.lon = coords[0];

                console.log('direccion ', direccion);

                //if ((direccion.osm_value == "house_number" || direccion.osm_value == "house") && direccion.osm_key == 'place') {
                this.store.dispatch({ type: CARGAR_NUEVO_VIAJE, direccion: direccion });
                //}

            } else
                console.log(response);
        },
            error => {
                console.log(<any>error);

            }
        );
        return direccion;
    }


    get_obj_propiedad(b, quebusco) {
        for (let a in b) {
            if (a == quebusco) {
                return b[a];
            }
            if (typeof (b[a]) == 'object') {
                let ret = this.get_obj_propiedad(b[a], quebusco);
                if (ret !== false) {
                    return ret;
                }
            }
        }
        return false;
    }


    obtener_xy_localidad(value) {
        return this._api.post('getLocalidadXY', { localidad: value });
    }

    obtener_busqueda(direccion, key, value) {
        console.log(direccion, key, value);
        let params = [direccion, key, value];
        //direccion['nat_name'] = 'Argentina';
        return this._api.geocoding('api', params);
    }

    obtener_coordinadas(dire): Direccion | undefined {
        var direccion: Direccion = undefined;
        this._api.geocoding('api', dire).subscribe(response => {

            let coords = this.get_obj_propiedad(response.features[0], 'coordinates');


            let coordinadas = { lat: coords[1], lon: coords[0] };

            //direccion = this.obtener_direccion(coordinadas);


        },
            error => {
                console.log(<any>error);
            }
        );
        return direccion;
    }
    /*
        redibujar_mapa(d){
          si abro o cierro el sidenav
          llamo a
          initOSM() de mapa.component

        }
    */

}
