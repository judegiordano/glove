import { FastifyInstance } from "fastify";
import plugin from "fastify-plugin";

export const schemas = plugin(async function (app: FastifyInstance) {
	app.addSchema({
		$id: "ping",
		type: "object",
		properties: {
			ok: { type: "boolean" }
		}
	});
	app.addSchema({
		$id: "user",
		type: "object",
		properties: {
			_id: { type: "string" },
			username: { type: "string" },
			email: { type: "string" },
			updated_at: { type: "string" },
			created_at: { type: "string" },
			is_deleted: { type: "number" },
		}
	});
	app.addSchema({
		$id: "usersArray",
		type: "array",
		items: { $ref: "user#" }
	});
});
