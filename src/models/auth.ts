import { Schema, IModel, model } from "../services";

export interface IAuth extends IModel {
	is_valid: boolean
	token_version: number
}

export const auth = model<IAuth>("Auth",
	new Schema({
		is_valid: {
			type: Boolean,
			required: true,
			default: true
		},
		token_version: {
			type: Number,
			required: true,
			default: 0
		}
	})
);
