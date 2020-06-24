export class Cliente{
	public id: number;
	public id_usuario: number;
	public id_contrato: number;
	public tipo_factura: number;
	public telfijo: string;
	public telotro: string;
	public telmovil: string;
	public id_bejerman: string;
	public cuit: number;
	public status: boolean;
	public mail: string;
	public domicilio: string;
	public localidad: string;
	public apenom: string;
	public fecha_alta: string;
	public fecha_baja: string;

	constructor(init?:Partial<Cliente>) {
					Object.assign(this, init);
	}
}
