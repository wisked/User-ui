<template>
    <div class="employees-full-width">
        <div class="hidden-sm-and-down full-height">
            <v-card color="grey lighten-3" class="full-height-card">
                <v-card-title v-if="!loading" class="employees-title">
                    <div class="employees-header">
                        <span class="employees-add">Employees</span>
                        <v-tooltip bottom color="grey">
                            <v-btn flat color="black" slot="activator" @click="addEmployee" class="qusers-add-button-icon">
                                <v-icon class="employees-add-icon" large color="indigo">mdi-plus</v-icon>
                            </v-btn>
                            <span>Add new employee</span>
                        </v-tooltip>

                    </div>
                    <v-spacer></v-spacer>
                    <v-menu offset-overflow min-width="130px" max-height="260px" content-class="sort-menu">
                        <v-tooltip bottom slot="activator">
                            <v-btn flat icon slot="activator" class="btn-sort-employee">
                                <v-icon color="grey">sort</v-icon>
                            </v-btn>
                            <span>Sort</span>
                        </v-tooltip>
                        <v-list>
                            <v-list-tile v-for="item in getOrderProps()" :class="{ propertySelected: item.clicked }" :key="item.name" @click="setOrder(item)"
                                class="small-drop">
                                {{ item.name }}
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                    <v-tooltip bottom class="btn-span">
                        <v-btn flat icon slot="activator" class="btn-view-module" @click="toggleView">
                            <v-icon color="grey">{{viewModuleIconName}}</v-icon>
                        </v-btn>
                        <span>View module</span>
                    </v-tooltip>
                </v-card-title>

                <div v-if="!loading" class="employee-container">
                    <v-layout v-if="cardMode" row wrap>
                        <div v-for="(employee, key) in orderByOptions(employees, options.order, options.descending)" :key="key" class="user-card">
                            <v-card color="grey lighten-4">
                                <v-card-title class="card-title" @click="editEmployee(employee.userId)" v-bind:class="{ light: employee.isCoordinator }">
                                    <div class="user-photo ml-0">
                                        <v-avatar size="40px">
                                            <img :src="srcPhoto(employee.photoUrl)">
                                        </v-avatar>
                                    </div>
                                    <div class="user-title-container">
                                        <p class="username">
                                            <span class="employee-word-nowrap">{{employee.lastName}}</span>
                                            <span class="employee-word-nowrap">{{employee.firstName}}</span>
                                        </p>
                                        <p class="user-role">
                                            <span class="employee-word-nowrap" v-for="(role, key) in employee.roles" :key="key">{{role.name}}</span>
                                        </p>
                                    </div>
                                </v-card-title>
                                <v-card-text class="card-text pr-0">
                                    <v-layout row flex align-center>
                                        <v-flex xs10 class="employee-info">
                                            <v-layout row wrap>
                                                <v-flex xs6 pl-1 pr-1 class="item-flex desktop-first-row card-description">
                                                    <p class="employee-card-text">
                                                        <v-icon>mdi-account-box</v-icon> Position
                                                    </p>
                                                    <p class="employee-card-description">
                                                        <span class="employee-word-nowrap">{{employee.position}}</span>
                                                    </p>
                                                </v-flex>
                                                <v-flex xs6 pl-1 pr-1 class="item-flex desktop-first-row card-description">
                                                    <p class="employee-card-text">
                                                        <v-icon>mdi-currency-usd</v-icon> Salary</p>
                                                    <p class="employee-card-description">
                                                        <span class="employee-word-nowrap" v-if="employee.currentSalary">{{employee.currentSalary.amount}} {{employee.currentSalary.currency.name}}</span>
                                                    </p>
                                                </v-flex>
                                                <v-flex xs6 pl-1 pr-1 class="item-flex card-description">
                                                    <p class="employee-card-text">
                                                        <v-icon>mdi-phone</v-icon> Telephone</p>
                                                    <p class="employee-card-description">
                                                        <span class="employee-word-nowrap phone-number">
                                                            <a class="link" :href="`tel:${employee.phoneNumber}`">{{employee.phoneNumber}} </a>
                                                        </span>
                                                    </p>
                                                </v-flex>
                                                <v-flex xs6 pl-1 pr-1 class="item-flex card-description">
                                                    <p class="employee-card-text">
                                                        <v-icon>mdi-calendar-blank</v-icon> Schedule</p>
                                                    <p class="employee-card-description">
                                                        <span class="employee-word-nowrap">{{employee.schedule|| "fixed"}}</span>
                                                    </p>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs2>
                                            <v-layout column flex align-center justify-space-between class="mr-0 ml-0 pl-0 pr-0 desktop-employees-layout">
                                                <v-card-actions class="user-card-actions" v-for="(social, key) in socials" :key="key" v-if="employee[social.propName]">
                                                    <v-tooltip bottom>
                                                        <v-btn flat icon color="indigo" class="md-icon-button" slot="activator" v-clipboard:copy="employee[social.propName]">
                                                            <v-icon class="desktop-social-icons">{{social.iconClass}}</v-icon>
                                                        </v-btn>
                                                        <span>Copy to clipboard</span>
                                                    </v-tooltip>
                                                </v-card-actions>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                        </div>
                    </v-layout>
                    <v-layout v-if="!cardMode">
                        <v-data-table :items="orderByOptions(employees, options.order, options.descending)" class="elevation-1 employee-table" hide-headers
                            v-bind:pagination.sync="pagination">
                            <template slot="items" slot-scope="props">
                                <tr @click="editEmployee(props.item.userId)" class="table-row">
                                    <td class="name-cell">
                                        <div class="employee-row-cell image-cell pa-3">
                                            <v-avatar size="40px">
                                                <img :src="srcPhoto(props.item.photoUrl)" class="img-table">
                                            </v-avatar>
                                            <div class="image-two-rows">
                                                <p class="username">
                                                    <span class="employee-word-nowrap table-desktop-name">{{props.item.lastName}} {{props.item.firstName}}</span>
                                                </p>
                                                <p class="user-role-table">
                                                    <span v-for="(role, key) in props.item.roles" :key="key">{{role.name}}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="position-cell">
                                        <div class="employee-row-cell pt-3 pb-3">
                                            <p>
                                                <v-icon>mdi-account-box</v-icon>
                                                <span class="table-desktop-text">Position</span>
                                            </p>
                                            <p class="username">
                                                <span class="table-desktop-info">{{props.item.position}}</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td class="salary-cell">
                                        <div class="employee-row-cell pt-3 pb-3">
                                            <p>
                                                <v-icon>mdi-currency-usd</v-icon>
                                                <span class="table-desktop-text">Salary</span>
                                            </p>
                                            <p class="username">
                                                <span class="table-desktop-info" v-if="props.item.currentSalary">{{props.item.currentSalary.amount}} {{props.item.currentSalary.currency.name}}</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td class="telephone-cell">
                                        <div class="employee-row-cell pt-3 pb-3">
                                            <p>
                                                <v-icon>mdi-phone</v-icon>
                                                <span class="table-desktop-text">Telephone</span>
                                            </p>
                                            <p class="username">
                                                <span class="phone-number table-desktop-info">{{props.item.phoneNumber}}</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td class="schedule-cell">
                                        <div class="employee-row-cell pt-3 pb-3">
                                            <p>
                                                <v-icon>mdi-calendar-blank</v-icon>
                                                <span class="table-desktop-text">Schedule</span>
                                            </p>
                                            <p class="username">
                                                <span class="table-desktop-info">{{props.item.schedule || "fixed"}}</span>
                                            </p>
                                        </div>
                                    </td>
                                    <td class="social-cell">
                                        <div class="social-wrapper">
                                            <v-tooltip bottom v-for="(social, key) in socials" :key="key" v-if="props.item[social.propName]">
                                                <v-btn @click.stop flat icon color="grey darken-1" class="md-icon-button" slot="activator" v-clipboard:copy="props.item[social.propName]">
                                                    <v-icon>{{social.iconClass}}</v-icon>
                                                </v-btn>
                                                <span>Copy to clipboard</span>
                                            </v-tooltip>
                                        </div>
                                    </td>
                                </tr>
                            </template>
                            <template slot="expand" slot-scope="props">
                                <v-card flat>
                                    <v-card-text>{{props.item.name}}</v-card-text>
                                </v-card>
                            </template>
                        </v-data-table>
                    </v-layout>
                </div>
                <v-card-text v-else class="progress-loading">
                    <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="indigo"></v-progress-circular>
                </v-card-text>

            </v-card>
        </div>
        <div v-if="!loading" class="hidden-sm-and-up">
            <div class="employees-header">
                <span class="employees-add">Employees</span>
                <v-tooltip class="employees-add-button" bottom color="grey">
                    <v-btn class="qusers-add-button-icon" flat color="black" slot="activator" @click="addEmployee">
                        <v-icon class="employees-add-icon" color="indigo">mdi-plus</v-icon>
                    </v-btn>
                    <span>Add new employee</span>
                </v-tooltip>
            </div>
            <div class="employees-info">
                <div v-for="(employee, key) in paginateEmployees" :key="key" class="employee-info-tile" @click="employeeViewMobile(employee.userId)">
                    <div class="employee-avatar">
                        <v-avatar size="35px">
                            <img :src="srcPhoto(employee.photoUrl)" alt="avatar">
                        </v-avatar>
                    </div>
                    <div class="employee-personal">
                        <div class="employee-name mr-2">
                            <span class="employee-word-nowrap">{{employee.lastName}} {{employee.firstName}}</span>
                        </div>
                        <div class="employee-roles mr-2">
                            <span class="employee-role" v-for="(role, key) in employee.roles" :key="key">{{role.name}}</span>
                        </div>
                    </div>
                    <div class="employee-more-info">
                        <div class="employee-more-info-button">
                            <v-btn icon class="menu-button" slot="activator">
                                <v-icon class="material-icons">mdi-chevron-right</v-icon>
                            </v-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="hidden-xs-only hidden-md-and-up">
            <employees-tablet></employees-tablet>
        </div>
        <div class="hidden-md-and-up" v-if="!this.paginationEmployees.resultCount && !loading">
            <v-layout row wrap text-xs-center>
                <v-flex xs12>
                    <v-card class="mb-4 ml-3 mr-3">
                        <div class="pt-3 pb-3">No data available</div>
                    </v-card>
                </v-flex>
        </v-layout>
    </div>
    <div v-if="!loading" class="expansion-pagination hidden-md-and-up">
        <div class="pagination-elements">
            <v-btn icon class="menu-button prev-page-button" slot="activator" @click="prevPage()">
                <v-icon class="material-icons" color="white">mdi-chevron-left</v-icon>
            </v-btn>
            <span class="pagination-info"> {{ this.paginationEmployees.currentItemsPerPage }}-{{ this.paginationEmployees.currentMaxItemsPerPage }} of {{this.paginationEmployees.resultCount}} </span>
            <v-btn icon class="menu-button next-page-button" slot="activator" @click="nextPage()">
                <v-icon class="material-icons" color="white">mdi-chevron-right</v-icon>
            </v-btn>
        </div>
    </div>
    <div v-else class="progress-loading">
        <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="indigo"></v-progress-circular>
    </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import employeesTablet from '@/components/adaptive/employees-tablet';
    import socials from '@/constants/socials';
    import employeeMixin from '@/constants/employee-mixin';

    export default {
        name: 'employees-list',
        components: {
            'employees-tablet': employeesTablet
        },
        data: function () {
            return {
                socials: socials,
                orderProps: [
                    { name: 'Last Name', value: 'lastName' },
                    { name: 'Email', value: 'email' },
                    { name: 'Is coordinator', value: 'isCoordinator' },
                    { name: 'Coordinator', value: 'coordinator.lastname' },
                    { name: 'Position', value: 'position' },
                    { name: 'Schedule', value: 'schedule' },
                    { name: 'Experience', value: 'period' }
                ],
                viewModuleIconName: 'mdi-view-list',
                pagination: {},
                loading: false,
                paginationEmployees: {
                    currentPage: 1,
                    itemsPerPage: 10,
                    resultCount: 0,
                    currentItemsPerPage: 0,
                    currentMaxItemsPerPage: 0
                }
            };
        },
        created() {
            this.loading = true;
            this.$store.dispatch('fetchEmployees').then(res => {
                this.loading = false;
            }, err => this.loading = false);
        },
        computed: {
            ...mapGetters({
                employees: 'getEmployees',
                cardMode: 'getCardMode',
                options: 'getOptions',
            })
        },
        setOrder: function (item) {
            this.editOptions(item);
            this.orderProps.forEach(entry => {
                entry.clicked === true && (entry.clicked = false);
            });
            item.clicked = true;
        },
        mixins: [employeeMixin],
        methods: {
            ...mapActions(['editCardMode', 'editOptions']),
            setOrder: function (item) {
                this.editOptions(item);
                this.orderProps.forEach(entry => {
                    entry.clicked && (entry.clicked = false);
                });
                item.clicked = true;
            },
            toggleView: function () {
                this.editCardMode();
                this.viewModuleIconName =
                    this.viewModuleIconName === 'mdi-view-module'
                        ? 'mdi-view-list'
                        : 'mdi-view-module';
            },
            orderByOptions: function (arrayToOrder, prop, descending) {
                let orderedArray;
                arrayToOrder = this.filterEmplooyees(arrayToOrder);
                if (prop === 'coordinator.lastname') {
                    arrayToOrder.forEach(entry => {
                        if (!entry.coordinator)
                            entry.coordinator = { lastname: '' };
                    });
                    orderedArray = arrayToOrder.slice().sort((a, b) => {
                        return a.coordinator.lastname < b.coordinator.lastname
                            ? -1
                            : 1;
                    });
                } else {
                    orderedArray = arrayToOrder.slice().sort((a, b) => {
                        return (a[prop] ? a[prop] : '') < (b[prop] ? b[prop] : '')
                            ? -1
                            : 1;
                    });
                }
                return descending ? orderedArray : orderedArray.reverse();
            },
            getOrderProps: function () {
                this.orderProps.forEach(entry => {
                    entry.value === this.options.order && (entry.clicked = true);
                });
                return this.orderProps;
            },
            employeeViewMobile: function (id) {
                this.$store.dispatch('setGoBack', true);
                return this.$router.push({
                    name: 'EmployeeViewMobile',
                    params: { userId: id }
                });
            }
        }
    }
