import { AppComponent } from './app.component';

export const APP_ROUTES = [
    //{ path: 'home', component: ListaComponent },

    //{ path: '', component: AppComponent },


    //{ path: '', component: MapaComponent },
    {
        path: 'pedidos',
        loadChildren: './shared/mapa/mapa.module#MapaModule',
    },
    //{ path: 'callejero', component: MapaCallejeroComponent },

    //{ path: 'administracion', component: AdministracionComponent },
    {
        path: 'administracion',
        loadChildren: './shared/administracion/administracion.module#AdministracionModule',
        //outlet: "administracion"
        //CanLoad
    },
    {
        path: 'callejero',
        loadChildren: './shared/callejero/callejero.module#CallejeroModule',
        //outlet: "administracion"
        //CanLoad
    },
    {
        path: 'zona',
        loadChildren: './shared/zonas/zona.module#ZonaModule',
        //outlet: "administracion"
        //CanLoad
    },

    {
        path: 'popup',
        loadChildren: './shared/popup/popup.module#PopupModule',
        outlet: 'popupOutlet'
        //CanLoad
    },
    /*
    {
        path: 'login',
        //component: LoginComponent,
        loadChildren: './shared/login/login.module#LoginModule',
        outlet: 'encabezado'

    },
    */
    {
        path: 'permisos',
        loadChildren: './shared/roles/roles.module#RolesModule',
        //outlet: "popupOutlet"
        //CanLoad
    },
    /*
    {
        path: 'presupuesto',
        loadChildren: './shared/presupuesto/presupuesto.module#PresupuestoModule',
        //outlet: "popupOutlet"
        //CanLoad
    },
    */
    {
        path: 'configuracion',
        loadChildren: './shared/configuraciones/configuracion.module#ConfiguracionModule',
        //outlet: "popupOutlet"
        //CanLoad
    },
    //{ path: 'administracion/**', component: AdministracionComponent },
    {
        path: 'despacho/:ruta',
        loadChildren: './shared/despacho/despacho.module#DespachoModule',
    },
    {
        path: 'despacho',
        loadChildren: './shared/despacho/despacho.module#DespachoModule',
    },
/*
    {
        path: 'modificacion',
        loadChildren: './shared/modificacion/modificacion.module#ModificacionModule',
    },
    */
    {
        path: 'usuario',
        loadChildren: './shared/usuarios/usuarios.module#UsuarioModule',

    },

    { path: '#/despacho', redirectTo: 'despacho' },
    { path: '#/pedidos', redirectTo: 'pedidos' },
    { path: '#/administracion', redirectTo: 'administracion' },
    { path: '#/callejero', redirectTo: 'callejero' },
    { path: '#/permisos', redirectTo: 'permisos' },
    { path: '#/usuario', redirectTo: 'usuario' },
    { path: '#/', redirectTo: 'login' },
    { path: '#/login', redirectTo: 'login', pathMatch: 'full' },
];

