import VerEx from "./verbalexpressions";
import { startOfLine, endOfLine } from "./constants";
import { maybe } from "./maybe";
import anythingBut from "./anythingBut";
import or from "./or";

describe("Complex expressions", () => {
  it("should match simple URLs", () => {
    const exp = VerEx(
      startOfLine,
      "http",
      maybe("s"),
      "://",
      maybe("www."),
      anythingBut(" "),
      endOfLine
    );

    expect(exp.test("https://google.com/")).toBeTruthy();
    expect(exp.test("http://www.msn.com/en-us")).toBeTruthy();
    expect(exp.test("foobar")).toBeFalsy();
    expect(exp.test("ftp://foo.bar")).toBeFalsy();
  });

  it("should match simple protocols", () => {
    const protocol = or(VerEx("http", maybe("s"), "://"), "ftp://", "smtp://");
    const removeWww = maybe("www.");
    const domain = anythingBut(" /");
    const exp = VerEx(startOfLine, protocol, removeWww, domain);

    expect(exp.test("http://www.google.com")).toBeTruthy();
    expect(exp.test("https://msn.com")).toBeTruthy();
    expect(exp.test("ftp://192.168.0.1")).toBeTruthy();
    expect(exp.test("smtp://imap.fastmail.com")).toBeTruthy();
    expect(exp.test("foobar")).toBeFalsy();
    expect(exp.test("http://some.com/lengthty/url.html")).toBeTruthy();
  });
});
