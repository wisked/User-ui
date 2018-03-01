<template>
    <v-card class="roles-card" color="grey lighten-3">
        <v-card-title v-if="!loading">
            <div class="roles-header">
                <span class="roles-add">Roles</span>
                <v-tooltip bottom>
                    <v-btn flat color="black" slot="activator" @click="addRole" class="qusers-add-button-icon">
                        <v-icon large color="indigo">mdi-plus</v-icon>
                    </v-btn>
                    <div>Add new role</div>
                </v-tooltip>
            </div>
            <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text v-if="!loading">
            <AppTable :data="tableData" :owner="'role'" :saving="saving" @deleteItem="deleteRoleItem" @saveItem="saveRole" @cancelEdit="cancelRoleEdit" @editItem="editRole"
                class="app-table" />
        </v-card-text>
        <v-card-text v-else class="progress-loading">
            <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="indigo"></v-progress-circular>
        </v-card-text>

    </v-card>
</template>
<script>
    import { mapGetters, mapActions } from 'vuex';

    import AppTable from '@/components/common/AppTable';

    export default {
        name: 'employee-roles',
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
            this.$store.dispatch('fetchRoles').then(() => {
                this.loading = false;
            }, err => this.loading = false);
        },
        computed: {
            ...mapGetters({ roles: 'getRoles' }),
            tableData() {
                return {
                    items: [
                        ...this.roles
                    ],
                }
            }
        },
        methods: {
            deleteRoleItem(index) {
                this.$store.dispatch('deleteRole', index);
            },
            saveRole(val) {
                this.saving = true;
                if (val.id > 0) {
                    this.$store.dispatch('changeRole', val).then(() => {
                        this.saving = false;
                    }, err => this.saving = false);
                } else {
                    this.$store.dispatch('createNewRole', val.name).then(() => {
                        this.saving = false;
                    }, err => this.saving = false);
                }
            },
            addRole() {
                const newRole = {
                    id: -1,
                    name: '',
                    editting: true,
                    editable: true
                };
                this.$store.dispatch('addRole', newRole);
            },
            editRole(roleId) {
                this.$store.dispatch('editRole', roleId);
            },
            cancelRoleEdit() {
                this.$store.dispatch('cancelEditRole');
            },
        }
    }
</script>

<style scoped>
    .roles-header {
        font-size: 24px;
        padding-left: 11px;
    }

    .roles-card.card .card__title {
        padding-top: 13px;
        padding-bottom: 10px;
    }

    .button-add {
        margin-left: 0;
        padding-top: 4px;
    }

    .app-table {
        margin: 0 13px;
    }

    .roles-card.card .card__text {
        padding-top: 0;
    }

    .roles-add {
        margin-right: 15px;
    }
    .progress-loading {
        justify-content: center;
        align-items: center;
        display: flex;
        min-height: 100%;
    }

</style>