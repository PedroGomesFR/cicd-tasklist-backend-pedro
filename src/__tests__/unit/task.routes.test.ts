import { describe, it, expect, vi } from "vitest";

vi.mock("../../controllers/task.controller.js", () => ({
	getAllTasks: vi.fn(),
	getTaskById: vi.fn(),
	createTask: vi.fn(),
	updateTask: vi.fn(),
	deleteTask: vi.fn(),
}));

const { default: router } = await import("../../routes/task.routes.js");

function hasRoute(path: string, method: string) {
	return router.stack.some(
		(layer: any) => layer.route && layer.route.path === path && layer.route.methods[method]
	);
}

describe("task routes", () => {
	it("registers CRUD endpoints", () => {
		expect(hasRoute("/", "get")).toBe(true);
		expect(hasRoute("/:id", "get")).toBe(true);
		expect(hasRoute("/", "post")).toBe(true);
		expect(hasRoute("/:id", "put")).toBe(true);
		expect(hasRoute("/:id", "delete")).toBe(true);
	});
});
