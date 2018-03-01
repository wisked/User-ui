import Vue from 'vue';
import {
    FETCH_EMPLOYEES,
    FETCH_COORDINATORS,
    FETCH_USER,

    EDIT_EMPLOYEE_EMAIL,
    EDIT_EMPLOYEE_PASSWORD,
    EDIT_EMPLOYEE_FIRSTNAME,
    EDIT_EMPLOYEE_LASTNAME,
    EDIT_EMPLOYEE_COORDINATOR,
    EDIT_EMPLOYEE_EDIT_PHONE,
    EDIT_EMPLOYEE_ADD_PHONE,
    EDIT_EMPLOYEE_REMOVE_PHONE,
    EDIT_EMPLOYEE_SKYPE,
    EDIT_EMPLOYEE_TELEGRAM,
    EDIT_EMPLOYEE_ENGLISH,
    EDIT_EMPLOYEE_POSITION,
    EDIT_EMPLOYEE_SCHEDULE,
    EDIT_EMPLOYEE_CONTRACTLAPSE,
    EDIT_EMPLOYEE_HIRINGDATE,
    EDIT_EMPLOYEE_PHOTOURL,
    SET_UPLOADING_PHOTO,
    VIEW_EMPLOYEE,
    DELETE_EMPLOYEE,
    ADD_NEW_EMPLOYEE,
    EDIT_EMPLOYEE,
    SEARCH_EMPLOYEE,

    FETCH_ROLES,
    EDIT_ROLE,
    DELETE_ROLE,
    TOGGLE_ROLE,
    MAP_ROLES,
    ADD_ROLE,
    SAVE_ROLE,
    CANCEL_EDIT_ROLE,

    FETCH_DEPARTMENTS,
    SAVE_DEPARTMENT,
    DELETE_DEPARTMENT,
    EDIT_DEPARTMENT,
    ADD_DEPARTMENT,
    CANCEL_EDIT_DEPARTMENT,
    TOGGLE_DEPARTMENT,
    MAP_DEPARTMENTS,

    UPDATE_SALARY,
    EDIT_SALARY,
    UPDATE_SALARY_AMOUNT,
    UPDATE_SALARY_CURRENCY,
    UPDATE_SALARY_DATE,
    DELETE_SALARY,
    ADD_SALARY
} from './mutation-types';
import appConfig from '@apiConfig';

