import { FastifyInstance } from "fastify";

import { user } from "../../models";
import { NotFoundError } from "../../types";

export const users = async function (app: FastifyInstance) {
	app.get<{
		Params: {
			id: number
		}
	}>("users/:id", {
		preValidation: [app.cache],
		schema: {
			params: {
				type: "object",
				required: ["id"],
				properties: {
					id: { type: "string" }
				}
			},
			response: {
				200: { $ref: "user#" }
			}
		}
	}, async (req) => {
		const { id } = req.params;
		const exists = await user.findById(id, null, { lean: true });
		if (!exists) throw new NotFoundError();
		return exists;
	});
};
