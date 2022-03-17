import { FastifyReply, FastifyRequest } from "fastify";

import { redis } from "../services";

export async function cache(req: FastifyRequest, res: FastifyReply) {
	const key = `${req.method}-${req.url}-${req.ip}`;
	const data = await redis.get(key);
	if (!data) {
		req.cache = {
			...req.cache,
			shouldCache: true,
			key
		};
		return;
	}
	req.cache = {
		...req.cache,
		shouldCache: false,
		key: null
	};
	return res.send(data);
}
