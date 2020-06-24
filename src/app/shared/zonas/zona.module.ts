
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, CanLoad } from '@angular/router';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { appReducers } from '../../store/app.reducer';
import { effectsArr } from '../../store/effects';




import { MapaZonasComponent } from './mapa_editar_zona.component';
import { EditarZonaComponent } from './editar-zona/editar-zona.component';

import { MaterialModule } from '../../material.module';

// Rutas
import { ZONAS_ROUTES } from './zonas-routing.module';

import { CallejeroReducers } from '../../store/callejero.reducers';


@NgModule({
    imports: [
        RouterModule.forChild(ZONAS_ROUTES),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('callejero', CallejeroReducers),
        MaterialModule

        //SharedModule,
    ],
    declarations: [
        MapaZonasComponent,
        EditarZonaComponent,
    ],
    exports: [
    ],
    entryComponents: [

    ],
    providers: [],
})
export class ZonaModule { }
