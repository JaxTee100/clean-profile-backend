export enum ResponseStatus {
	Error = 'Error',
	Success = 'Success',
}

export default class Response {
	protected message: string = '';
	private readonly status: ResponseStatus;
	private readonly data: Record<string, any> = {};
	
	
	

	constructor(status: ResponseStatus) {
		this.status = status;
	}

	public setMessage(msg: string) {
		this.message = msg;
	}

	// public get message() {
	//
	//     return this.#message;
	// }

	// public get data() {
	//     return this.data;
	// }

	public addDataValue(key: string, val: any) {
		this.data[key] = val;
	}

	public addDataValues(values: Record<string, any>) {
		for (const key in values) {
			this.data[key] = values[key];
		}
	}

	public toJSON(): { data: Record<string, any>;  message: string; status: ResponseStatus } {
		return {
			message: this.message,
			status: this.status,
			data: this.data,
			
			
		};
	}
}