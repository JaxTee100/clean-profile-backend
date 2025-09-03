"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStatus = void 0;
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["Error"] = "Error";
    ResponseStatus["Success"] = "Success";
})(ResponseStatus || (exports.ResponseStatus = ResponseStatus = {}));
class Response {
    constructor(status) {
        this.message = '';
        this.data = {};
        this.status = status;
    }
    setMessage(msg) {
        this.message = msg;
    }
    // public get message() {
    //
    //     return this.#message;
    // }
    // public get data() {
    //     return this.data;
    // }
    addDataValue(key, val) {
        this.data[key] = val;
    }
    addDataValues(values) {
        for (const key in values) {
            this.data[key] = values[key];
        }
    }
    toJSON() {
        return {
            message: this.message,
            status: this.status,
            data: this.data,
        };
    }
}
exports.default = Response;
