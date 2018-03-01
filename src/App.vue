<template>
    <div id="app">
        <v-app>
            <NavBarComponent v-if="$route.name !== 'Authentication'"></NavBarComponent>
            <v-content>
                <v-container fluid fill-height class="pa-0">
                    <v-layout d-flex class="main-layout-full-width">
                        <router-view></router-view>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import NavBarComponent from '@/components/common/nav-bar.component';

    export default {
        name: 'app',
        components: {
            NavBarComponent,
        },
        data(){
            return {
                isHidden: true,
            }
        },
        created() {
            this.$store.dispatch('fetchVersion')
        },
    }
</script>

<style scoped>
    .main-layout-full-width {
        max-width: 100%;
    }
</style>