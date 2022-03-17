import { FastifyReply, FastifyRequest } from "fastify";
import { serialize, parse } from "cookie";

import { sign, verify } from "./jwt";
import { UnauthorizedError } from "../types/errors";

const cookieName = "glove.jid";

type Payload = {
	_id: string
	username: string
	email: string
	is_valid: boolean
	token_version: number
}

export function setUser(res: FastifyReply, { _id, username, email, is_valid, token_version }: Payload) {
	const token = sign({ _id, username, email, is_valid, token_version });
	return res.header("Set-Cookie", serialize(cookieName, token, {
		httpOnly: true,
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 7 days
		secure: false,
		sameSite: true
	}));
}

export function parseUser(req: FastifyRequest) {
	const cookies = parse(req.headers.cookie || "");
	const token = cookies[cookieName];
	if (!cookies || !token) throw new UnauthorizedError();
	return verify<Payload>(token);
}

export function destroyCookie(res: FastifyReply) {
	return res.header("Set-Cookie", serialize(cookieName, "", {
		httpOnly: true,
		path: "/",
		maxAge: 0,
		secure: false,
		sameSite: true
	}));
}
