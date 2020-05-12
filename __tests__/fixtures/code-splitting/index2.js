import "./third2.scss";
import fourth2 from "./fourth2.scss";

(async () => {
  const first = await import("./first.scss");
  const second = await import("./second.scss");
  const otherScript = await import("./other-script.js");
  console.log(first, second, otherScript);
})();

console.log(fourth2);
