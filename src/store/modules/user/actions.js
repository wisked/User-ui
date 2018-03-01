import axios from 'axios';

import appConfig from '@apiConfig';
import { LOG_IN, LOG_OUT } from './mutation-types';

export function logIn({ commit }, creds) {
    return new Promise((resolve, reject) => {
        axios.post(`${appConfig.api}/api/operation/login`, creds).then((response) => {
            commit(LOG_IN, response.data);
            resolve(response);
        }).catch((err) => {
            reject(err);
        })
    })
}

export function logOut({ commit }) {
    commit(LOG_OUT);
}