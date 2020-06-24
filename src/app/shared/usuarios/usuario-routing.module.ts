
import { ListaComponent } from './lista/lista.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { LoginComponent } from './loguear/login.component';

export const USUARIO_ROUTES = [
    {
        path: '',
        component: UsuarioComponent,
        //outlet: 'popup'
    },


    /*
        {
            path: '',
            redirectTo: '/modificacion',
            pathMatch: 'full'
        }*/
];
