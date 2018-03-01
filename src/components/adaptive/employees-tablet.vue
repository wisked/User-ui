<template>
    <v-expansion-panel class="employee-expansion-panel">
        <div class="tablet-header">
            <span class="employees-add">Employees</span>
            <v-tooltip bottom color="grey">
                <v-btn flat color="black" slot="activator" @click="addEmployee" class="qusers-add-button-icon">
                    <v-icon large color="indigo">mdi-plus</v-icon>
                </v-btn>
                <span>Add new employee</span>
            </v-tooltip>

        </div>
        <v-expansion-panel-content v-for="(employee, key) in this.$parent.paginateEmployees" :key="key" class="tablet-employees">
            <div slot="header" class="avatar-header">
                <v-avatar size="36px">
                    <img :src="srcPhoto(employee.photoUrl)">
                </v-avatar>
            </div>
            <div slot="header" class="names-header">
                <p class="tablet-username mr-3">
                    <span class="employee-word-nowrap">{{employee.lastName}} {{employee.firstName}}</span>
                </p>
                <p class="tablet-roles mt-0">
                    <span class="employee-word-nowrap" v-for="(role, key) in employee.roles" :key="key">{{role.name}}</span>
                </p>
            </div>
            <v-card>
                <v-card-text class="text-employee-tablet pt-0 pb-3">
                    <v-layout row flex align-center>
                        <v-flex xs10 class="employee-info">
                            <v-layout row wrap>
                                <v-flex xs6 pl-1 pr-1 class="item-flex tablet-first-row">
                                    <p>
                                        <v-icon class="tablet-info">mdi-account-box</v-icon>
                                        <span class="item-title">Position</span>
                                    </p>
                                    <span class="absolute-span">{{employee.position}}</span>
                                </v-flex>
                                <v-flex xs6 pl-1 pr-1 class="item-flex tablet-first-row">
                                    <p>
                                        <v-icon class="tablet-info">mdi-currency-usd</v-icon>
                                        <span class="item-title">Salary</span>
                                    </p>
                                    <span class="absolute-span" v-if="employee.currentSalary">{{employee.currentSalary.amount}} {{employee.currentSalary.currency.name}}</span>
                                </v-flex>
                                <v-flex xs6 pl-1 pr-1 class="item-flex">
                                    <p>
                                        <v-icon class="tablet-info">mdi-phone</v-icon>
                                        <span class="item-title">Telephone</span>
                                    </p>
                                    <span class="absolute-span phone-number">
                                        <a class="link" :href="`tel:${employee.phoneNumber}`">{{employee.phoneNumber}} </a>
                                    </span>
                                </v-flex>
                                <v-flex xs6 pl-1 pr-1 class="item-flex">
                                    <p>
                                        <v-icon class="tablet-info">mdi-calendar-blank</v-icon>
                                        <span class="item-title">Schedule</span>
                                    </p>
                                    <span class="absolute-span">{{employee.schedule|| "fixed"}}</span>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex xs2 class="tablet-social-wrapper">
                            <v-layout column flex align-center justify-space-between class="mr-0 mt-1 pl-0 pr-0 social-layout">
                                <v-card-actions class="tablet-edit-actions">
                                    <v-tooltip class="delete-tooltip" bottom>
                                        <v-btn icon slot="activator" @click="editEmployee(employee.userId)" class="delete-icon">
                                            <v-icon color="grey" class="employee-edit">mdi-pencil</v-icon>
                                        </v-btn>
                                        <span>Edit</span>
                                    </v-tooltip>
                                </v-card-actions>

                                <v-card-actions v-for="(social,key) in socials" :key="key" v-if="employee[social.propName]" class="tablet-social-actions">
                                    <v-tooltip bottom>
                                        <v-btn flat icon color="indigo" class="md-icon-button" slot="activator" v-clipboard:copy="employee[social.propName]">
                                            <v-icon class="social-icons">{{social.iconClass}}</v-icon>
                                        </v-btn>
                                        <span>Copy to clipboard</span>
                                    </v-tooltip>
                                </v-card-actions>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import socials from '@/constants/socials';
    import employeeMixin from '@/constants/employee-mixin';
    export default {
        name: 'employeesTablet',
        data: function () {
            return {
                socials: socials
            }
        },
        computed: {
            ...mapGetters({
                employees: 'getEmployees',
                searchEmployees: 'getSearchEmployees'
            })
        },
        mixins: [employeeMixin],
    }
</script>

<style scoped>
    .tablet-header {
        margin-top: 14px;
        margin-bottom: 10px;
    }

    .tablet-roles {
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 20px;
    }

    .tablet-roles span {
        font-size: 12px;
        color: #808080;
        padding-right: 15px;
    }

    .expansion-panel__header .avatar-header {
        flex-grow: 0;
        margin-right: 20px;
    }

    .names-header {
        height: 100%;
        overflow: hidden;
    }

    .names-header p {
        margin-top: 10px;
        margin-bottom: 0;
    }

    .employee-expansion-panel>>>.expansion-panel__header {
        padding-top: 0;
        padding-bottom: 0;
    }

    .tablet-info {
        font-size: 21px;
        margin-right: 13px;
    }

    .item-title {
        font-size: 12px;
    }

    .text-employee-tablet {
        padding-left: 65px;
        margin-top: 10px;
    }

    .item-flex {
        position: relative;
    }

    .tablet-first-row {
        margin-bottom: 23px;
    }

    .social-icons {
        font-size: 18px;
    }

    .tablet-social-actions button {
        background-color: #DEE1F2 !important;
        border-radius: 2px;
    }

    .tablet-social-actions button,
    .tablet-edit-actions button {
        width: 25px;
        height: 25px;
    }

    .tablet-social-actions>>>.btn__content::before,
    .tablet-edit-actions>>>.btn__content::before {
        border-radius: 2px;
    }

    .tablet-social-actions button .ripple__container {
        display: none;
    }

    .tablet-social-wrapper {
        height: 140px;
        margin-top: -22px;
    }

    .social-layout {
        margin-left: 40px;
    }

    .absolute-span {
        position: absolute;
        left: 42px;
        top: 20px;
        color: #808080;
        font-size: 12px;
    }

    .absolute-span a {
        text-decoration: underline;
    }

    .employee-expansion-panel {
        box-shadow: none;
    }

    .tablet-edit-employee {
        position: absolute;
        top: 0;
        left: 30px;
    }

    .tablet-username {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .tablet-employees {
        overflow: hidden;
    }

    .tablet-edit-wrapper {
        height: 20px;
        position: relative;
    }

    .employee-edit {
        font-size: 20px;
    }
    .tablet-employees:last-child {
        margin-bottom: 24px;
    }
</style>