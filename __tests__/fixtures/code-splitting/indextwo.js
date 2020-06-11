import "./thirdtwo.scss";
import fourthtwo from "./fourthtwo.scss";
import "./sub/index.js";

(async () => {
  const first = await import("./first.scss");
  const second = await import("./second.scss");
  const otherScript = await import("./other-script.js");
  console.log(first, second, otherScript);
})();

console.log(fourthtwo);
