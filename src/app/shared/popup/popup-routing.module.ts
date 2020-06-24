import { PedidosEmergenteComponent } from '../pedidos_emergente/pedidos_emergente.component';
import { ModificacionAdministracionComponent } from '../administracion.components/modificacion/modificacion.component';

//import { EditarMuchasCallesComponent } from '../callejero/editar-muchas-calles/editar-muchas-calles.component';

export const POPUP_ROUTES = [
    {
        path: 'modificacion',
        component: PedidosEmergenteComponent,
        //outlet: 'popup'
    },
    {
        path: 'administracion-modificacion',
        component: ModificacionAdministracionComponent,
        //outlet: 'popup'
    },
/*
    {
        path: 'editar-muchas-calles',
        component: EditarMuchasCallesComponent,
        //outlet: 'popup'
    },

    
        {
            path: '',
            redirectTo: '/modificacion',
            pathMatch: 'full'
        }*/
];
