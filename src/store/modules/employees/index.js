import * as actions from './actions';
import * as getters from './getters';
import {
    FETCH_EMPLOYEES,
    FETCH_COORDINATORS,
    FETCH_USER,

    ADD_EMPLOYEE,
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
    DELETE_ROLE,
    EDIT_ROLE,
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
// import { Store } from 'vuex';

const initialState = {
    all: [],
    coordinators: [],
    employee: {},
    roles: [],
    departments: [],
    newDepartment: '',
    newSalary: {},
    searchEmployees: '',
    uploadingPhoto: null
};

const mutations = {
    [FETCH_EMPLOYEES](state, employees) {
        state.all = [
            ...employees
        ];
    },

    [FETCH_COORDINATORS](state, coordinators) {
        state.coordinators = [
            '',
            ...coordinators
        ];
    },

    [ADD_EMPLOYEE](state) {
        state.employee = {
            contractLapse: '',
            coordinator: null,
            departments: [],
            email: '',
            englishLevel: '',
            firstname: '',
            hiringDate: '',
            isCoordinator: false,
            lastname: '',
            password: '',
            phoneNumbers: [{ number: '' }],
            position: '',
            roles: [],
            salaryHistory: [],
            schedule: '',
            skype: '',
            telegram: '',
            photoUrl: ''
        };
        state.uploadingPhoto = null;
    },

    [EDIT_EMPLOYEE_EMAIL](state, email) {
        state.employee = {
            ...state.employee,
            email
        };
    },

    [EDIT_EMPLOYEE_PASSWORD](state, password) {
        state.employee = {
            ...state.employee,
            password
        };
    },

    [EDIT_EMPLOYEE_FIRSTNAME](state, firstname) {
        state.employee = {
            ...state.employee,
            firstname
        };
    },

    [EDIT_EMPLOYEE_LASTNAME](state, lastname) {
        state.employee = {
            ...state.employee,
            lastname
        };
    },

    [EDIT_EMPLOYEE_COORDINATOR](state, coordinator) {
        state.employee = {
            ...state.employee,
            coordinator
        };
    },

    [EDIT_EMPLOYEE_EDIT_PHONE](state, phoneNumbers) {
        state.employee.phoneNumbers = [
            ...phoneNumbers
        ];
    },
    [EDIT_EMPLOYEE_ADD_PHONE](state) {
        state.employee.phoneNumbers = [
            ...state.employee.phoneNumbers,
            {}
        ];
    },

    [EDIT_EMPLOYEE_REMOVE_PHONE](state, index) {
        state.employee.phoneNumbers.splice(index, 1);
    },

    [EDIT_EMPLOYEE_SKYPE](state, skype) {
        state.employee = {
            ...state.employee,
            skype
        };
    },

    [EDIT_EMPLOYEE_TELEGRAM](state, telegram) {
        state.employee = {
            ...state.employee,
            telegram
        };
    },

    [EDIT_EMPLOYEE_ENGLISH](state, englishLevel) {
        state.employee = {
            ...state.employee,
            englishLevel
        };
    },

    [EDIT_EMPLOYEE_POSITION](state, position) {
        state.employee = {
            ...state.employee,
            position
        };
    },

    [EDIT_EMPLOYEE_SCHEDULE](state, schedule) {
        state.employee = {
            ...state.employee,
            schedule
        };
    },

    [EDIT_EMPLOYEE_CONTRACTLAPSE](state, contractLapse) {
        state.employee = {
            ...state.employee,
            contractLapse
        };
    },

    [EDIT_EMPLOYEE_HIRINGDATE](state, hiringDate) {
        state.employee = {
            ...state.employee,
            hiringDate
        };
    },

    [EDIT_EMPLOYEE_PHOTOURL](state, photoUrl) {
        state.employee = {
            ...state.employee,
            photoUrl
        };
    },

    [SET_UPLOADING_PHOTO](state, photo) {
        state.uploadingPhoto = photo;
    },

    [VIEW_EMPLOYEE](state, employee) {
        if (!employee.phoneNumbers || !employee.phoneNumbers.length) {
            employee.phoneNumbers = [{ number: '' }];
        }
        state.employee = employee;
        state.uploadingPhoto = null;
    },

    [ADD_NEW_EMPLOYEE](state, newEmployee) {
        state.all = [
            ...state.all,
            newEmployee
        ]
    },

    [EDIT_EMPLOYEE](state, employee) {
        state.employee = employee;
    },

    [DELETE_EMPLOYEE](state, userId) {
        const emplIndex = state.all.findIndex(item => item.userId === userId);
        state.all.splice(emplIndex, 1);
    },

    [SEARCH_EMPLOYEE](state, searchText) {
        state.searchEmployees = searchText;
    },

    // roles

    [FETCH_ROLES](state, roles) {
        state.roles = [
            ...roles.map((x) => {
                return {
                    name: x.name,
                    id: x.id,
                    editting: false,
                    checked: false,
                    editable: x.editable
                };
            })
        ];

        let rolesList = state.employee.roles;
        if (rolesList && rolesList.length) {
            state.roles.forEach(item => {
                item.checked = rolesList.some(elem => elem.id === item.id);
            });
        }
    },

    [DELETE_ROLE](state, role) {
        const roleIndex = state.roles.findIndex(item => item.id === role);
        state.roles.splice(roleIndex, 1);
    },

    [EDIT_ROLE](state, itemId) {
        state.roles.forEach(x => {
            x.editting = false;
        });
        const addedRoleIndex = state.roles.findIndex(item => item.id === -1);
        if (addedRoleIndex !== -1) {
            state.roles.splice(addedRoleIndex, 1);
        }
        const roleIndex = state.roles.findIndex(item => item.id === itemId);
        state.roles[roleIndex].editting = true;
    },

    [ADD_ROLE](state, role) {
        state.roles.forEach(x => {
            x.editting = false;
        });
        const addedRoleIndex = state.roles.findIndex(item => item.id === -1);
        if (addedRoleIndex !== -1) {
            state.roles.splice(addedRoleIndex, 1);
        }
        state.roles = [
            ...state.roles,
            role
        ]
    },

    [CANCEL_EDIT_ROLE](state) {
        const index = state.roles.findIndex(function(x) {
            return x.editting === true;
        });
        if (index !== -1) {
            if (state.roles[index].id > 0) {
                state.roles[index].editting = false;
            } else {
                state.roles.splice(index, 1);
            }
        }
    },

    [SAVE_ROLE](state, role) {
        const index = state.roles.findIndex(function(x) {
            return x.editting === true;
        });
        if (index !== -1) {
            state.roles[index].id = role.id;
            state.roles[index].editting = false;
        }
    },

    [TOGGLE_ROLE](state, item) {
        const index = state.roles.findIndex(function(x) {
            return x.id === item.id;
        });
        state.roles[index].checked = item.checked;
    },

    [MAP_ROLES](state, roles) {
        state.employee.roles = [
            ...roles.map(x => {
                return {
                    id: x.id,
                    name: x.name
                }
            })
        ]
    },

    // departments

    [FETCH_DEPARTMENTS](state, departments) {
        state.departments = [
            ...departments.map((x) => {
                return {
                    name: x.name,
                    id: x.id,
                    editting: false,
                    checked: false,
                    editable: true
                };
            })
        ];

        let departmentsList = state.employee.departments;
        if (departmentsList && departmentsList.length) {
            state.departments.forEach(item => {
                item.checked = departmentsList.some(elem => elem.id === item.id);
            });
        }
    },

    [SAVE_DEPARTMENT](state, department) {
        const index = state.departments.findIndex(function(x) {
            return x.editting === true;
        });
        if (index !== -1) {
            state.departments[index].id = department.id;
            state.departments[index].editting = false;
        }
    },

    [DELETE_DEPARTMENT](state, department) {
        const departmentIndex = state.departments.findIndex(item => item.id === department);
        state.departments.splice(departmentIndex, 1);
    },

    [EDIT_DEPARTMENT](state, itemId) {
        state.departments.forEach(x => {
            x.editting = false;
        });
        const addedDepIndex = state.departments.findIndex(item => item.id === -1);
        if (addedDepIndex !== -1) {
            state.departments.splice(addedDepIndex, 1);
        }
        const depIndex = state.departments.findIndex(item => item.id === itemId);
        state.departments[depIndex].editting = true;
    },

    [ADD_DEPARTMENT](state, department) {
        state.departments.forEach(x => {
            x.editting = false;
        });
        const addedDepIndex = state.departments.findIndex(item => item.id === -1);
        if (addedDepIndex !== -1) {
            state.departments.splice(addedDepIndex, 1);
        }
        state.departments = [
            ...state.departments,
            department
        ]
    },

    [CANCEL_EDIT_DEPARTMENT](state) {
        const index = state.departments.findIndex(function(x) {
            return x.editting === true;
        });
        if (index !== -1) {
            if (state.departments[index].id > 0) {
                state.departments[index].editting = false;
            } else {
                state.departments.splice(index, 1);
            }
        }
    },

    [TOGGLE_DEPARTMENT](state, item) {
        const index = state.departments.findIndex(function(x) {
            return x.id === item.id;
        });
        state.departments[index].checked = item.checked;
    },

    [MAP_DEPARTMENTS](state, departments) {
        state.employee.departments = [
            ...departments.map(x => {
                return {
                    id: x.id,
                    name: x.name
                };
            })
        ];
    },

    // salary

    [UPDATE_SALARY](state, newSalary) {
        state.newSalary = {
            ...newSalary
        }
    },

    [EDIT_SALARY](state, payload) {
        state.employee.salaryHistory.splice(payload.editIndex, 1, payload.newSalary);
    },

    [UPDATE_SALARY_AMOUNT](state, amount) {
        state.newSalary.amount = amount;
    },

    [UPDATE_SALARY_CURRENCY](state, currency) {
        state.newSalary.currency = currency;
        state.newSalary.currencyId = currency.id;
    },

    [UPDATE_SALARY_DATE](state, date) {
        const dateObj = new Date(date);
        state.newSalary.updatedDate = dateObj.toISOString();
    },

    [DELETE_SALARY](state, salaryIndex) {
        state.employee.salaryHistory.splice(salaryIndex, 1);
    },

    [ADD_SALARY](state, newSalary) {
        state.employee.salaryHistory = [
            ...state.employee.salaryHistory,
            newSalary
        ];
    },

    [FETCH_USER](state, user) {
        state.employee = user;
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