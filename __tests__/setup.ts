import fs from "fs-extra";
import { fixture } from "./helpers";

jest.setTimeout(30000);

beforeAll(async () => fs.remove(fixture("dist")));
