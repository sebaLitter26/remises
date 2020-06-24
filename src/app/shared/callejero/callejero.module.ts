
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// NgRx
import { StoreModule } from '@ngrx/store';

import { MapaCallejeroComponent } from './mapa_editar_callejero.component';

import { EditarCalleComponent } from './editar-calle/editar-calle.component';

import { MaterialModule } from '../../material.module';

// Rutas
import { CALLEJERO_ROUTES } from './callejero-routing.module';

import { CallejeroReducers } from '../../store/callejero.reducers';


@NgModule({
    imports: [
        RouterModule.forChild(CALLEJERO_ROUTES),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('callejero', CallejeroReducers),
        MaterialModule

    ],
    declarations: [
        MapaCallejeroComponent,
        EditarCalleComponent
    ],
    exports: [
    ],
    entryComponents: [
      
    ],
    //schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
})
export class CallejeroModule { }
