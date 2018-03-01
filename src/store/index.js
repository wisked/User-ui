import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import employees from './modules/employees';
import version from './modules/version';
import layout from './modules/layout';
import backArrow from './modules/back-arrow';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        employees,
        version,
        layout,
        backArrow
    }
});