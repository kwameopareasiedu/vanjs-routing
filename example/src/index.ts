import "./global.css";
import van from "vanjs-core";
import App from "./app.ts";

const root = document.querySelector<HTMLDivElement>("#app");

if (root) van.add(root, App());
