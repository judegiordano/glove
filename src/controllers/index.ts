import { FastifyPluginCallback } from "fastify";

import { app } from "../services";
import { developerRouter } from "./developer";
import { userRouter } from "./users";

const routers = [
	developerRouter,
	userRouter
] as unknown as FastifyPluginCallback[];

for (const router of routers) {
	app.register(router, { prefix: "/api/" });
}

export const controllers = app;
