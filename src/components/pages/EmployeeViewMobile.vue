<template>
    <v-card color="grey lighten-3" class="hidden-sm-and-up">
        <div class="img-wrapper">
            <img :src="srcPhoto">
        </div>
        <v-card-text v-if="!loading">
            <v-layout row wrap>
                <v-flex xs10 class="table-header-name">
                    <p>{{employee.lastname}} {{employee.firstname}}</p>
                    <p class="user-role-mobile">
                        <span v-for="(role, key) in employee.roles" :key="key">{{role.name}}</span>
                    </p>
                </v-flex>
                <v-flex xs2>
                    <v-tooltip bottom>
                        <v-btn flat icon color="grey darken-1" class="md-icon-button mobile-edit" slot="activator" @click="editEmployee">
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                        <span>Edit</span>
                    </v-tooltip>
                </v-flex>

                <v-flex xs2 class="table-item-first">
                    <v-icon>mdi-account-box</v-icon>
                </v-flex>
                <v-flex xs4 class="table-item-first">
                    <span>Position</span>
                </v-flex>
                <v-flex xs6 class="table-item-first mobile-employee-content">
                    <span>{{employee.position}}</span>
                </v-flex>

                <v-flex xs2 class="table-item">
                    <v-icon>mdi-currency-usd</v-icon>
                </v-flex>
                <v-flex xs4 class="table-item">
                    <span>Salary</span>
                </v-flex>
                <v-flex xs6 class="table-item">
                    <span v-if="employee.currentSalary">{{employee.currentSalary.amount}} {{employee.currentSalary.currency.name}}</span>
                </v-flex>

                <v-flex xs2 class="table-item">
                    <v-icon>mdi-calendar-blank</v-icon>
                </v-flex>
                <v-flex xs4 class="table-item">
                    <span>Schedule</span>
                </v-flex>
                <v-flex xs6 class="table-item">
                    <span>{{employee.schedule|| "fixed"}}</span>
                </v-flex>

                <v-flex xs2 class="table-item position-item">
                    <v-icon>mdi-phone</v-icon>
                </v-flex>
                <v-flex xs4 class="table-item position-item">
                    <span>Telephone</span>
                </v-flex>
                <v-flex xs6 class="table-item content-item mobile-employee-content">
                    <span>
                        <a class="link" :href="`tel:${employee.phoneNumber}`">{{employee.phoneNumber}}</a>
                    </span>
                </v-flex>
            </v-layout>

        </v-card-text>
        <v-card-actions v-if="!loading" class="mobile-view-actions">
            <v-layout row wrap align-center justify-space-between class="mobile-actions-wrapper">
                <v-tooltip bottom v-for="(social, key) in socials" :key="key">
                    <v-btn flat icon color="white" class="md-icon-button" slot="activator" v-clipboard:copy="employee[social.propName]">
                        <v-icon>{{social.iconClass}}</v-icon>
                    </v-btn>
                    <span>Copy to clipboard</span>
                </v-tooltip>
            </v-layout>
        </v-card-actions>
        <v-card-text v-if="loading" class="progress-loading">
            <v-progress-circular indeterminate v-bind:size="70" v-bind:width="7" color="indigo"></v-progress-circular>
        </v-card-text>
    </v-card>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex';
    import appConfig from '@apiConfig';

    export default {
        name: 'employee-view-mobile',
        data: function () {
            return {
                socials: [
                    { iconClass: 'mdi-skype', propName: 'skype' },
                    { iconClass: 'mdi-email', propName: 'email' },
                    { iconClass: 'mdi-telegram', propName: 'telegram' }
                ],
                loading: false,
                id: null
            }
        },
        created() {
            this.id = this.$route.params.userId;
            this.loading = true;
            this.$store.dispatch('setGoBack', true);
            this.$store.dispatch('fetchEmployee', this.id)
                .then(() => this.loading = false, err => this.loading = false);
        },
        mounted() {
            window.addEventListener('resize', this.checkWindowWidth);
            this.checkWindowWidth();
        },
        computed: {
            ...mapGetters({
                employee: "getEmployee"
            }),
            srcPhoto() {
                return this.employee.photoUrl ? `${appConfig.api}/img/${this.employee.photoUrl}` : require('@/assets/no-photo.png');
            }
        },
        beforeDestroy() {
            this.$store.dispatch('setGoBack', false);
            window.removeEventListener('resize', this.checkWindowWidth);
        },
        methods: {
            editEmployee() {
                this.$router.push({
                    name: 'EmployeeEdit',
                    params: { userId: this.id }
                });
            },
            checkWindowWidth(event) {
                if (document.documentElement.clientWidth > 580 && this.$route.name == "EmployeeViewMobile") {
                    this.editEmployee();
                }
            }
        }
    }
</script>

<style scoped>
    .img {
        height: 170px;
    }

    .table-item {
        height: 69px;
        padding-top: 22px;
    }

    .table-item:not(.xs2),
    .table-item-first:not(.xs2) {
        border-bottom: 1px solid lightgrey;
    }

    .table-item-first {
        height: 58px;
        padding-top: 17px;
    }

    .card__text {
        padding: 0;
    }

    .mobile-edit {
        margin-top: 14px;
    }

    .table-header-name {
        padding-left: 50px;
        padding-top: 17px;
    }

    .table-header-name p {
        font-size: 16px;
        margin-bottom: -2px;
    }

    .table-header-name p:last-child {
        color: grey;
    }

    .link {
        text-decoration: none;
        font-size: 12px;
    }

    .user-role-mobile {
        color: lightgray;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .user-role-mobile span {
        margin-right: 15px;
    }

    .table-item-first .icon,
    .table-item .icon {
        padding-left: 12px;
    }

    .mobile-view-actions {
        background-color: #3f51b5;
        height: 56px;
        padding-left: 40px;
        padding-right: 40px;
    }

    .img-wrapper {
        width: 100%;
        height: 24.3%;
        display: flex;
        align-items: center;
        overflow: hidden;
    }

    .img-wrapper img {
        width: 100%;
        height: auto;
    }
    .mobile-employee-content {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    @media screen and (max-width: 280px) {
        .mobile-view-actions {
            padding-left: 0;
            padding-right: 0;
        }
        .mobile-actions-wrapper {
            justify-content: space-around;
        }
    }

</style>