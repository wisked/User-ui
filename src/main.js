import Vue from 'vue';
import Vuetify from 'vuetify';
import VueResource from 'vue-resource';

import App from './App';
import router from './router';
import store from './store';
import 'vuetify/dist/vuetify.min.css';
import './assets/styles.css';
import AuthService from '@/services/AuthService';
import VueClipboards from 'vue-clipboards';
import Vue2Filters from 'vue2-filters';
import VeeValidate from 'vee-validate';

Vue.config.productionTip = false;

Vue.use(Vuetify);
Vue.use(VueResource);
Vue.use(VueClipboards);
Vue.use(Vue2Filters);
Vue.use(VeeValidate);

Vue.http.interceptors.push((request, next) => {
    request.headers.set('Authorization', AuthService.getAuthToken());
    next();
});

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
});