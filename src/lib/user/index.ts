import { FastifyReply, FastifyRequest } from "fastify";

import { cookie, password as pass } from "../../services";
import { UnauthorizedError } from "../../types";
import { user, auth, IAuth } from "../../models";

export async function authenticate(req: FastifyRequest) {
	const { _id, token_version } = cookie.parseUser(req);
	if (!_id) throw new UnauthorizedError();
	const exists = await user.findById(_id, null, { populate: "auth" });
	if (!exists) throw new UnauthorizedError();
	const credentials = exists as unknown as { auth: IAuth };
	if (!credentials || credentials.auth.token_version !== token_version) throw new UnauthorizedError();
	req.user = {
		_id: exists._id,
		username: exists.username,
		email: exists.email
	};
	return;
}

export async function register(
	res: FastifyReply,
	{
		username,
		email,
		password
	}: {
		username: string
		email: string
		password: string
	}) {
	const registration = await user.create({
		username,
		email,
		password: await pass.hash(password)
	});
	const credentials = await auth.create({});
	registration.auth = credentials._id;
	const success = await registration.save();
	cookie.setUser(res, {
		_id: success._id,
		username: success.username,
		email: success.email,
		is_valid: credentials.is_valid,
		token_version: credentials.token_version
	});
	return registration;
}

export async function login(
	res: FastifyReply,
	{
		username,
		password
	}: {
		username: string
		password: string
	}) {
	const found = await user.findOne({ username }, null, { populate: "auth" });
	if (!found) throw new UnauthorizedError();
	const compare = await pass.compare(password, found.password);
	if (!compare) throw new UnauthorizedError("incorrect password");
	const credentials = found as unknown as { auth: IAuth };
	cookie.setUser(res, {
		_id: found._id,
		username: found.username,
		email: found.email,
		is_valid: credentials.auth.is_valid,
		token_version: credentials.auth.token_version
	});
	return found;
}
