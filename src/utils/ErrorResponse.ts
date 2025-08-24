import Response, { ResponseStatus } from "./Response";


export default class ErrorResponse extends Response {
	constructor(message?: string) {
		super(ResponseStatus.Error);
		this.message = 'request failed';
	}
}