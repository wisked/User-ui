import Vue from 'vue';

const EDIT_CARDMODE = 'layout/EDIT_CARDMODE';
const EDIT_OPTIONS = 'layout/EDIT_OPTIONS';

const initialState = {
    cardMode:
        localStorage.getItem('cardMode') === null
            ? true
            : JSON.parse(localStorage.getItem('cardMode')),
    options:
        localStorage.getItem('orderOptions') === null
            ? {
                  order: 'lastName',
                  descending: true
              }
            : JSON.parse(localStorage.getItem('orderOptions'))
};

const actions = {
    editCardMode({ commit }) {
        commit(EDIT_CARDMODE);
    },
    editOptions({ commit }, options) {
        commit(EDIT_OPTIONS, options);
    }
};

const mutations = {
    [EDIT_CARDMODE](state) {
        state.cardMode = !state.cardMode;
        localStorage.setItem('cardMode', state.cardMode);
    },
    [EDIT_OPTIONS](state, item) {
        state.options.order === item.value
            ? (state.options.descending = !state.options.descending)
            : true;
        state.options.order = item.value;
        localStorage.setItem('orderOptions', JSON.stringify(state.options));
    }
};

const getters = {
    getCardMode(state) {
        return state.cardMode;
    },
    getOptions(state) {
        return state.options;
    },
    getOrderProps(state) {
        return state.orderProps;
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
