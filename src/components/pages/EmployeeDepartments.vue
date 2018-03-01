<template>
    <v-card class="departs-card" color="grey lighten-3">
        <v-card-title v-if="!loading">
            <div class="departs-header">
                <span class="departs-add">Departments</span>
                <v-tooltip bottom class="add-department-btn">
                    <v-btn flat color="black" slot="activator" @click="addDepartment" class="qusers-add-button-icon">
                        <v-icon large color="indigo">mdi-plus</v-icon>
                    </v-btn>
                    <div>Add new department</div>
                </v-tooltip>
            </div>
            <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text v-if="!loading">
            <AppTable :data="tableData" :owner="'department'" :saving="saving" @deleteItem="deleteDepartmentItem" @saveItem="saveDepartment" @cancelEdit="cancelDepartmentEdit"
                @editItem="editDepartment" class="app-table" />
        </v-card-text>
        <v-card-text v-else class="progress-loading">
            <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="indigo"></v-progress-circular>
        </v-card-text>

    </v-card>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';

    import AppTable from '@/components/common/AppTable'

    export default {
        name: 'employee-departments',
        components: {
            AppTable
        },
        data() {
            return {
                loading: false,
                saving: false
            }
        },
        created() {
            this.loading = true;
            this.$store.dispatch('fetchDepartments').then(() => {
                this.loading = false;
            }, err => this.loading = false);
        },
        computed: {
            ...mapGetters({ departments: 'getDepartments' }),
            tableData() {
                return {
                    items: [
                        ...this.departments
                    ],
                }
            }
        },
        methods: {
            deleteDepartmentItem(index) {
                this.$store.dispatch('deleteDepartment', index);
            },
            addDepartment() {
                const newDepartment = {
                    id: -1,
                    name: '',
                    editting: true,
                    editable: true
                };
                this.$store.dispatch('addDepartment', newDepartment);
            },
            editDepartment(depId) {
                this.$store.dispatch('editDepartment', depId);
            },
            cancelDepartmentEdit() {
                this.$store.dispatch('cancelEditDepartment');
            },
            saveDepartment(payload) {
                this.saving = true;
                if (payload.id > 0) {
                    this.$store.dispatch('changeDepartment', payload).then(() => {
                        this.saving = false;
                    }, err => this.saving = false);
                } else {
                    this.$store.dispatch('createNewDepartment', payload.name).then(() => {
                        this.saving = false;
                    }, err => this.saving = false);
                }
                this.confirmDepartment = false;
            },
        }
    }
</script>
<style scoped>
    .departs-header {
        font-size: 24px;
        padding-left: 11px;
    }

    .departs-card.card .card__title {
        padding-top: 13px;
        padding-bottom: 10px;
    }

    .app-table {
        margin: 0 13px;
    }

    .departs-card.card .card__text {
        padding-top: 0;
    }
    .edit-icon.btn.btn--icon {
        margin-right: 50px !important;
    }
    .departs-add {
        margin-right: 15px;
    }
    .progress-loading {
        justify-content: center;
        align-items: center;
        display: flex;
        min-height: 100%;
    }
    @media screen and (max-width: 600px) {
        .app-table {
            margin: 0;
        }
        .card__text {
            padding-left: 8px;
            padding-right: 8px;
        }
        .add-department-btn {
            position: absolute;
            top: 5px;
            right: 0;
        }
        .departs-header {
            font-size: 14px;
        }
        .departs-card.card .card__title {
            padding-top: 20px;
            padding-bottom: 20px;
        }
    }

</style>