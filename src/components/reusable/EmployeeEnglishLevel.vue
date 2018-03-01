<template>
    <v-card class="ma-2 english-level-card">
        <v-card-title class="card-employee-title english-card-title">
            English level
        </v-card-title>
        <v-card-text class="english-text-card">
            <v-flex class="english-level-card">
                <v-select content-class="english-level" v-bind:items="englishLevelList" class="select-card english-level-select" v-model="englishLevel" label="English level" single-line bottom></v-select>
            </v-flex>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: 'EmployeeEnglishLevel',
        data() {
            return {
                englishLevelList: [
                    { text: "Beginner", value: 1 },
                    { text: "Elementary", value: 2 },
                    { text: "PreIntermediate", value: 3 },
                    { text: "Intermediate", value: 4 },
                    { text: "Upper Intermediate", value: 5 },
                    { text: "Advanced", value: 6 }

                ]
            }
        },
        computed: {
            englishLevel: {
                get() {
                    return this.$store.state.employees.employee.englishLevel;
                },
                set(value) {
                    this.$store.dispatch('editEmployeeEnglish', value);
                }
            }
        }
    }
</script>

<style scoped>
    .menu__content.menu__content--select.menuable__content__active {
        max-height: 304px !important;
    }
    .english-level-select >>> .input-group__selections__comma {
        margin-top: 6px;
    }
</style>
