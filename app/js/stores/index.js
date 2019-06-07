import Vue from 'vue';
import Vuex from 'vuex';
import homePage from './modules/homePage';
import mine from './modules/mine';
import login from './modules/login';
import keepAlive from './modules/keepAlive';
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        homePage,
        mine,
        login,
        keepAlive
    }
});

export default store;
