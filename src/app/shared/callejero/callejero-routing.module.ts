
import { EditarCalleComponent } from './editar-calle/editar-calle.component';

import { MapaCallejeroComponent } from './mapa_editar_callejero.component';

export const CALLEJERO_ROUTES = [
    {
        path: '',
        component: MapaCallejeroComponent,
        //outlet: 'popup'
    },
    {
        path: 'editar-calle',
        component: EditarCalleComponent,
        //outlet: 'popup'
    },
    /*
        {
            path: '',
            redirectTo: '/modificacion',
            pathMatch: 'full'
        }*/
];
