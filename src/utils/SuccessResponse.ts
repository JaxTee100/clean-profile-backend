import Response, { ResponseStatus } from "./Response";


export default class SuccessResponse extends Response {
	constructor(message?: string) {
		super(ResponseStatus.Success);
		this.message = message || 'request successful';
	}
}