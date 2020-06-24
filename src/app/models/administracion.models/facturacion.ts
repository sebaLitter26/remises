export class Facturacion{

	public id_movil: number;
	public interno: number;
	public dominio: string;
	public licencia: string;
	public id_empresa: number;
	public descripcion_servicio: string;
	public precio_servicio: string;

	constructor(init?:Partial<Facturacion>) {
					Object.assign(this, init);
	}
}
