import Vue from 'vue';
import App from './App.vue';
import router from './router';
import '../style/app.scss';
import store from './stores';
import moment from 'moment';
import Common from '../js/utils/common';
import Request from '../js/utils/request';
import { Swipe, SwipeItem, Toast, DatetimePicker } from 'vant';
moment.locale('zh-cn');
Vue.use(Swipe)
    .use(SwipeItem)
    .use(Toast)
    .use(DatetimePicker);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');

Vue.filter('dateformat', function(value, param) {
    return moment(value).format(param);
});
Vue.prototype.$common = Common;
Vue.prototype.$request = Request;
Vue.prototype.$isAndroid = Common.isAndroid();

store.dispatch('getUser');
