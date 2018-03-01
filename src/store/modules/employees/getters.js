export const getEmployees = state => state.all;
export const getCoordinators = state => state.coordinators;
export const getEmployee = state => state.employee;

export const getCoordinatorById = (state) => (id) => {
    return state.coordinators.find(item => item.userId === id);
};

export const getRoles = state => state.roles;

export const getDepartments = state => state.departments;

export const getSalaryHistory = state => state.employee.salaryHistory;

export const getSearchEmployees = state => state.searchEmployees;

export const getUploadingPhoto = state => state.uploadingPhoto;