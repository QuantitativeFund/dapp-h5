import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import i18n from "./lang";

import "default-passive-events";

global.Buffer = global.Buffer || require("buffer").Buffer;

import {
  Button,
  Card,
  Tag,
  Field,
  Icon,
  Badge,
  Dialog,
  Image,
  Switch,
  Space,
  Col,
  Row,
  Divider,
  Tab,
  Tabs,
  Empty,
  Cell,
  CellGroup,
  RadioGroup,
  Radio,
  ActionSheet,
  PullRefresh,
  Collapse,
  CollapseItem,
  GridItem,
  Grid,
  Form,
  BackTop,
  NavBar,
  Popup,
  Picker,
  ShareSheet,
} from "vant";

import "vant/lib/index.css";
import piniaPluginPersist from "pinia-plugin-persist";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersist);
app.use(pinia);
app.use(router);
app.use(Button);
app.use(Card);
app.use(Tag);
app.use(Space);
app.use(Col);
app.use(Row);
app.use(Divider);
app.use(Tab);
app.use(Tabs);
app.use(Empty);
app.use(Cell);
app.use(CellGroup);
app.use(RadioGroup);
app.use(Radio);
app.use(ActionSheet);
app.use(Field);
app.use(PullRefresh);
app.use(Icon);
app.use(Badge);
app.use(Dialog);
app.use(Image);
app.use(Switch);
app.use(Collapse);
app.use(CollapseItem);
app.use(GridItem);
app.use(Grid);
app.use(Form);
app.use(BackTop);
app.use(NavBar);
app.use(i18n);
app.use(Popup);
app.use(Picker);
app.use(ShareSheet);
app.mount("#app");
