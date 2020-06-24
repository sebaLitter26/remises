
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, CanLoad } from '@angular/router';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { MaterialModule } from '../../material.module';

import { appReducers } from '../../store/app.reducer';
import { effectsArr } from '../../store/effects';

import { PopupDialogComponent } from './popup.component';
import { PedidosEmergenteComponent } from '../pedidos_emergente/pedidos_emergente.component';



// Rutas
import { POPUP_ROUTES } from './popup-routing.module';



@NgModule({
    imports: [
        RouterModule.forChild(POPUP_ROUTES),
        CommonModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        StoreModule.forRoot(appReducers),
        EffectsModule.forRoot(effectsArr),
    ],
    declarations: [
        PedidosEmergenteComponent,
        PopupDialogComponent,
    ],
    exports: [
    ],
    entryComponents: [
        PopupDialogComponent,
    ],
    providers: [],
})
export class PopupModule { }
