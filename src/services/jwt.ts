import jwt from "jsonwebtoken";

import { config } from "./config";

export function sign<T>(payload: T) {
	return jwt.sign(payload as any, config.JWT_SECRET);
}

export function verify<T>(token: string) {
	return jwt.verify(token, config.JWT_SECRET) as T;
}
