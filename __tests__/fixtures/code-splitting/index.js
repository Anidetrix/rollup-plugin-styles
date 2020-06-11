import "./third.scss";
import fourth from "./fourth.scss";
import "./sub/index.js";

(async () => {
  const first = await import("./first.scss");
  const second = await import("./second.scss");
  const otherScript = await import("./other-script.js");
  console.log(first, second, otherScript);
})();

console.log(fourth);
