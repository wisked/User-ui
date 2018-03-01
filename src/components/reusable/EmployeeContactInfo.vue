<template>
    <v-card class="ma-2 contact-info-card">
        <v-card-text class="card-text-contacts">
            <div class="contact-info-title">Contact info</div>
            <div class="phones-group" v-for="(phone, index) in phoneNumbers" :key="index">
                <v-text-field :value="getPhone(phone.number)" mask="(##) ###-##-##" :prefix="getPhone(phone.number) ? '+375': ''"
                    @input="onChangePhone($event, index)" label="Phone Number" class="contact-phone-skype input-card"></v-text-field>
                <v-tooltip v-if="index === phoneNumbers.length - 1 && phoneNumbers.length <= 7" bottom>
                    <v-btn flat color="black" @click="addPhone()" slot="activator" class="add-phone-btn">
                        <v-icon small color="indigo">mdi-plus</v-icon>
                    </v-btn>
                    <div>Add new phone</div>
                </v-tooltip>
                <v-tooltip v-else bottom>
                    <v-btn flat color="black" @click="removePhone(index)" slot="activator" class="add-phone-btn">
                        <v-icon small color="indigo">mdi-minus</v-icon>
                    </v-btn>
                    <div>Remove phone</div>
                </v-tooltip>
            </div>
            <v-text-field v-model="skype" label="Skype" mask="nnnnnnnnnnnnnnnnnnnnnnn" class="contact-phone-skype input-card"></v-text-field>
            <v-text-field v-model="telegram" label="Telegram" :prefix="telegram ? '@': ''" mask="nnnnnnnnnnnnnnnnnnnnnnn" class="contact-telegram input-card"></v-text-field>
        </v-card-text>
    </v-card>
</template>

<script>
    import { mapActions } from 'vuex';

    export default {
        name: 'EmployeeContactInfo',
        computed: {
            phoneNumbers: {
                get() {
                    return this.$store.state.employees.employee.phoneNumbers;
                },
            },
            skype: {
                get() {
                    return this.$store.state.employees.employee.skype;
                },
                set(value) {
                    this.editEmployeeSkype(value)
                }
            },
            telegram: {
                get() {
                    return this.$store.state.employees.employee.telegram ? 
                        this.$store.state.employees.employee.telegram.replace('@', '') : '';
                },
                set(value) {
                    this.editEmployeeTelegram('@' + value)
                }
            }
        },
        methods: {
            ...mapActions([
                'editEmployeePhoneNumber',
                'addEmployeePhoneNumber',
                'removeEmployeePhoneNumber',
                'editEmployeeSkype',
                'editEmployeeTelegram'
            ]),
            getPhone(number) {
                return number ? number.replace('+375', ''): '';
            },
            onChangePhone(val, index) {
                this.phoneNumbers[index]['number'] = val ? '+375' + val : '';
                this.editEmployeePhoneNumber(this.phoneNumbers);
            },
            addPhone() {
                this.addEmployeePhoneNumber();
            },
            removePhone(index) {
                this.removeEmployeePhoneNumber(index);
            }
        }
    }
</script>

<style scoped>

    .input-card >>> .input-group--text-field__prefix {
        font-size: 13px;
        margin-top: 7px;
    }
    .input-card >>> input {
        position: relative;
    }
    .contact-info-title {
        font-size: 20px;
        padding-top: 5px;
        padding-bottom: -14px;
    }
    .phones-group {
        display: flex;
        flex-direction: row;
        align-items: flex-end
    }
    .add-phone-btn {
        min-width: 24px;
        width: 24px;
        min-height: 24px;
        height: 24px;
        margin: 6px 0px 3px 6px;
        background-color: #CED2E6 !important;
    }
</style>