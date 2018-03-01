<template>
    <v-card class="ma-2 card-schedule">
        <v-card-title class="card-schedule-title">
            Schedule
        </v-card-title>
        <v-card-text class="schedule-text-card">
            <v-layout row wrap justify-space-between>
                <div class="employee-position-input">
                    <v-text-field v-model="position" label="Position" class="input-card" maxlength="100"></v-text-field>
                </div>

                <div class="schedule-group">
                    <div class="center">Choose schedule of employees:</div>
                    <div class="employee-radiobutton">
                        <v-radio-group row v-model="schedule">
                            <v-radio label="Fixed" value="fixed" color="indigo" class="fixed-radiobutton"></v-radio>
                            <v-radio label="Flexible" value="flexible" color="indigo"></v-radio>
                        </v-radio-group>
                    </div>
                </div>

                <div class="datapicker-wrapper">
                    <div class="datapicker-hiring">
                        <v-menu ref="menuHiring" lazy v-model="picker1" transition="scale-transition" offset-y full-width :nudge-right="40" :close-on-content-click="false"
                            max-width="290px" min-width="290px">
                            <v-text-field slot="activator" label="Hiring date" placeholder="Hiring date" v-model="hiringDate" prepend-icon="event" readonly
                                class="add-employee-date"></v-text-field>
                            <v-date-picker v-model="hiringDate" no-title scrollable actions @change="$refs.menuHiring.save(hiringDate)" class="add-employee-date">
                            </v-date-picker>
                        </v-menu>
                    </div>

                    <div class="datapicker-contract">
                        <v-menu ref="menuContract" lazy v-model="picker2" transition="scale-transition" offset-y full-width :nudge-right="40" :close-on-content-click="false"
                            max-width="290px" min-width="290px">
                            <v-text-field slot="activator" label="Contract lapse" placeholder="Contract lapse" v-model="contractLapse" prepend-icon="event"
                                readonly></v-text-field>
                            <v-date-picker v-model="contractLapse" no-title scrollable actions @change="$refs.menuContract.save(contractLapse)">
                            </v-date-picker>
                        </v-menu>
                    </div>
                </div>

            </v-layout>
        </v-card-text>
    </v-card>
</template>
<script>
    import moment from 'moment';
    import { mapActions } from 'vuex';

    export default {
        name: 'EmployeePosition',
        data: () => ({
            picker1: false,
            picker2: false,
            now: new Date()
        }),
        computed: {
            position: {
                get() {
                    return this.$store.state.employees.employee.position;

                },
                set(value) {
                    this.editEmployeePosition(value);
                }
            },
            schedule: {
                get() {
                    return (this.$store.state.employees.employee.schedule) ? this.$store.state.employees.employee.schedule : "fixed";
                },
                set(value) {
                    value = value ? value : 'Fixed';
                    this.editEmployeeSchedule(value);

                }
            },
            contractLapse: {
                get() {
                    return (this.$store.state.employees.employee.contractLapse) ? moment(this.$store.state.employees.employee.contractLapse).format('YYYY-MM-DD') : '';
                },
                set(value) {
                    this.editEmployeeContractLapse(value);

                }
            },
            hiringDate: {
                get() {
                    return moment((this.$store.state.employees.employee.hiringDate) ? this.$store.state.employees.employee.hiringDate : this.now).format('YYYY-MM-DD');
                },
                set(value) {
                    this.editEmployeeHiringDate(value);

                }
            },
        },
        methods: {
            ...mapActions(['editEmployeePosition',
                'editEmployeeSchedule',
                'editEmployeeContractLapse',
                'editEmployeeHiringDate'
            ])
        }
    }
</script>

<style scoped>
    .input-group.input-group--selection-controls.switch {
        max-width: fit-content;
        margin-right: 10px;
    }

    .center {
        align-self: center;
        font-size: 12px;
        font-weight: 500;
    }
    .datapicker-hiring,
    .datapicker-contract {
        width: 100%;
    }
    .employee-position-input {
        flex-grow: 1;
        margin-right: 35px;
        min-width: 200px;
    }
    .schedule-group {
        width: 200px;
        margin-top: -5px;
    }
    .datapicker-wrapper .input-group {
        width: 140px;
    }
    .datapicker-lapse {
        margin-right: -2px;
    }
    @media screen  and (max-width: 960px){
        .datapicker-wrapper .input-group--text-field {
            width: 100%;
        }
        .datapicker-wrapper {
            width: 100%;
            flex-direction: column;
        }

        .employee-position-input {
            margin-right: 0px;
            width: 100%;
        }

        .datapicker-hiring {
            margin-right: 15px !important;
        }
    }

    @media screen and (min-width: 600px) {
        .datapicker-wrapper {
            flex-direction: row;
        }
    }

    .schedule-group .input-group.radio-group {
        padding-top: 4px;
    }

    .datapicker-wrapper {
        display: flex;
        justify-content: flex-start;
    }

    .datapicker-hiring {
        margin-right: 15px;
    }
    .fixed-radiobutton {
        margin-right: -30px;
    }
</style>