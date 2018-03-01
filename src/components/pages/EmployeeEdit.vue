<template>
    <v-card color="grey lighten-3"  >
        <v-card-title v-if="!loading" class="employee-title employee-edit">
            <div class="employees-header">Edit Employee
                <v-tooltip bottom>
                    <v-btn v-show="!isSelfUser()" flat icon color="black" slot="activator" @click="confirmDelete()">
                        <v-icon color="grey">mdi-delete</v-icon>
                    </v-btn>
                    <span>Delete employee</span>
                </v-tooltip>
            </div>
        </v-card-title>
        <v-card-text v-if="!loading" class="employees-text">
            <v-form v-model="valid" ref="form" lazy-validation novalidate>
                <EmployeeMainInfo v-bind:coordinatorRequired="coordinatorRequired" />
                <v-layout row class="roles-dep-wrapper">
                    <v-flex d-flex>
                        <EmployeeRole v-bind:tryValidate="this.tryValidate"/>
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
                    <v-btn @click="submit" color="primary" class="add-confirm-button" :loading="saving" :disabled="saving" >Save</v-btn>
                    <v-btn @click="goBack" color="primary" class="back ml-0">Back</v-btn>
                </div>
            </v-form>
            <modal v-if='confirmModal' @confirm='deleteUserConfirm' @cancel='cancelDelete' :text=null :item="`${employee.firstname} ${employee.lastname}`"></modal>
            <success-sending v-bind:content="content" v-if='success' @ok='ok'></success-sending>
        </v-card-text>
        <v-card-text v-else class="progress-loading">
            <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="indigo"></v-progress-circular>
        </v-card-text>
            <v-dialog v-model="isEmployeeChangeNotSaved" persistent max-width="290">
              <v-card>
                <v-card-title class="headline">Confirmation required</v-card-title>
                <v-card-text>Are you sure want to leave this page? Unsaved changes will be lost.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" flat @click.native="isEmployeeChangeNotSaved = false">Cancel</v-btn>
                  <v-btn color="green darken-1" flat @click.native="routeWithoutSave">Ok</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
    import ModalComponent from '@/components/common/modal.component';
    import SuccessSending from '@/components/reusable/success-sending';

    import { ADD_EMPLOYEE } from '@/store/modules/employees/mutation-types';
    import { mapActions, mapGetters } from 'vuex';
    import filterUnits from '@/components/common/filter-units';

    export default {
        name: 'employee-edit',
        components: {
            EmployeeContactInfo,
            EmployeeDepartment,
            EmployeeEnglishLevel,
            EmployeeMainInfo,
            EmployeePosition,
            EmployeeRole,
            EmployeeSalaryHistory,
            'modal': ModalComponent,
            'success-sending': SuccessSending
        },
        data: function () {
            return {
                confirmModal: false,
                valid: true,
                tryValidate: false,
                coordinatorRequired: false,
                success: false,
                loading: false,
                saving: false,
                content: {},
                initEmployee: {
                    employeeInfo: {},
                    employeeRoles: {},
                    employeeDepartments: {},
                    uploadingPhoto: {}
                },
                isEmployeeChangeNotSaved: false,
                routeTo: '',
                routeWithSaveConfirmed: false
            }
        },
        created() {
            const id = this.$route.params.userId;
            this.loading = true;
            this.$store.dispatch('fetchEmployee', id).then(res => {
                this.$store.dispatch('fetchRoles').then(res => {
                    this.$store.dispatch('fetchDepartments').then(res => {
                        this.$store.dispatch('fetchCoordinators').then(res => {
                            this.loading = false;
                            this.saveEmployeeState();
                        }, err => this.loading = false);
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
        beforeRouteLeave(to, from, next){ 
            this.routeWithSaveConfirmed && next();
            (this.initEmployee.employeeInfo !== JSON.stringify(this.employee) || 
            this.initEmployee.employeeRoles !== JSON.stringify(this.roles) || 
            this.initEmployee.employeeDepartments !== JSON.stringify(this.departments) ||
            this.initEmployee.uploadingPhoto !== this.uploadingPhoto) ? 
            this.isEmployeeChangeNotSaved = true : next();
            this.routeTo = to.path;
        },
        methods: {
            submit() {
                this.tryValidate = true;
                const checkedRoles = this.roles.filter(x => x.checked);
                const checkedDepartments = this.departments.filter(x => x.checked);
                if (checkedRoles.length && 
                    (checkedRoles.some(c => c.name.trim().toLowerCase() === 'chief') || 
                    checkedRoles.every(c => c.name.trim().toLowerCase() === 'administrator'))) {
                    this.coordinatorRequired = false;
                } else {
                    this.coordinatorRequired = true;
                }
                this.$refs.form.watchInputs();
                if (this.$refs.form.validate() &&
                    checkedRoles.length &&
                    checkedDepartments.length &&
                    (!this.coordinatorRequired || this.employee.coordinator)) {
                        this.coordinatorRequired = false;
                        this.saving = true;
                        this.$store.dispatch('mapRoles', checkedRoles);
                        this.$store.dispatch('mapDepartments', checkedDepartments);
                        if (this.uploadingPhoto) {
                            this.uploadPhotoAndSave();
                        } else {
                            this.saveEmployee();
                        }
                } else {
                    window.scrollTo(0, 0);
                }
            },
            uploadPhotoAndSave() {
                this.$store.dispatch('uploadPhoto', this.uploadingPhoto).then(res => {
                    this.$store.dispatch('editEmployeePhotoUrl', res.body).then(res => {
                        this.saveEmployee();
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
            saveEmployee() {
                this.saveEmployeeState();
                this.$store.dispatch('editEmployee', this.employee).then(res => {
                    this.saving = false;
                    this.success = true;
                    this.content = { title: 'Saved', text: 'Successfully completed' };
                }, err => {
                    this.success = true;
                    this.saving = false;
                    this.content = { title: 'Error', text: 'A user with this email already exists' };
                });
            },
            goBack() {
                this.$router.push('/employees');
            },
            confirmDelete() {
                this.confirmModal = true;
            },
            cancelDelete() {
                this.confirmModal = false;
            },
            deleteUserConfirm() {
                this.confirmModal = false;
                const id = this.$route.params.userId;
                this.$store.dispatch('deleteEmployee', id).then(res => {
                    this.$router.push('/employees');
                });
                
            },
            isSelfUser() {
                return this.$route.params.userId === this.$store.state.user.user.UserId;
            },
            ok() {
                this.success = false;
            },
            routeWithoutSave() {
                this.isEmployeeChangeNotSaved = false;
                this.routeWithSaveConfirmed = true;
                this.$router.push(this.routeTo);
            },
            saveEmployeeState() {
                this.initEmployee.employeeRoles = JSON.stringify(this.roles);
                this.initEmployee.employeeDepartments = JSON.stringify(this.departments); 
                this.initEmployee.employeeInfo = JSON.stringify(this.employee);
                this.initEmployee.uploadingPhoto = this.uploadingPhoto;
            }
        }
    }
</script>
<style scoped>
    .progress-loading {
        justify-content: center;
        align-items: center;
        display: flex;
        min-height: 100%;
    }
    @media(max-width:600px) {
        .layout.row {
            flex-direction: column;
        }
        .ma-2.card-checkbox.card {
            margin: 7px !important;
        }
    }
</style>
