import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { PopupDialogComponent } from '../shared/popup/popup.component';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Injectable({
    providedIn: 'root'
})
export class PopupService {

    dialog_open: boolean = false;
    dialog_instance: any;

    constructor(
        public dialog: MatDialog,
        private router: Router,
    ) { }

    abrir(datos_popup, componente = 'modificacion'): any {
        this.dialog_instance = this.dialog.open(PopupDialogComponent, datos_popup);

        console.log(datos_popup);
        console.log("Abro popup", componente);
        //Acá crea el módulo Popup

        this.dialog_open = true;
        //this.router.navigate(['popup', { outlets: { popup: [componente, datos_popup] } }]/*, { skipLocationChange: true }*/);
        //this.router.navigate(['popup/' + componente ], { skipLocationChange: true });
        var ruta: string = 'popup/' + componente;
        this.router.navigate([{ outlets: { popupOutlet: 'popup/' + componente } }], { skipLocationChange: true });

        return this.dialog_instance.afterClosed();
    }

    cerrar(datos) {
        console.log('cerro popup', datos, this.dialog_open);
        this.dialog.closeAll();
    }
}
