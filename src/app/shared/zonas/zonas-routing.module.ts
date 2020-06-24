
import { EditarZonaComponent } from './editar-zona/editar-zona.component';

import { MapaZonasComponent } from './mapa_editar_zona.component';

export const ZONAS_ROUTES = [
    {
        path: '',
        component: MapaZonasComponent,
        //outlet: 'popup'
    },
    {
        path: 'editar-zona',
        component: EditarZonaComponent,
        //outlet: 'popup'
    },
    /*
        {
            path: '',
            redirectTo: '/modificacion',
            pathMatch: 'full'
        }*/
];