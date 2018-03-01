<template>
    <div>
        <v-navigation-drawer fixed app clipped-left v-model="drawer" :width="$vuetify.breakpoint.smAndDown ? 226 : 256" mobile-break-point="700" floating class="nav-drawer">
            <v-card color="indigo" tile flat class="white--text hidden-sm-and-up">
                <v-container fluid grid-list-lg>
                    <v-layout row>
                        <v-flex xs7>
                            <v-avatar class="user-avatar-drawer" size="60px">
                                <img class="navbar-image" :src="srcPhoto" alt="avatar">
                            </v-avatar>
                        </v-flex>
                    </v-layout>
                    <v-flex xs6>
                        <v-card-text class="px-0 user-mail-menu">{{user.Email}}</v-card-text>
                    </v-flex>
                </v-container>
            </v-card>
            <v-list class="routes-list" dense>
                <v-list-tile v-for="route in linksNames" :key="route.Name" @click="goToLink(route)" v-bind:class="{ 'active-route': route.name == routeNow }">
                    <v-list-tile-action>
                        <v-icon class="navbar-icons">{{ route.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title class="menu-title">
                            {{ route.title }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
            <v-footer absolute>version {{version}}</v-footer>
        </v-navigation-drawer>
        <v-toolbar class="top-navbar" color="indigo" clipped-left dark fixed app :height="$vuetify.breakpoint.xsOnly ? 56 : 70">
            <v-toolbar-side-icon v-if="!backArrow && !drawer" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
            <div v-if="backArrow">
                <v-btn icon slot="activator" dark @click="goBack" class="back-button">
                    <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
            </div>
            <v-toolbar-title class="title-navbar">
                <span class="title-users">QUsers</span>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-flex sm3 md2 lg2 xs4> 
            <v-text-field v-if="isSearch && isShowSearch()" v-model="searchText" single-line hide-details @keyup.esc="searchText=''; isSearch=false;"
                @blur="searchText ? isSearch=true : isSearch=false" class="search-field" autofocus>
            </v-text-field>
            </v-flex>
            <v-btn v-show="!isSearch && isShowSearch()" icon @click="isSearch=!isSearch" class="icon-search">
                <v-icon>search</v-icon>
            </v-btn>
            <v-avatar size="32px" class="hidden-xs-only avatar-image">
                <img :src="srcPhoto" alt="avatar">
            </v-avatar>
            <div class="user-email hidden-xs-only">{{ user.Email }}</div>
            <v-menu bottom left offset-y>
                <v-btn icon slot="activator" dark class="more-btn">
                    <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list class="menu-list">
                    <v-list-tile class="tile-item" v-for="item in items" :key="item.title" @click="logout">
                        <v-list-tile-title class="menu-list">
                            <v-icon class="menu-icon">{{item.icon}}</v-icon>{{ item.title }}
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import appConfig from '@apiConfig';
    export default {
        name: 'nav-bar',
        created() {
            this.$store.dispatch('changeSearchText', '');
        },
        computed: {
            ...mapGetters({
                version: 'getVersion',
                user: 'getUser',
                searchEmployees: 'getSearchEmployees',
                backArrow: 'getBackArrow'
            }),
            linksNames() {
                return this.$router.options.routes.filter(item => item.meta && item.meta.showInMenu);
            },
            searchText: {
                get() {
                    return this.searchEmployees;
                },
                set(val) {
                    this.$store.dispatch('changeSearchText', val);
                }
            },
            routeNow() {
                return this.$route.name;
            },
            srcPhoto() {
                return this.user.PhotoUrl ? `${appConfig.api}/img/${this.user.PhotoUrl}` : require('@/assets/no-photo.png');
            },
        },
        data() {
            return {
                drawer: null,
                items: [{ title: 'Log out', icon: 'mdi-login-variant' }],
                isSearch: false
            }
        },
        methods: {
            ...mapActions([
                'logOut'
            ]),
            isShowSearch() {
                let rez = this.$route.name === 'Employees';
                if (!rez) {
                    this.isSearch = false;
                    if (this.searchText)
                        this.$store.dispatch('changeSearchText', '');
                }
                return rez;
            },
            logout() {
                this.logOut();
                this.$router.push('/login');
            },
            goToLink(route) {
                this.$router.push(route.path);
            },
            goBack() {
                this.$store.dispatch('setGoBack', false);
                this.$router.push('/employees');
            }
        }
    };
</script>

<style scoped>
    .footer.footer--absolute {
        padding: 0 16px !important;
    }

    .title-users {
        font-size: 30px;
        margin-left: 15px;
        margin-bottom: 4px;
    }

    button.menu-down.btn.btn--icon {
        margin-right: 16px;
    }

    .user-email {
        margin-bottom: 2px;
        margin-right: -6px;
        font-size: 13px;
        font-weight: 500;
    }

    .list-tile {
        padding-left: 8px;
        padding-top: 10px;
    }

    .menu-icons {
        min-width: 45px;
    }

    .menu-items {
        font-size: 1.15em;
    }

    .nav-button {
        margin-right: 60px;
    }

    .menu-icon {
        margin-right: 10px;
        font-size: 13px;
    }

    .menu-list {
        padding: 0;
        font-size: 13px;
        height: 35px;
        overflow: hidden;
    }

    .tile-item a {
        padding-left: 10px;
        height: 40px;
    }

    .back-button {
        margin-left: -18px;
    }

    .search-field {
        padding-right: 10px !important;
    }

    .navbar-icons {
        font-size: 25px !important;
        padding-left: 19px;
    }

    .menu-title {
        padding-left: 13px;
    }

    .active-route .mdi.icon.navbar-icons,
    .active-route .list__tile__title {
        color: #2f80ed;
    }

    .avatar-image {
        margin-right: 20px;
    }
    aside {
        -webkit-box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
    }
    @media screen and (max-width: 600px) {
        .title-users {
            overflow: unset;
            margin-left: 2px;
            font-size: 19px;
            min-width: 100px;
        }
        .toolbar__content > .toolbar__side-icon {
            margin-left: 7px !important;
        }
        .menu__activator > .more-btn {
            margin-right: 3px;
        }
        aside {
            margin-top: 0px !important;
            max-height: calc(100%-56px) !important;
        }
        .user-avatar-drawer {
            margin-left: 2px;
            margin-top: -5px;
        }
        .user-mail-menu {
            font-size: 13px;
            margin-top: 7px;
            padding-bottom: 3px;
        }
    }

    @media screen and (min-width: 600px) {
        aside {
            margin-top: 70px !important;
            max-height: calc(100%-30px) !important;
        }
        .footer.footer--absolute {
            margin: 70px 0 !important;
        }
    }
    .toolbar__side-icon, .icon-search {
        min-width: 36px;
    }
</style>