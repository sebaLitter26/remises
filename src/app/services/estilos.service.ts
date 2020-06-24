import { Injectable } from '@angular/core';

//import { UbicacionService } from './index/index.services';

@Injectable()
export class EstilosService {

    private themeWrapper = document.querySelector('body');

    constructor(
        //private _ubi: UbicacionService,

        //private store: Store<AppState>     //ngrx
    ) { }
    /*
        onSubmit(form) {
            this.global(form.value);
        }
        */

    global(stylesheet) {


        // Navigation Styles
        if (stylesheet.colorletra) {
            this.themeWrapper.style.setProperty('--navColor', stylesheet.colorletra);
        }
        if (stylesheet.colorfondo) {
            this.themeWrapper.style.setProperty('--navBackground', stylesheet.colorfondo);
        }

        // Card Styles
        if (stylesheet.foto) {
            let url_foto = 'https://' + stylesheet.hostname + stylesheet.foto + 'logo.jpg';
            //console.log('foto', url_foto);
            this.themeWrapper.style.setProperty('--fotoLogin', url_foto);
        }


    }

}
