<template>
    <v-layout justify-center align-baseline>
        <v-card class="login__form mt-4">
            <v-card-title class="px-4">
                <span class="login__title">Log in</span>
            </v-card-title>
            <v-form class="px-4 pb-3" novalidate @submit.stop.prevent="handlelogIn()">
                <v-text-field label="Email" v-model="email" :rules="rules" required>
                </v-text-field>

                <v-text-field label="Password" v-model="password" :rules="rules" required type="password">
                </v-text-field>

                <v-btn flat type="submit" :loading="waitlogin" :disabled="waitlogin" block>Log in</v-btn>
            </v-form>
            <v-card-text>
                <span class="red--text" v-if="failed">The email or password is incorrect. Please try again.</span>
                <span class="red--text" v-if="userAlert">Avaliable only for administrator.</span>
            </v-card-text>
        </v-card>
    </v-layout>
</template>
<script>
    import { mapActions } from 'vuex';
    import appConfig from '@apiConfig';
    import AuthService from '@/services/AuthService';

    export default {
        data() {
            return {
                email: '',
                password: '',
                loginPasswordVisible: false,
                rules: [value => !!value || 'This field is required'],
                failed: false,
                waitlogin: false,
                userAlert: false,
            };
        },
        methods: {
            ...mapActions(['logIn']),
            handlelogIn: function () {
                this.failed = false;
                this.waitlogin = true;
                this.logIn({
                    Email: this.email,
                    Password: this.password
                }).then(res => {
                    this.userAlert = !AuthService.isAdmin();
                    this.waitlogin = false
                }, err => {
                    this.failed = true;
                    this.waitlogin = false;
                    this.userAlert = false;
                });
            }
        }
    };
</script>