import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/administracion.models/cliente';
import { ApiService } from '../../services/api.service';

@Injectable({
    providedIn: 'root'
})
export class AbmService {

    public url_modulo = 'cliente';
    //url_modulo: string;

    constructor(
        public _api: ApiService,
    ) {
        console.error('creacion AbmService', Date());
    }

    lectura(): Observable<any> {
        return this._api.get(this.url_modulo, null, true);
    }

    lectura_otro_modulo(url_otro_modulo, params): Observable<any> {
        return this._api.get(url_otro_modulo, params, true);
    }

    verRegistro(id): Observable<any> {
        return this._api.get(this.url_modulo + '/' + id, null, true);
    }

    baja(id): Observable<any> {
        return this._api.delete(this.url_modulo + id, null, true);
    }

    alta_modificacion(objeto): Observable<any> {
        if (objeto.id) {
            return this._api.put(this.url_modulo + '/' + objeto.id, objeto, true);
        } else {
            return this._api.post(this.url_modulo, objeto, true);
        }
    }

    filtrado(objeto): Observable<any> {
        return this._api.post('filtrados', objeto, true);
    }

    getURL(): string {
        return this.url_modulo;
    }

    setURL(url: string) {
        console.log('setURL', url);
        this.url_modulo = url;
    }

}
