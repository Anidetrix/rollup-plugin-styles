// eslint-disable-next-line node/no-extraneous-import
import "expect-puppeteer";

import fs from "fs-extra";
import { fixture } from "./helpers";

jest.setTimeout(30000);
beforeAll(() => fs.remove(fixture("dist")));
