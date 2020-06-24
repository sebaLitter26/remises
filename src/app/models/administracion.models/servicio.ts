export class Servicio{
	public id: number;
	public descripcion: string;
	public cant_fichas: number;
	public id_ficha: number;
	public valor_servicio: number;

	constructor(init?:Partial<Servicio>) {
					Object.assign(this, init);
	}
}
