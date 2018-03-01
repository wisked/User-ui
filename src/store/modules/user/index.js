import * as actions from './actions';
import * as getters from './getters';
import AuthService from '../../../services/AuthService';
import router from '../../../router';

import { LOG_IN, LOG_OUT } from './mutation-types';

const initialState = {
    user: AuthService.isUserAuthenticated() ? AuthService.getPayload() : {}
};

const mutations = {
    [LOG_IN](state, token) {
        AuthService.authenticateUser(token);
        state.user = AuthService.getPayload();
        router.push('/');
    },

    [LOG_OUT](state) {
        AuthService.deauthenticateUser();
        state.user = {};
    }
};

export default {
    state: {
        ...initialState
    },
    actions,
    getters,
    mutations
};