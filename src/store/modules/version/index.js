import Vue from 'vue';
import appConfig from '@apiConfig';

const FETCH_VERSION = 'version/FETCH_VERSION';

const initialState = {
    version: ''
};

const actions = {
    fetchVersion({ commit }) {
        Vue.http.get(`${appConfig.api}/api/operation/version`)
            .then(res => commit(FETCH_VERSION, res.body)).catch(err => console.error(err));
    }
};

const mutations = {
    [FETCH_VERSION](state, version) {
        state.version = version;
    }
};

const getters = {
    getVersion(state) {
        return state.version;
    }
};

export default {
    state: {
        ...initialState
    },
    actions,
    mutations,
    getters
};