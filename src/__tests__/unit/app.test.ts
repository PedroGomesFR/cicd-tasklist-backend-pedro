import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import express from "express";

vi.mock("../../routes/task.routes.js", () => {
	const router = express.Router();
	router.get("/", (_req, res) => {
		res.status(200).json({ ok: true });
	});
	return { default: router };
});

const { default: app } = await import("../../app.js");

describe("app", () => {
	it("mounts task routes under /api/tasks", async () => {
		const res = await request(app).get("/api/tasks/");

		expect(res.status).toBe(200);
		expect(res.body).toEqual({ ok: true });
	});
});
