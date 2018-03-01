<template>
    <div>
        <div class="ma-3 salary-header">
            <span class="salary-title">Salary History</span>
            <v-tooltip bottom class="salary-add-button">
                <v-btn flat color="black" slot="activator" @click="addSalary" class="salary-btn qusers-add-button-icon">
                    <v-icon class="employees-add-icon" large color="indigo">mdi-plus</v-icon>
                </v-btn>
                <span>Add new salary</span>
            </v-tooltip>
        </div>
        <v-card class="ma-2 salary-table-card">
            <v-data-table hide-actions :headers="headers" :items="salaryHistory" :pagination.sync="pagination" :customSort="customSort" item-key="name" class="elevation-1 employee-salary-table">
                <template slot="headers" slot-scope="props">
                    <tr>
                        <th v-for="header in props.headers" v-if="header.text" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                            @click="changeSort(header.value)">
                            <v-icon>arrow_upward</v-icon>
                            {{ header.text }}
                        </th>
                    </tr>
                </template>
                <template slot="items" slot-scope="props">
                    <tr @click="editSalary(props.item)">
                        <td class="text-xs-center">{{ props.item.updatedDate | dateFilter}}</td>
                        <td class="text-xs-center">{{ props.item.amount }} {{ props.item.currency.name }}</td>
                        <td class="text-xs-right">
                            <v-tooltip bottom>
                                <v-btn icon slot="activator" @click.stop="confirmDelete(props.item)" class="delete-icon">
                                    <v-icon color="grey">mdi-delete</v-icon>
                                </v-btn>
                                <span>Delete</span>
                            </v-tooltip>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
        <add-salary v-if="confirmSalary" @cancel='cancel' @save='saveSalary' @create='createSalary' v-bind:editIndex="editIndex"
            v-bind:actionType="actionType"></add-salary>
        <modal v-if='confirmModal' @confirm='deleteSalaryConfirm' @cancel='cancel'></modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapGetters, mapActions } from 'vuex';

    import AddSalary from './add-salary';
    import ModalComponent from '@/components/common/modal.component';
    export default {
        name: 'EmployeeSalaryHistory',
        components: {
            'add-salary': AddSalary,
            'modal': ModalComponent
        },
        data: () => ({
            headers: [
                { text: 'Updated date', value: 'updatedDate', align: 'left', class: 'salary-table_updated-date' },
                { text: 'Amount', value: 'amount', align: 'left', class: 'salary-table_amount' },
                { text: ''}
            ],
            confirmSalary: false,
            confirmModal: false,
            editIndex: '',
            pagination: {
                sortBy: 'amount',
                rowsPerPage: 1000
            },
        }),
        created() {
            this.userId = this.$route.params.userId;
        },
        computed: {
            ...mapGetters({ salaryHistory: 'getSalaryHistory' })
        },
        methods: {
            confirmDelete(item) {
                this.deleteIndex = this.salaryHistory.indexOf(item);
                this.confirmModal = true;
            },
            editSalary(item) {
                this.editIndex = this.salaryHistory.indexOf(item);
                this.confirmSalary = true;
                this.actionType = 'edit';
                this.$store.dispatch('updateSalary', item);
            },
            addSalary() {
                this.confirmSalary = true;
                this.actionType = 'add';
                const now = new Date();
                const payload = {
                    amount: 0,
                    currency: {
                        id: 1,
                        name: "USD"
                    },
                    currencyId: 1,
                    updatedDate: now.toISOString(),
                    userId: this.userId
                }
                this.$store.dispatch('updateSalary', payload);
            },
            cancel() {
                this.confirmSalary = false;
                this.confirmModal = false;
            },
            saveSalary(payload) {
                this.$store.dispatch('editSalary', payload);
                this.confirmSalary = false;
            },
            createSalary(payload) {
                this.$store.dispatch('addSalary', payload);
                this.confirmSalary = false;
            },
            deleteSalaryConfirm() {
                this.confirmModal = false;
                this.$store.dispatch('deleteSalary', this.deleteIndex);
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            customSort(items, index, desc) {
                if (index) {
                    const sortedItems = items.sort((item1, item2) => {
                        let val1 = item1[index],
                            val2 = item2[index];
                        if (index == 'updatedDate') {
                            val1 = new Date(val1);
                            val2 = new Date(val2);
                        }
                        return val1 > val2 ? 1 : val2 > val1 ? -1 : 0;
                    })
                    return desc ? sortedItems.reverse() : sortedItems;
                }
                return items;
            },
        },
        filters: {
            dateFilter: function (date) {
                return (date) ? moment(date).format('YYYY-MM-DD') : ''
            }
        },
    }
</script>

<style scoped>
    tr {
        cursor: pointer;
    }
    @media screen and (max-width: 600px) {
        table.table tbody td,
        table.table thead th:first-child, 
        table.table thead th:not(:first-child) {
            padding: 0;
        }
        .salary-add-button {
            position: absolute;
            right: 0;
            top: 0;
        }
        .salary-btn {
            margin: 0;
        }
    }

    .salary-title {
        font-size: 24px;
        margin-right: 0px;
    }

    .delete-icon.btn.btn--icon .mdi.icon.grey--text.mdi-delete {
        font-size: 20px;
    }
</style>