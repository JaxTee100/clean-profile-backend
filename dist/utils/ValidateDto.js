"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = validateDto;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const CustomErrors_1 = require("./CustomErrors");
function validateDto(dtoClass, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const dto = (0, class_transformer_1.plainToInstance)(dtoClass, body);
        if (Array.isArray(dto)) {
            throw new CustomErrors_1.ClassValidationError([
                {
                    property: 'body',
                    constraints: {
                        isNotArray: 'Only a single object is expected, not an array.',
                    },
                    children: [],
                    value: body,
                }
            ]);
        }
        const errors = yield (0, class_validator_1.validate)(dto, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
            throw new CustomErrors_1.ClassValidationError(errors);
        }
        return dto;
    });
}