export function fetchEmployees({ commit }) {
    return new Promise((resolve, reject) => {
        Vue.http.get(`${appConfig.api}/api/users`).then(res => {
            commit(FETCH_EMPLOYEES, res.body);
            resolve();
        })
        .catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

export function fetchCoordinators({ commit }) {
    return new Promise((resolve, reject) => {
        Vue.http.get(`${appConfig.api}/api/users/coordinators`)
            .then(res => {
                commit(FETCH_COORDINATORS, res.body);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

export function fetchUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
        Vue.http.get(`${appConfig.api}/api/users/${userId}`
        ).then(res => {
            (commit(FETCH_USER, res.body));
            resolve();
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    })
}

// edit employee actions

export function editEmployeeEmail({ commit }, email) {
    commit(EDIT_EMPLOYEE_EMAIL, email);
}

export function editEmployeePassword({ commit }, password) {
    commit(EDIT_EMPLOYEE_PASSWORD, password);
}

export function editEmployeeFirstname({ commit }, firstname) {
    commit(EDIT_EMPLOYEE_FIRSTNAME, firstname);
}

export function editEmployeeLastname({ commit }, lastname) {
    commit(EDIT_EMPLOYEE_LASTNAME, lastname);
}

export function editEmployeeCoordinator({ commit }, coordinator) {
    commit(EDIT_EMPLOYEE_COORDINATOR, coordinator);
}

export function editEmployeePhoneNumber({ commit }, phonenumber) {
    commit(EDIT_EMPLOYEE_EDIT_PHONE, phonenumber);
}

export function addEmployeePhoneNumber({ commit }) {
    commit(EDIT_EMPLOYEE_ADD_PHONE);
}

export function removeEmployeePhoneNumber({ commit }, phoneIndex) {
    commit(EDIT_EMPLOYEE_REMOVE_PHONE, phoneIndex);
}

export function editEmployeeSkype({ commit }, skype) {
    commit(EDIT_EMPLOYEE_SKYPE, skype);
}

export function editEmployeeTelegram({ commit }, telegram) {
    commit(EDIT_EMPLOYEE_TELEGRAM, telegram);
}

export function editEmployeeEnglish({ commit }, englishLevel) {
    commit(EDIT_EMPLOYEE_ENGLISH, englishLevel);
}

export function editEmployeePosition({ commit }, position) {
    commit(EDIT_EMPLOYEE_POSITION, position);
}

export function editEmployeeSchedule({ commit }, schedule) {
    commit(EDIT_EMPLOYEE_SCHEDULE, schedule);
}

export function editEmployeeContractLapse({ commit }, date) {
    commit(EDIT_EMPLOYEE_CONTRACTLAPSE, date);
}

export function editEmployeeHiringDate({ commit }, date) {
    commit(EDIT_EMPLOYEE_HIRINGDATE, date);
}

export function editEmployeePhotoUrl({ commit }, photoUrl) {
    commit(EDIT_EMPLOYEE_PHOTOURL, photoUrl);
}

export function setUploadingPhoto({ commit }, photo) {
    commit(SET_UPLOADING_PHOTO, photo);
}

export function uploadPhoto({ commit }, photo) {
    let form = new FormData();
    form.append('photo', photo);
    return new Promise((resolve, reject) => {
        Vue.http.post(`${appConfig.api}/api/users/upload`, form
        ).then(res => {
            resolve(res);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    })
};

export function addNewEmployee({ commit }, newEmployee) {
    return new Promise((resolve, reject) => {
        Vue.http.put(`${appConfig.api}/api/users/create`, newEmployee
        ).then(res => {
            (commit(ADD_NEW_EMPLOYEE, newEmployee));
            resolve();
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    })
};

export const fetchEmployee = ({ commit }, userId) => {
    return new Promise((resolve, reject) => {
        Vue.http.get(`${appConfig.api}/api/users/${userId}`
        ).then(res => {
            (commit(VIEW_EMPLOYEE, res.body));
            resolve();
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
};

export function viewEmployee({ commit }, employee) {
    commit(VIEW_EMPLOYEE, employee);
};

export function deleteEmployee({ commit }, userId) {
    return new Promise((resolve, reject) => {
        Vue.http.delete(`${appConfig.api}/api/users/delete/${userId}`).then(res => {
            commit(DELETE_EMPLOYEE, userId);
            resolve();
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    })
};

export function editEmployee({ commit }, payload) {
    return new Promise((resolve, reject) => {
        Vue.http.post(`${appConfig.api}/api/users/edit/${payload.userId}`, payload
        ).then(res => {
            commit(EDIT_EMPLOYEE, payload);
            resolve();
        }).catch(err => {
            console.error(err)
            reject(err);
        });
    })
};

export function changeSearchText({ commit }, searchText) {
    commit(SEARCH_EMPLOYEE, searchText);
}

// roles

export function fetchRoles({ commit }) {
    return new Promise((resolve, reject) => {
        Vue.http.get(`${appConfig.api}/api/roles`)
            .then(res => {
                commit(FETCH_ROLES, res.body);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

export function deleteRole({ commit }, id) {
    Vue.http.delete(`${appConfig.api}/api/roles/delete/${id}`)
        .then(res => {
            commit(DELETE_ROLE, res.body.id);
        }).catch(err => console.error(err));
}

export function changeRole({ commit }, payload) {
    return new Promise((resolve, reject) => {
        Vue.http.put(`${appConfig.api}/api/roles/edit/${payload.id}`, payload)
            .then(res => {
                commit(SAVE_ROLE, res.body);
                resolve();
            }).catch(err => {
                commit(CANCEL_EDIT_ROLE);
                reject(err);
                fetchRoles({ commit });
                console.error(err);
            });
    });
}

export function createNewRole({ commit }, newRole) {
    return new Promise((resolve, reject) => {
        Vue.http.post(`${appConfig.api}/api/roles/create`, {
            name: newRole
        })
        .then(res => {
            commit(SAVE_ROLE, res.body);
            resolve();
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

export function saveRole({ commit }, newRole) {
    if (newRole.id > 0) {
        changeRole({ commit }, newRole);
    } else {
        createNewRole({ commit }, newRole.name);
    }
}

export function addRole({ commit }, role) {
    commit(ADD_ROLE, role);
}
export function editRole({ commit }, roleId) {
    commit(EDIT_ROLE, roleId);
}

export function cancelEditRole({ commit }) {
    commit(CANCEL_EDIT_ROLE);
}

export function toggleRole({ commit }, index) {
    commit(TOGGLE_ROLE, index);
}

export function mapRoles({ commit }, roles) {
    commit(MAP_ROLES, roles);
}
// departments

export function fetchDepartments({ commit }) {
    return new Promise((resolve, reject) => {
        Vue.http.get(`${appConfig.api}/api/departments`)
            .then(res => {
                commit(FETCH_DEPARTMENTS, res.body);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

export function deleteDepartment({ commit }, id) {
    return new Promise((resolve, reject) => {
        Vue.http.delete(`${appConfig.api}/api/departments/delete/${id}`)
            .then(res => {
                commit(DELETE_DEPARTMENT, res.body.id);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

export function changeDepartment({ commit }, payload) {
    return new Promise((resolve, reject) => {
        Vue.http.put(`${appConfig.api}/api/departments/edit/${payload.id}`, payload)
            .then(res => {
                commit(SAVE_DEPARTMENT, res.body);
                resolve();
            }).catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

export function createNewDepartment({ commit }, newDepartment) {
    return new Promise((resolve, reject) => {
        Vue.http.post(`${appConfig.api}/api/departments/create`, {
            name: newDepartment
        })
        .then(res => {
            commit(SAVE_DEPARTMENT, res.body);
            resolve();
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

export function saveDepartment({ commit }, newDepartment) {
    if (newDepartment.id > 0) {
        changeDepartment({ commit }, newDepartment);
    } else {
        createNewDepartment({ commit }, newDepartment.name);
    }
}

export function addDepartment({ commit }, department) {
    commit(ADD_DEPARTMENT, department);
}

export function editDepartment({ commit }, depId) {
    commit(EDIT_DEPARTMENT, depId);
}

export function cancelEditDepartment({ commit }) {
    commit(CANCEL_EDIT_DEPARTMENT);
}

export function toggleDepartment({ commit }, index) {
    commit(TOGGLE_DEPARTMENT, index);
}

export function mapDepartments({ commit }, departments) {
    commit(MAP_DEPARTMENTS, departments);
}

// salary

export function updateSalary({ commit }, salary) {
    commit(UPDATE_SALARY, salary);
}

export function editSalary({ commit }, payload) {
    commit(EDIT_SALARY, payload);
}

export function updateSalaryAmount({ commit }, amount) {
    commit(UPDATE_SALARY_AMOUNT, amount);
}

export function updateSalaryCurrency({ commit }, currency) {
    commit(UPDATE_SALARY_CURRENCY, currency);
}

export function updateSalaryDate({ commit }, date) {
    commit(UPDATE_SALARY_DATE, date);
}

export function deleteSalary({ commit }, item) {
    commit(DELETE_SALARY, item);
}

export function addSalary({ commit }, newSalary) {
    commit(ADD_SALARY, newSalary);
}