</script>

<style>
    .card-title {
        background-color: #3f51b5;
        color: white;
        height: 72px;
        cursor: pointer;
    }

    .user-card .card-title {
        flex-wrap: nowrap;
    }

    .light {
        background-color: #2F80ED;
    }

    .truncated-text {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .user-card {
        min-width: 250px;
        width: calc(100% - 14px);
        margin: 10px;
    }

    .user-card .card {
        border-radius: 3px;
    }

    .user-card .user-card-footer {
        font-size: 14px;
        padding: 8px;
        color: #808080;
        height: 80px;
    }

    .user-card p i {
        font-size: 22px;
        margin-top: 1px;
    }

    .user-card .card-text {
        padding: 10px 0 10px 10px !important;
    }

    .card-text {
        height: 155px;
    }

    @media screen and (max-width: 600px) {
        .employees-add-button {
            position: absolute !important;
            right: 1px !important;
            top: -5px !important;
        }
        .user-card {
            width: calc(100% - 14px);
        }
        .employee-info-tile {
            height: 61px;
            width: 100%;
            display: flex;
            flex-direction: row;
            cursor: pointer;
        }
        .employees-info {
            display: flex;
            flex-direction: column;
            min-width: 100px;
            margin: 10px;
            margin-top: 11px;
            -webkit-box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)!important;
            box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12)!important;
        }
        .employee-avatar {
            display: flex;
            flex-direction: row;
            align-content: center;
            align-items: center;
            min-height: 70px;
            min-width: 70px;
            padding-left: 14px;
            margin-top: -5px;
        }
        .employee-more-info {
            width: 10%;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            border-bottom: 1px solid rgba(0, 0, 0, .12);
        }
        .employee-personal {
            width: 90%;
            padding-top: 16px;
            margin-left: -2px;
            border-bottom: 1px solid rgba(0, 0, 0, .12);
            overflow: hidden;
        }
        .employee-name {
            font-size: 13px;
            margin-top: -3px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .employee-position {
            margin-top: -1px;
        }
        .employee-more-info-button {
            margin-top: 5px;
            margin-right: -6px;
        }
        .employees-add {
            margin-top: 8px;
            font-size: 16px;
            margin-left: 11px;
        }
        .employees-header {
            position: relative;
            margin-top: 10px;
            padding-bottom: 4px;
        }
        .employee-roles {
            margin-left: -1px;
            margin-top: -4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .employee-role {
            font-size: 12px;
            padding-left: 2px;
            padding-right: 2px;
            color: rgba(0, 0, 0, .60) !important;
        }
        .employees-add-icon {
            font-size: 2.5rem;
        }
    }

    @media screen and (min-width: 601px) {
        .user-card {
            width: calc(50% - 20px);
        }
    }

    @media screen and (min-width: 1370px) {
        .user-card {
            width: calc(33.3% - 20px);
        }
    }

    @media screen and (min-width: 1900px) {
        .user-card {
            width: calc(25% - 20px);
        }
    }

    a.link {
        text-decoration: none;
        color: #808080;
    }

    .employees-header {
        font-size: 24px;
        padding-left: 11px;
    }

    .employees-add {
        margin-right: 14px;
    }

    .btn-view-module {
        margin-right: 10px;
        margin-top: 9px;
    }

    .card__title.employees-title {
        padding-bottom: 5px;
        padding-top: 10px;
        padding-right: 13px;
    }

    .user-photo {
        margin-right: 10px;
    }

    .user-title-container {
        max-width: calc(100% - 70px);
    }

    .username {
        margin-left: 10px;
        font-size: 16px;
        margin-top: 18px;
        margin-bottom: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .user-role {
        margin-left: 10px;
        margin-bottom: 18px;
        color: lightgray;
        text-overflow: ellipsis;
        overflow: hidden;

    }

    .user-role-table {
        margin-left: 10px;
        margin-bottom: 18px;
        font-weight: normal !important;
        color: gray !important;
        font-size: 12px !important;
        overflow: hidden;
        max-width: 150px;
        text-overflow: ellipsis;
    }

    .user-role span,
    .user-role-table span {
        margin-right: 15px;
    }

    .position-row {
        height: 50px !important;
    }

    .employee-table {
        margin: 10px 10px 30px;
    }

    .employee-table tr {
        padding: 0 !important;
    }

    .employee-table td {
        height: 71px;
        padding: 0 !important;
    }

    .employee-row-cell {
        height: 71px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }

    .employee-row-cell.image-cell {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
    }

    .image-two-rows {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: space-between;
        margin-left: 18px;
        margin-top: -2px;
        overflow: hidden;
    }

    .card-column p,
    .employee-row-cell p {
        margin: 0 !important;
        font-size: 14px;
        line-height: 20px;
        color: black;
    }

    .card-column p i,
    .employee-row-cell p i {
        font-size: 22px;
    }

    .card-column span,
    .employee-row-cell:not(.image-cell) .table-desktop-info {
        font-size: 12px;
        line-height: 20px;
        margin-left: 28px;
    }

    .card-column span {
        margin-top: -4px;
    }

    .social-cell .btn {
        margin: 0 !important;
        margin-top: 10px !important;
    }

    .social-cell .flex {
        padding: 8px 0 !important;
    }

    .phone-number a,
    .phone-number {
        color: #2F80ED !important;
        text-decoration: underline !important;
    }

    .employee-table .social-cell .layout {
        margin-right: 0px !important;
    }

    span.tooltip,
    span.tooltip>span {
        margin: 0 !important;
    }

    .card-social-actions {
        margin-top: 5px;
    }

    .card-social-actions button {
        background-color: #F2F2F2 !important;
        border-radius: 2px;
    }

    .card-social-actions button .btn__content::before {
        border-radius: 2px !important;
    }

    .card-column span:not(.phone-number),
    .user-role-table span,
    .table-desktop-info {
        color: grey;
    }

    .card-social-actions button .ripple__container {
        display: none;
    }

    .card-column {
        margin-top: 2px;
    }

    .card-column .flex {
        margin-bottom: 27px;
        position: relative;
    }

    .user-card .absolute-span {
        position: absolute;
        color: #808080;
        font-size: 12px;
        left: 31px;
        top: 18px;
    }

    .table-row {
        cursor: pointer;
    }

    .propertySelected {
        background: #EEEEEE;
    }

    .employee-container {
        padding-left: 20px;
        padding-right: 20px;
    }

    .progress-loading {
        justify-content: center;
        align-items: center;
        display: flex;
        min-height: 100%;
    }

    .social-wrapper {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
        flex-wrap: wrap;
    }

    .social-cell {
        width: 10.2%;
    }

    .schedule-cell {
        width: 17.8%;
    }

    .salary-cell {
        width: 17.2%;
    }

    .position-cell,
    .telephone-cell {
        width: 16.5%;
    }

    .name-cell {
        width: 21.8%;
    }

    .employee-table .datatable.table {
        table-layout: fixed;
    }

    @media screen and (max-width: 1405px) {
        .position-cell {
            width: 12%;
        }
        .salary-cell,
        .schedule-cell,
        .telephone-cell {
            width: 15%;
        }
        .social-cell {
            width: 13%;
        }
        .name-cell {
            width: 30%;
        }
    }

    @media screen and (max-width: 1260px) {
        .position-cell {
            width: 13.5%;
        }
        .salary-cell,
        .schedule-cell,
        .telephone-cell {
            width: 15%;
        }
        .social-cell {
            width: 14.5%;
        }
    }

    @media screen and (max-width: 1120px) {
        .name-cell {
            width: 27%;
        }
        .social-cell {
            width: 17.5%;
        }
    }

    @media screen and (max-width: 1090px) {
        .table-desktop-text {
            font-size: 12px;
        }
        .employee-row-cell:not(.image-cell) .table-desktop-info {
            margin-left: 5px;
        }
    }

    @media screen and (max-width: 1000px) {
        .salary-cell {
            width: 13%;
        }
        .telephone-cell {
            width: 16%;
        }
        .social-cell {
            width: 18.5%;
        }
    }

    .img-table {
        margin-top: -6px;
        margin-left: -4px;
    }

    .card__actions.user-card-actions {
        padding: 12px 0 0;
    }

    .md-icon-button.card-action-button.btn {
        margin: 0;
    }

    .full-height {
        height: 100%;
    }

    .full-height-card {
        height: 100% !important;
    }

    .employee-info {
        align-self: flex-start;
        margin-top: 17px;
    }

    .user-card-actions button {
        background-color: #DEE1F2 !important;
        border-radius: 2px;
        height: 28px;
        width: 28px;
    }

    .desktop-social-icons {
        font-size: 20px;
    }

    .container.fill-height .desktop-employees-layout {
        height: 100px;
        margin-bottom: 10px;
    }

    .tem-flex {
        position: relative;
    }

    .desktop-first-row {
        margin-bottom: 25px;
    }

    .item-flex {
        position: relative;
    }

    .employee-word-nowrap {
        white-space: nowrap;
    }

    .user-card:last-child {
        margin-bottom: 30px;
    }

    .employees-full-width {
        max-width: 100%;
    }

    .card-description {
        overflow: hidden;
    }

    .employee-card-description {
        overflow: hidden;
        text-overflow: ellipsis;
        color: gray;
        margin-top: -7px;
        margin-right: 10px;
    }

    .employee-card-description span {
        margin-left: 25px;
        font-size: 12px;
    }

    .employee-card-description,
    .employee-card-text {
        margin-bottom: 0;
    }
</style>