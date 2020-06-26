import style, { css } from "./style.css";

console.log(css);
for (const name of Object.values(style)) {
  console.log(name);
}
