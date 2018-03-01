<template>
    <v-card class="ma-2 card-checkbox role">
        <v-card-title class="card-employee-title" :class="rolesRequired ? '' : 'required-style'">
            Roles*
        </v-card-title>
        <v-card-text class="card-checkbox">
            <v-list>
                <v-checkbox v-for="(item, key) in rolesList" :key="key" color="indigo" :label="item.name" v-model="item.checked" @change="toggle(item)">
                </v-checkbox>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'EmployeeRole',
        props: ['tryValidate'],
        computed: {
            rolesList() {
                let roles = this.$store.state.employees.roles;
                let adminChecked = roles.some(x => x.name.toLowerCase() === 'administrator' && x.checked);
                if (adminChecked && this.$route.params.userId === this.$store.state.user.user.UserId)
                    roles = roles.filter(x => x.name.toLowerCase() !== 'administrator');
                return roles;
            },
            rolesRequired() {
                return this.$store.state.employees.roles.some(x => x.checked) ||
                    !this.tryValidate;
            }
        },
        methods: {
            toggle(item) {
                this.$store.dispatch('toggleRole', item);
            }
        }
    }
</script>
<style scoped>
    .required-style {
        color: red !important;
    }
</style>