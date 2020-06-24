
import {
    LecturaComponent,
    //ModificacionAdministracionComponent,
} from '../administracion.components/index.components';
/*
import {
    AdministracionComponent
} from './administracion.component';
*/
export const ADMINISTRACION_ROUTES = [
    { path: '', redirectTo: 'cliente', pathMatch: 'full' },
    //{ path: '', redirectTo: 'administracion/**', pathMatch: 'full' },
    //{ path: 'administracion/modificacion/', component: ModificacionAdministracionComponent, outlet: "administracion" },
    //{ path: '', component: AdministracionComponent, outlet: "administracion" },
    /*
        {
            path: 'lectura/:modulo',
            //loadChildren: './components/lectura/lectura.module#LecturaModule',
            component: LecturaComponent,
        },*/
    { path: ':modulo', component: LecturaComponent },




];
