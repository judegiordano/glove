import { Schema, IModel, model } from "../services";
import { Ref } from "../types";
import { IAuth } from "./auth";

export interface IUser extends IModel {
	password: string
	username: string
	email: string
	auth: Ref<IAuth>
}

export const user = model<IUser>("User",
	new Schema({
		username: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 25
		},
		email: {
			type: String,
			required: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			select: false
		},
		auth: {
			type: String,
			ref: "Auth",
			required: true
		},
	}).index({ username: 1, email: 1 }, { unique: true })
);
