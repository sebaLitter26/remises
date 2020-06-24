
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


import { RolesComponent } from './roles.component';
import { RolDetalleComponent } from './rol-detalle/rol-detalle.component';


// Rutas
import { ROLES_ROUTES } from './roles-routing.module';

// Modulos personalizados
import { MaterialModule } from '../../material.module';

import { RolesService } from './roles.service';



@NgModule({
    imports: [
        RouterModule.forChild(ROLES_ROUTES),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(appReducers),
        EffectsModule.forRoot(effectsArr),
        MaterialModule
    ],
    declarations: [
        RolesComponent,
        RolDetalleComponent
    ],
    exports: [
    ],
    entryComponents: [
        RolesComponent,
        RolDetalleComponent
    ],
    providers: [RolesService],
})
export class RolesModule { }
