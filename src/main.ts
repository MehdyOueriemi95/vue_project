import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.dark.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.dark.css';
import './themes/generated/theme.additional.css';
import { createApp }  from "vue";
import router from "./router";
import themes from "devextreme/ui/themes";

import App from "./App.vue";
import appInfo from "./app-info";

import "devextreme/dist/css/dx.light.css";  // 1) DevExtreme d’abord
import "@/assets/styles/_buttons.scss";     // 2) tes overrides ensuite
import "@/assets/styles/main.scss";         // 3) le reste

themes.initialized(() => {
    const app = createApp(App);
    app.use(router);
    app.config.globalProperties.$appInfo = appInfo;
    app.mount('#app');
});
