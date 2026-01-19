// Test that all exports from the security index work correctly
import * as security from "../security";

describe("Security Index Exports", () => {
  it("should export all sanitize functions", () => {
    expect(typeof security.sanitizeString).toBe("function");
    expect(typeof security.sanitizeHtml).toBe("function");
    expect(typeof security.sanitizeUrl).toBe("function");
    expect(typeof security.sanitizeEmail).toBe("function");
    expect(typeof security.sanitizePhone).toBe("function");
    expect(typeof security.sanitizeNumber).toBe("function");
    expect(typeof security.sanitizeInteger).toBe("function");
    expect(typeof security.stripHtmlTags).toBe("function");
    expect(typeof security.sanitizeObject).toBe("function");
  });

  it("should export all xss functions", () => {
    expect(typeof security.escapeHtml).toBe("function");
    expect(typeof security.escapeHtmlAttribute).toBe("function");
    expect(typeof security.escapeJavaScript).toBe("function");
    expect(typeof security.escapeCss).toBe("function");
    expect(typeof security.escapeUrl).toBe("function");
    expect(typeof security.sanitizeForRender).toBe("function");
    expect(typeof security.safeAttributeValue).toBe("function");
    expect(typeof security.safeDataAttribute).toBe("function");
    expect(typeof security.isSafeForInlineScript).toBe("function");
    expect(typeof security.generateCspNonce).toBe("function");
    expect(typeof security.safeJsonParse).toBe("function");
    expect(typeof security.safeDangerouslySetInnerHTML).toBe("function");
  });

  it("should allow importing from barrel export", () => {
    // Verify that importing from the index works
    const result = security.sanitizeString("  test  ");
    expect(result).toBe("test");
  });
});
