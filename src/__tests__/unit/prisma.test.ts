import { describe, it, expect, vi } from "vitest";

const mockInstance = { mocked: true };

vi.mock("@prisma/client", () => ({
	PrismaClient: vi.fn(() => mockInstance),
}));

describe("prisma singleton", () => {
	it("creates and exports one PrismaClient instance", async () => {
		vi.resetModules();
		const { PrismaClient } = await import("@prisma/client");
		const { default: prisma } = await import("../../lib/prisma.js");

		expect(PrismaClient).toHaveBeenCalledTimes(1);
		expect(prisma).toBe(mockInstance);
	});
});
