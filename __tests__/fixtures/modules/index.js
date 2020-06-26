import style from "./style.css";
import "./composed.css";
import composition2 from "./subdir/composition2.css";

if (composition2.inject) composition2.inject();
else console.log(style.module, composition2.compositioned);
