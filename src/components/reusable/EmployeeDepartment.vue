<template>
    <v-card class="ma-2 card-checkbox">
        <v-card-title class="card-employee-title" :class="departmentsRequired ? '' : 'required-style'">
            Departments*
        </v-card-title>
        <v-card-text class="card-checkbox">
            <v-list>
                <v-checkbox v-for="(item, key) in departmentsList" :key="key" color="indigo" :label="item.name" v-model="item.checked" @change="toggle(item)">
                </v-checkbox>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'EmployeeDepartment',
        props: ['tryValidate'],
        computed: {
            departmentsList() {
                return this.$store.state.employees.departments;
            },
            departmentsRequired() {
                return this.departmentsList.some(x => x.checked) ||
                    !this.tryValidate;
            }
        },
        methods: {
            toggle(item) {
                this.$store.dispatch('toggleDepartment', item);
            }
        }
    }
</script>
<style scoped>
    .required-style {
        color: red !important;
    }
</style>