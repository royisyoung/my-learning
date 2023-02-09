import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: ["/"],
});

registerApplication({
  name: "@single-spa/app1-react",
  app: () => System.import("//localhost:8080/single-spa-app1-react.js"),
  activeWhen: ["/react"]
});

registerApplication({
  name: "@single-spa/app2-vue",
  app: () => System.import("//localhost:8081/js/app.js"),
  activeWhen: ["/vue"]
});

start({
  urlRerouteOnly: true,
});
