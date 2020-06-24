
import { NgModule} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { MaterialModule } from './material.module';

// NgRx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { appReducers } from './store/app.reducer';
import { effectsArr } from './store/effects';

// Environment
import { environment } from '../environments/environment';

// Rutas
import { APP_ROUTES } from './app-routing.module';

//Componentes
import { AppComponent } from './app.component';

import {
    //NavbarComponent,
    MenuListItemComponent,
} from './shared/login/menu-list-item/menu-list-item.component';



import { LoginComponent } from './shared/login/login.component';

import { EstilosService } from './services/index.services';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        MenuListItemComponent
    ],
    imports: [
        HttpClientModule,
        BrowserAnimationsModule,
        BrowserModule,
        MaterialModule,
        //FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot(appReducers),
        EffectsModule.forRoot(effectsArr),
        StoreDevtoolsModule.instrument({
            name: 'DevTools de Store Inicial',
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
        RouterModule.forRoot(APP_ROUTES, { enableTracing: false, useHash: true }),
    ],
    exports: [
    ],
    entryComponents: [

    ],
    providers: [
        EstilosService,
        { provide: APP_BASE_HREF, useValue : '/' }
    ],

    bootstrap: [AppComponent]
})
export class AppModule { }
