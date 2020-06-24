export class ClienteServicio{
	public id: number;
	public id_cliente: number;
	public id_servicio: number;
	public cant_fichas_partic: number;
	public id_ficha: number;
	public conceptos_partic: string;

	constructor(init?:Partial<ClienteServicio>) {
					Object.assign(this, init);
	}
}
