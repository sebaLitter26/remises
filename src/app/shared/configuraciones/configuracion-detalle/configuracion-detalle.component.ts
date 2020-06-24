import { Component } from '@angular/core';


import { ConfiguracionService } from './../configuracion.service';
/**
 * @title Table with a sticky columns
 */
@Component({
    selector: 'app-configuracion-detalle',
    templateUrl: './configuracion-detalle.component.html',
    styleUrls: ['./configuracion-detalle.component.scss'],
})
export class ConfiguracionDetalleComponent {

    configuracion_seleccionado: any;

    displayedColumns =
        ['descripcion', 'permisoshabilitados'];//, 'star'];

    constructor(private _configuraciones: ConfiguracionService, ) {
        this._configuraciones.getParametro().subscribe(configuracion_detalle => { this.configuracion_seleccionado = configuracion_detalle; });
    }
}
