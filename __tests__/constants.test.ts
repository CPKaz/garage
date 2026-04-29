import { UUID_REGEX, EMAIL_REGEX } from "../app/constants";

describe("UUID_REGEX", () => {
  it.each([
    "https://shopgarage.com/listing/2013-Spartan-Sirius-71a96c93-294f-42a5-90b8-14f13726326c",
    "71a96c93-294f-42a5-90b8-14f13726326c",
    "prefix-71a96c93-294f-42a5-90b8-14f13726326c-suffix",
  ])("matches a valid UUID in: %s", (input) => {
    expect(UUID_REGEX.test(input)).toBe(true);
  });

  it.each([
    ["not-a-uuid", false],
    ["", false],
    ["https://shopgarage.com/listing/no-uuid-here", false],
    ["71a96c93-294f-42a5-90b8", false],
  ])('does not match "%s"', (input, expected) => {
    expect(UUID_REGEX.test(input)).toBe(expected);
  });

  it("extracts the UUID capture group from a full URL", () => {
    const url =
      "https://shopgarage.com/listing/2013-Spartan-Sirius-71a96c93-294f-42a5-90b8-14f13726326c";
    const match = url.match(UUID_REGEX);
    expect(match?.[1]).toBe("71a96c93-294f-42a5-90b8-14f13726326c");
  });
});

describe("EMAIL_REGEX", () => {
  it.each([
    "user@example.com",
    "test.email+tag@domain.co",
    "a@b.io",
    "hello@sub.domain.org",
  ])("accepts valid email: %s", (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(true);
  });

  it.each([
    "not-an-email",
    "missing@",
    "@nodomain.com",
    "",
    "spaces in@email.com",
    "double@@domain.com",
  ])("rejects invalid email: %s", (email) => {
    expect(EMAIL_REGEX.test(email)).toBe(false);
  });
});
