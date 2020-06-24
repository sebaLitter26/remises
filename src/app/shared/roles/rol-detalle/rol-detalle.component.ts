import { Component } from '@angular/core';


import { RolesService } from './../roles.service';
/**
 * @title Table with a sticky columns
 */
@Component({
    selector: 'app-rol-detalle',
    templateUrl: './rol-detalle.component.html',
    styleUrls: ['./rol-detalle.component.scss'],
})
export class RolDetalleComponent {

    rol_seleccionado: any;

    displayedColumns =
        ['descripcion', 'permisoshabilitados'];//, 'star'];

    constructor(private _roles: RolesService, ) {
        this._roles.getRol().subscribe(rol_detalle => { this.rol_seleccionado = rol_detalle; });
    }
}
