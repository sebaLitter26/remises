import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private headers: any = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    sessionid: string;
    url_pedidos: string = '';
    constructor(
        public _http: HttpClient
    ) {
        this.url_pedidos = window.location.protocol + '//' + window.location.hostname + '/' + GLOBAL.path_ws;
        //this.url_pedidos = 'https://desa.avelo.com.ar/'+GLOBAL.path_ws;   //DESARROLLO
        console.error('creacion ApiService', Date());
    }

    post(modulo, params, administracion = false): Observable<any> {
        var url_absoluta: string = this.url_pedidos;
        //let jsondata = JSON.stringify(params);
        this.cargar_storage();
        //console.log('post sessionid', this.sessionid);
        if (this.sessionid)
            params['sessionid'] = this.sessionid;
        var jsondata = this.json_to_string(params);
        if (administracion) {
            url_absoluta = GLOBAL.url_administracion;
            jsondata = 'json=' + JSON.stringify(params);
        }
        return this._http.post(url_absoluta + modulo, jsondata, { headers: this.headers });
    }

    postSincronico(modulo, params): Observable<any> {
        //let jsondata = JSON.stringify(params);
        if (this.sessionid)
            params['sessionid'] = this.sessionid;
        let jsondata = this.json_to_string(params);
        return this._http.post(this.url_pedidos + modulo, jsondata, { headers: this.headers });
    }

    otro_post(url, modulo, params): Observable<any> {
        let jsondata = 'json=' + JSON.stringify(params);
        return this._http.post(url + modulo, jsondata, { headers: this.headers });
    }

    put(modulo, params, administracion = false): Observable<any> {
        let jsondata = 'json=' + JSON.stringify(params);
        var url_absoluta: string = this.url_pedidos;
        //console.log(modulo, administracion);
        if (administracion)
            url_absoluta = GLOBAL.url_administracion;
        return this._http.put(url_absoluta + modulo, jsondata, { headers: this.headers });
    }

    get(modulo, params = null, administracion = false): Observable<any> {
        //let jsondata = (params )? 'json='+JSON.stringify(params) :'';
        var url_absoluta: string = this.url_pedidos;
        if (administracion)
            url_absoluta = GLOBAL.url_administracion;
        return this._http.get(url_absoluta + modulo, { params: params, headers: this.headers });
    }

    geocoding(modulo, params: any): Observable<any> {
        //params['format'] = 'jsonv2';
        //console.log("dire", params);
        let jsondata = this.json_to_string(params[0]);

        let filtroPhoton: string = '';

        if (params[1]) {
            filtroPhoton += params[1];
        }
        if (params[2]) {
            filtroPhoton += ':' + params[2];
        }

        if (filtroPhoton != '') {
            filtroPhoton = '&osm_tag=' + filtroPhoton;
        }

        console.log(filtroPhoton);
        console.log("jsondata", jsondata, params);
        //let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${params.lat}&lon=${params.lon}`;
        let url = GLOBAL.url_geolocalizacion + modulo + '/?' + jsondata + filtroPhoton;


        return this._http.get(url, { headers: this.headers });
    }



    rutas(modulo, params: any): Observable<any> {
        //params['format'] = 'jsonv2';


        params['api_key'] = '5b3ce3597851110001cf6248eba0c58cf083401ba2a6a39676ba0490';
        params['profile'] = 'driving-car';
        params['format'] = 'geojson';
        params['language'] = 'es';

        let jsondata = this.json_to_string(params);

        let url = GLOBAL.url_trazar_rutas + modulo + '/?' + jsondata;

        //console.log("dire RUTAS", url);
        return this._http.get(url, { headers: this.headers });
    }

    delete(modulo, params = null, administracion = false): Observable<any> {
        var url_absoluta: string = this.url_pedidos;
        let jsondata = (params) ? JSON.stringify(params) : '';
        if (administracion)
            url_absoluta = GLOBAL.url_administracion;
        return this._http.delete(url_absoluta + modulo + jsondata, { headers: this.headers });
    }

    json_to_string(params: any) {
        return Object.entries(params).map(e => e.join('=')).join('&');
    }

    guardar_storage() {
        if (this.sessionid) {
            localStorage.setItem("sessionid", this.sessionid);
        } else {
            localStorage.removeItem("sessionid");
        }
    }

    cargar_storage() {
        if (localStorage.getItem("sessionid")) {
            //Existen items en el localstorage
            this.sessionid = localStorage.getItem("sessionid");
        }
    }

    borrar_session() {
        this.post('cerrarSesion', {}).subscribe(valor => {
            console.log('cerrarSession', valor);

        });
        this.sessionid = null;
        this.guardar_storage();
    }
}
