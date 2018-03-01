import Vue from 'vue';

const SET_GO_BACK = 'back-arrow/SET_GO_BACK';

const initialState = {
    backArrow: false
};

const actions = {
    setGoBack({ commit }, flag) {
        commit(SET_GO_BACK, flag)
    }
};

const mutations = {
    [SET_GO_BACK](state, flag) {
        state.backArrow = flag;
    }
};

const getters = {
    getBackArrow(state) {
        return state.backArrow;
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