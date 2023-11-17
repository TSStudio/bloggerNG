// import { createApp } from "vue";

// import App from "./App.vue";

// import "element-plus/theme-chalk/el-message.css";
// import "element-plus/theme-chalk/el-message-box.css";
// import "./css/style.css";
// import "./css/vscode-darkplus.css";
// import "katex/dist/katex.min.css";

// const app = createApp(App);
// app.mount("#app");

require.ensure(
    [],
    function () {
        var _require = require("vue"),
            createApp = _require.createApp;

        var App = require("./App.vue").default;

        require("element-plus/theme-chalk/el-message.css");
        require("element-plus/theme-chalk/el-message-box.css");
        require("./css/style.css");
        require("./css/vscode-darkplus.css");
        require("katex/dist/katex.min.css");

        var app = createApp(App);
        app.mount("#app");
        setTimeout(() => {
            document.getElementById("overlay").classList.add("overlay-hidden");
        }, 300);
        setTimeout(() => {
            document.getElementById("overlay").remove();
        }, 1000);
    },
    "vue"
);
