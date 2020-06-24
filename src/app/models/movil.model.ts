export class Movil {

    age: string;
    castigado: string;
    domicilio: string;
    dominio: string;
    enpanicado: string;
    entradaparada: string;
    enum_estado: string;
    equipo: string;
    est_banderas: string;
    est_entradas: string;
    est_salidas: string;
    establet: string;
    estado: string;
    fecha: string;
    fecha_gps: string;
    fecha_ser: string;
    ft: string;
    hdop: string;
    idempresa: string;
    idmovil: string;
    interno: string;
    ip: string;
    lat: string;
    licencia: string;
    lon: string;
    marca: string;
    modelo: string;
    nsat: string;
    pasarela: string;
    pdop: string;
    puntos: string;
    reporte: string;
    rumbo: string;
    salidaparada: string;
    seg_fecha_gps: string;
    seg_fecha_ser: string;
    telefono: string;
    timeestado: string;
    timeparada: string;
    timeposicion: string;
    ultimaparada: string;
    vel: string;
    viajeacuenta: string;
    viajecalle: string;
    zonas: string;


    public constructor(init?: Partial<Movil>) {
        Object.assign(this, init);
    }
}
