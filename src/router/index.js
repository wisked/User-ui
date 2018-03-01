import Vue from 'vue';
import Router from 'vue-router';

import Authentication from '@/components/pages/Authentication';
import Employees from '@/components/pages/Employees';
import EmployeeEdit from '@/components/pages/EmployeeEdit';
import EmployeeAddNew from '@/components/pages/EmployeeAddNew';
import EmployeeDepartments from '@/components/pages/EmployeeDepartments';
import EmployeeRoles from '@/components/pages/EmployeeRoles';
import EmployeeViewMobile from '@/components/pages/EmployeeViewMobile';

import AuthService from '../services/AuthService';

Vue.use(Router);

const router = new Router({
    routes: [
        {
            path: '/login',
            name: 'Authentication',
            component: Authentication
        },
        {
            path: '/',
            redirect: '/employees'
        },
        {
            path: '/employees',
            name: 'Employees',
            component: Employees,
            title: 'Employees',
            icon: 'mdi-account',
            beforeEnter: authRequired,
            meta: {
                showInMenu: true
            }
        },
        {
            path: '/edit/:userId',
            name: 'EmployeeEdit',
            component: EmployeeEdit,
            beforeEnter: authRequired,
            meta: {
                showInMenu: false
            }
        },
        {
            path: '/view/:userId',
            name: 'EmployeeViewMobile',
            component: EmployeeViewMobile,
            beforeEnter: authRequired,
            meta: {
                showInMenu: false
            }
        },
        {
            path: '/add',
            name: 'EmployeeAddNew',
            component: EmployeeAddNew,
            beforeEnter: authRequired,
            meta: {
                showInMenu: false
            }
        },
        {
            path: '/roles',
            name: 'EmployeeRoles',
            component: EmployeeRoles,
            title: 'Roles',
            icon: 'mdi-account-switch',
            beforeEnter: authRequired,
            meta: {
                showInMenu: false
            }
        },
        {
            path: '/departments',
            name: 'EmployeeDepartments',
            component: EmployeeDepartments,
            title: 'Departments',
            icon: 'mdi-home',
            beforeEnter: authRequired,
            meta: {
                showInMenu: true
            }
        }
    ]
});

function authRequired(to, from, next) {
    if (AuthService.isUserAuthenticated() && AuthService.isAdmin()) {
        next();
    } else {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }
}

export default router;