

import { UsuariosEffects } from './usuarios.effects';
import { UsuarioEffects } from './usuario.effects';

import { MovilesEffects } from './moviles.effects';
import { ViajeEffects } from './viaje.effects';

import { CallesEffects } from './calles.effects';

import { ModificacionAdministracionEffects } from './modificacionAdministracion.effects';

export const effectsArr: any[] = [
    UsuariosEffects,
    UsuarioEffects,
    MovilesEffects,
    ViajeEffects,
    CallesEffects,
    ModificacionAdministracionEffects,
];


export * from './usuarios.effects';
export * from './usuario.effects';
export * from './moviles.effects';
export * from './viaje.effects';
export * from './calles.effects';
export * from './modificacionAdministracion.effects';
