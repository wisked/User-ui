<template>
    <v-card color="grey lighten-3">
        <v-card-title v-if="!loading" class="employee-title">
            <div class="employees-header">Add Employees</div>
        </v-card-title>
        <v-card-text v-if="!loading" class="employees-text">
            <v-form name="newEmployeeForm" novalidate ref="form" v-model="valid" lazy-validation>
                <EmployeeMainInfo v-bind:newEmployee="true" v-bind:coordinatorRequired="coordinatorRequired" />
                <v-layout row class="roles-dep-wrapper">
                    <v-flex d-flex>
                        <EmployeeRole v-bind:tryValidate="this.tryValidate" />
                    </v-flex>
                    <v-flex d-flex>
                        <EmployeeDepartment v-bind:tryValidate="this.tryValidate" />
                    </v-flex>
                </v-layout>
                <EmployeeContactInfo />
                <EmployeeEnglishLevel />
                <EmployeePosition />
                <EmployeeSalaryHistory />
                <div class="buttons-confirm">
                    <v-btn @click="submit" color="primary" class="add-confirm-button" :loading="creating" :disabled="creating">Create</v-btn>
                    <v-btn @click="goBack" color="primary" class="back">Back</v-btn>
                </div>
            </v-form>
            <success-sending v-bind:content="content" v-if='success' @ok='ok'></success-sending>
        </v-card-text>
        <v-card-text v-else class="progress-loading">
            <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="indigo"></v-progress-circular>
        </v-card-text>

    </v-card>
</template>
<script>
    import EmployeeContactInfo from '@/components/reusable/EmployeeContactInfo';
    import EmployeeDepartment from '@/components/reusable/EmployeeDepartment';
    import EmployeeEnglishLevel from '@/components/reusable/EmployeeEnglishLevel';
    import EmployeeMainInfo from '@/components/reusable/EmployeeMainInfo';
    import EmployeePosition from '@/components/reusable/EmployeePosition';
    import EmployeeRole from '@/components/reusable/EmployeeRole';
    import EmployeeSalaryHistory from '@/components/reusable/EmployeeSalaryHistory';
    import SuccessSending from '@/components/reusable/success-sending';

    import { ADD_EMPLOYEE } from '@/store/modules/employees/mutation-types';
    import { mapActions, mapGetters } from 'vuex';
    import filterUnit from '@/components/common/filter-units';

    export default {
        name: 'employee-add-new',
        components: {
            EmployeeContactInfo,
            EmployeeDepartment,
            EmployeeEnglishLevel,
            EmployeeMainInfo,
            EmployeePosition,
            EmployeeRole,
            EmployeeSalaryHistory,
            'success-sending': SuccessSending
        },
        data: function () {
            return {
                success: false,
                valid: false,
                tryValidate: false,
                coordinatorRequired: false,
                loading: false,
                creating: false,
                content: {}
            }
        },
        created() {
            this.loading = true;
            this.$store.commit(ADD_EMPLOYEE);
            this.$store.dispatch('fetchRoles').then(res => {
                this.$store.dispatch('fetchDepartments').then(res => {
                    this.$store.dispatch('fetchCoordinators').then(res => {
                        this.loading = false;
                        this.initEmployee = this.employee;
                    }, err => this.loading = false);
                }, err => this.loading = false);
            }, err => this.loading = false);
        },
        computed: mapGetters({
            employee: "getEmployee",
            roles: "getRoles",
            departments: "getDepartments",
            uploadingPhoto: "getUploadingPhoto"
        }),
        methods: {
            submit() {
                this.tryValidate = true;
                this.$refs.form.watchInputs();
                const checkedRoles = this.roles.filter(x => x.checked);
                const checkedDepartments = this.departments.filter(x => x.checked);
                if (checkedRoles.length && 
                    (checkedRoles.some(c => c.name.trim().toLowerCase() === 'chief') ||
                    checkedRoles.every(c => c.name.trim().toLowerCase() === 'administrator'))) {
                    this.coordinatorRequired = false;
                } else {
                    this.coordinatorRequired = true;
                }
                if (this.$refs.form.validate() &&
                    checkedRoles.length &&
                    checkedDepartments.length &&
                    (!this.coordinatorRequired || this.employee.coordinator)) {
                        this.coordinatorRequired = false;
                        this.creating = true;
                        this.$store.dispatch('mapRoles', checkedRoles);
                        this.$store.dispatch('mapDepartments', checkedDepartments);
                        if (this.uploadingPhoto) {
                            this.uploadPhotoAndCreate();
                        } else {
                            this.createEmployee();
                        }

                } else {
                    window.scrollTo(0, 0);
                }
            },
            uploadPhotoAndCreate() {
                this.$store.dispatch('uploadPhoto', this.uploadingPhoto).then(res => {
                    this.$store.dispatch('editEmployeePhotoUrl', res.body).then(res => {
                        this.createEmployee();
                    }, err => {
                        this.success = true;
                        this.saving = false;
                        this.content = { title: 'Error', text: 'Can\'t edit the photo url' };
                    });
                }, err => {
                    this.success = true;
                    this.saving = false;
                    this.content = { title: 'Error', text: 'Can\'t upload the photo' };
                });
            },
            createEmployee() {
                this.$store.dispatch('addNewEmployee', this.employee).then(res => {
                    this.creating = false;
                    this.success = true;
                    this.content = { title: 'Created', text: 'Successfully completed' };
                    this.$router.push('/employees');
                }, err => {
                    this.success = true;
                    this.creating = false;
                    this.content = { title: 'Error', text: 'A user with this email already exists.' };
                })
            },

            goBack() {
                this.$router.go(-1);
            },
            ok() {
                this.success = false;
            }
        }
    }
</script>
</script>

<style scoped>
    .buttons-confirm {
        margin-top: 25px;
    }

    .employees-header {
        font-size: 24px;
        padding-left: 11px;
    }
    .progress-loading {
        justify-content: center;
        align-items: center;
        display: flex;
        min-height: 100%;
    }

    @media screen and (max-width: 600px) {

        .layout.row {
            flex-direction: column;
        }   
        .ma-2.card-checkbox.card {
            margin: 7px !important;
        }
        .employees-header {
            font-size: 16px;
            padding-left: 7px;
        }
        .add-confirm-button {
            margin-right: 0;
        }
    }
</style>