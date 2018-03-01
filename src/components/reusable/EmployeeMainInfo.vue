<template>
    <v-card class="ma-2 main-info">
        <v-card-text class="main-info-text">
            <input type="file" @change="onChangePhoto" ref="file" style="display:none" accept=".png, .jpg, .jpeg"/>
            <v-layout @click="dialogEditPhoto=true" class="avatar-layout">
                <v-avatar size="40px">
                    <img :src="srcPhoto" alt="avatar">
                </v-avatar>
                <v-flex class="title-photo">
                        <p>{{ `${firstName} ${lastName}` }}</p>
                        <p style="color: #3c4cae">{{ titlePhoto }}</p>
                </v-flex>
            </v-layout>
            <div class="main-info-name">
                <v-text-field v-model="email" label="Email " :rules="emailRules" class="mr-2 p-2 input-email input-card" required></v-text-field>
                <v-text-field v-if="newEmployee" v-model="password" type="password" label="Password" class="input-card" :rules="nameRules" required></v-text-field>
                <v-text-field v-else v-model="password" type="password" label="Password" class="input-card"></v-text-field>
            </div>
            <div class="main-info-name main-info-firstname">
                <v-text-field v-model="firstName" label="First name " :rules="nameRules" class="mr-2 input-firstname input-card" required></v-text-field>
                <v-text-field v-model="lastName" label="Last name " :rules="nameRules" class="input-card" required></v-text-field>
            </div>
            <v-flex class="main-info-coordinator">
                <v-select content-class="users-coordinator" label="Coordinator" class="select-card coordinator-select" v-bind:items="coordinatorsList.filter(isNotSelfUser)" 
                    v-model="coordinator" bottom :required="coordinatorRequired"
                    :rules="coordinatorRequired ? [v => (v !== '' && !!v) || 'Choose coordinator' ] : []"></v-select>
            </v-flex>
        </v-card-text>
        <add-photo v-if='dialogEditPhoto' @addPhoto="choosePhoto" @delete="deletePhoto" @cancel="dialogEditPhoto=false" v-bind:title="titlePhoto"></add-photo>
    </v-card>
</template>
<script>
    import { mapActions } from 'vuex';
    import appConfig from '@apiConfig';
    import AddPhoto from '@/components/reusable/add-photo';

    export default {
        name: 'employee-main-info',
        components: {
            'add-photo': AddPhoto,
        },
        data() {
            return {
                nameRules: [
                    (v) => !!v || ''
                ],
                emailRules: [
                    (v) => !!v || '',
                    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*$/.test(v) || 'Invalid email'
                ],
                uploadingPhoto: null,
                dialogEditPhoto: false,
                contentDlg: {}
            }
        },
        props: ['newEmployee', 'coordinatorRequired'],
        computed: {
            coordinatorsList() {
                return this.$store.state.employees.coordinators.map(item => {
                    return {
                        text: item ? `${item.firstname} ${item.lastname}` : '[Empty]',
                        value: (item) ? item.userId : ''
                    }
                });
            },
            email: {
                get() {
                    return this.$store.state.employees.employee.email;
                },
                set(value) {
                    this.editEmployeeEmail(value)
                }
            },
            password: {
                get() {
                    return this.$store.state.employees.employee.password;
                },
                set(value) {
                    this.editEmployeePassword(value)
                }
            },
            firstName: {
                get() {
                    return this.$store.state.employees.employee.firstname;
                },
                set(value) {
                    this.editEmployeeFirstname(value)
                }
            },
            lastName: {
                get() {
                    return this.$store.state.employees.employee.lastname;
                },
                set(value) {
                    this.editEmployeeLastname(value)
                }
            },
            coordinator: {
                get() {
                    return (this.$store.state.employees.employee.coordinator) ? this.$store.state.employees.employee.coordinator.userId : '';
                },
                set(value) {
                    this.editEmployeeCoordinator(this.$store.getters.getCoordinatorById(value));
                }
            },
            photoUrl: {
                get() {
                    return this.$store.state.employees.employee.photoUrl;
                },
                set(value) {
                    this.editEmployeePhotoUrl(value);
                }
            },
            srcPhoto() {
                return this.uploadingPhoto ? this.uploadingPhoto : 
                    (this.photoUrl ? `${appConfig.api}/img/${this.photoUrl}` : require('@/assets/no-photo.png'))
            },
            titlePhoto() {
                return this.photoUrl ? 'Edit your profile picture' : 'Add your profile picture';
            }
        },
        methods: {
            ...mapActions(['editEmployeeEmail',
                'editEmployeePassword',
                'editEmployeeFirstname',
                'editEmployeeLastname',
                'editEmployeeCoordinator',
                'editEmployeePhotoUrl',
                'setUploadingPhoto']),
            handleFiles (files) {
                if (!files || !files[0]) {
                    return;
                }
                let reader = new FileReader();
                reader.onload = this.onPhotoLoaded;
                this.setUploadingPhoto(files[0]);
                reader.readAsDataURL(files[0]);
            },
            onPhotoLoaded (e) {
                this.uploadingPhoto = e.target.result;
            },
            onChangePhoto(event) {
                this.handleFiles(event.target.files);
            },
            deletePhoto() {
                this.uploadingPhoto = null;
                this.editEmployeePhotoUrl('');
                this.setUploadingPhoto(null);
                this.dialogEditPhoto = false;
            },
            choosePhoto() {
                this.dialogEditPhoto = false;
                this.$refs.file.click();
            },
            showDialog() {
                this.dialogEditPhoto = true;
            },
            isNotSelfUser(coordinator) {
                return this.$route.params.userId !== coordinator.value;
            }
        }
    }
</script>

<style scoped>
    .card__text.main-info-text {
        padding-top: 21px;
        padding-left: 20px;
        padding-bottom: 18px;
    }
    .main-info-text .input-group__input {
        min-height: 10px;
        height: 10px;
    }
    .main-info-name {
        display: flex;
        flex-direction: row;
        max-height: 53px;
    }
    .main-info-firstname {
        margin-bottom: -5px;
    }
    .flex.main-info-coordinator {
        height: 57px;
    }
    .main-info-coordinator >>> label{
        transform: translateY(-18px) scale(1) !important;
    }
    .coordinator-select >>> .input-group__selections__comma {
        margin-top: 6px;
    }
    @media screen and (max-width: 600px) {
        .main-info-name {
            flex-direction: column;
            max-height: 106px;
        }
    }
    .avatar-layout
    {
        cursor: pointer;
        margin-bottom: 8px;
    }
    .avatar-layout p {
        margin-bottom: 0px;
    }

    .title-photo p {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .title-photo {
        overflow: hidden;
        align-self: center;
        margin-left: 20px;
    }
</style>