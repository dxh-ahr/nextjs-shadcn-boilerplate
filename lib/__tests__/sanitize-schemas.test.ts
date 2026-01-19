import { sanitizeSchemas } from "../security/sanitize";

describe("sanitizeSchemas", () => {
  describe("string schema", () => {
    it("should sanitize strings", async () => {
      const result = await sanitizeSchemas.string.parseAsync("  Test  ");
      expect(result).toBe("Test");
    });
  });

  describe("email schema", () => {
    it("should validate and sanitize emails", async () => {
      // Email must be valid before transform runs
      const result = await sanitizeSchemas.email.parseAsync("TEST@EXAMPLE.COM");
      expect(result).toBe("test@example.com");
    });

    it("should reject invalid emails", async () => {
      await expect(
        sanitizeSchemas.email.parseAsync("invalid-email")
      ).rejects.toThrow();
    });
  });

  describe("url schema", () => {
    it("should validate and sanitize URLs", async () => {
      const result = await sanitizeSchemas.url.parseAsync(
        "https://example.com"
      );
      expect(result).toBe("https://example.com");
    });

    it("should reject invalid URLs", async () => {
      await expect(
        sanitizeSchemas.url.parseAsync("not-a-url")
      ).rejects.toThrow();
    });

    it("should reject empty strings", async () => {
      await expect(sanitizeSchemas.url.parseAsync("")).rejects.toThrow();
    });

    it("should block dangerous protocols", async () => {
      const result = await sanitizeSchemas.url.parseAsync(
        "javascript:alert('xss')"
      );
      expect(result).toBe("#");
    });
  });

  describe("phone schema", () => {
    it("should sanitize phone numbers", async () => {
      const result =
        await sanitizeSchemas.phone.parseAsync("+1 (555) 123-4567");
      expect(result).toBe("+1 (555) 123-4567");
    });
  });

  describe("number schema", () => {
    it("should coerce to number", async () => {
      const result = await sanitizeSchemas.number.parseAsync("123.45");
      expect(result).toBe(123.45);
    });
  });

  describe("integer schema", () => {
    it("should coerce to integer", async () => {
      const result = await sanitizeSchemas.integer.parseAsync("123");
      expect(result).toBe(123);
    });

    it("should reject non-integers", async () => {
      await expect(
        sanitizeSchemas.integer.parseAsync("123.45")
      ).rejects.toThrow();
    });
  });

  describe("positiveNumber schema", () => {
    it("should accept positive numbers", async () => {
      const result = await sanitizeSchemas.positiveNumber.parseAsync("42");
      expect(result).toBe(42);
    });

    it("should reject zero", async () => {
      await expect(
        sanitizeSchemas.positiveNumber.parseAsync("0")
      ).rejects.toThrow();
    });

    it("should reject negative numbers", async () => {
      await expect(
        sanitizeSchemas.positiveNumber.parseAsync("-5")
      ).rejects.toThrow();
    });
  });

  describe("nonNegativeNumber schema", () => {
    it("should accept zero", async () => {
      const result = await sanitizeSchemas.nonNegativeNumber.parseAsync("0");
      expect(result).toBe(0);
    });

    it("should accept positive numbers", async () => {
      const result = await sanitizeSchemas.nonNegativeNumber.parseAsync("42");
      expect(result).toBe(42);
    });

    it("should reject negative numbers", async () => {
      await expect(
        sanitizeSchemas.nonNegativeNumber.parseAsync("-5")
      ).rejects.toThrow();
    });
  });
});
