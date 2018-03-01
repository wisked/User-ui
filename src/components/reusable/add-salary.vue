<template>
    <v-dialog v-model="dialog" max-width="300px" v-on-clickaway="onCancel">
        <v-card>
            <v-card-title>
                {{salaryTitle}}
            </v-card-title>
            <v-card-text>
                <v-text-field label="Amount" 
                    v-model="amount" mask="#######" required 
                    :rules="[(val) => !!val && val > 0 ? ( val >= 0 || 'Amount must be positive number') : 'Required field']" ></v-text-field>
                <v-select content-class="select-salary-currency" v-model="currency" v-bind:items="currencies" item-text="name" item-value="id" return-object></v-select>
                <v-menu lazy
                        ref="menu"
                        :close-on-content-click="false"
                        v-model="picker"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        width="290px">
                    <v-text-field slot="activator"
                                  label="Update date"
                                  v-model="updatedDate"
                                  prepend-icon="event"
                                  readonly
                                  ></v-text-field>
                    <v-date-picker v-model="updatedDate"
                                   ref="picker"
                                   @change="saveDate"
                                   no-title
                                   >
                    </v-date-picker>
                </v-menu>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" flat @click="onComplete">Complete</v-btn>
                <v-btn color="primary" flat @click="onCancel">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';
import { directive as onClickaway } from 'vue-clickaway';

export default {
    name: 'add-salary',
    directives: {
        onClickaway
    },
    data: function() {
        return {
            dialog: true,
            date: null,
            picker: false,
            salaryTitle:
                this.actionType == 'add' ? 'Add salary' : 'Edit salary',
            currencies: [
                {
                    name: 'USD',
                    id: 1
                },
                {
                    name: 'BYN',
                    id: 2
                }
            ]
        };
    },
    created() {
        this.userId = this.$route.params.userId;
    },
    computed: {
        newSalary() {
            return this.$store.state.employees.newSalary;
        },
        amount: {
            get() {
                return this.$store.state.employees.newSalary
                    ? this.$store.state.employees.newSalary.amount
                    : '';
            },
            set(value) {
                value = parseFloat(value) || 0;
                this.updateSalaryAmount(value);
            }
        },
        currency: {
            get() {
                return this.$store.state.employees.newSalary.currency;
            },
            set(value) {
                this.updateSalaryCurrency(value);
            }
        },
        updatedDate: {
            get() {
                return this.$store.state.employees.newSalary.updatedDate
                    ? moment(
                          this.$store.state.employees.newSalary.updatedDate
                      ).format('YYYY-MM-DD')
                    : '';
            },
            set(value) {
                this.updateSalaryDate(value);
            }
        }
    },
    props: ['actionType', 'editIndex'],
    methods: {
        ...mapActions([
            'updateSalaryAmount',
            'updateSalaryCurrency',
            'updateSalaryDate'
        ]),
        saveDate(date) {
            this.$refs.menu.save(date)
        },
        onComplete() {
            if (this.newSalary.amount > 0) {
                if (this.actionType == 'add') {
                    this.$emit('create', this.newSalary);
                } else {
                    this.$emit('save', { newSalary: this.newSalary, editIndex: this.editIndex });
                }
            }
        },
        onCancel() {
            this.$emit('cancel');
        }
    }
};
</script>
