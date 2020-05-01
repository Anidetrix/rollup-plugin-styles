import "./other-script.scss";

(async () => {
  await import("./noncss");
  const nestedScript = await import("./nested-script.js");
  console.log(nestedScript);
})();
