export class Movil{
	public id: number;
	public equipo: string;
	public licencia: string;
	public dominio: string;
	public marca: string;
	public modelo: string;

	public lon: string;
	public lat: string;
	public vel: number;
	public rumbo: number;

	public fecha_gps: any;
	public fecha_ser: any;

	public est_entradas: number;
	public est_salidas: number;
	public est_banderas: number;

	public reporte: string;
	public estado: number;
	public puntos: number;
	public id_empresa: number;

	public ultimaparada: any;
	public timeposicion: any;
	public timeparada: any;

	public nsat: number;
	public ft: number;
	public pdop: number;
	public hdop: number;
	public age: number;
	public zonas: string;
	public ip: string;
	public pasarela: number;
	public telefono: string;
	public viajeacuenta: number;
	public enpanicado: number;
	public domicilio: string;
	public timeestado: any;
	public interno: string;

	//public establet: string;

	constructor(init?:Partial<Movil>) {
					Object.assign(this, init);
	}
}
