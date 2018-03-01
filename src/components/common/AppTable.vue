<template>
    <div>
        <v-data-table :items="data.items" class="elevation-2 app-table" hide-actions hide-headers>
            <template slot="items" slot-scope="props">
                <td v-if="!props.item.editting" class="app-table-item-name">
                    <p class="table-role">
                        <span class="table-word-nowrap">{{ props.item.name }}</span>
                    </p>
                </td>
                <td v-else colspan="2">
                    <v-text-field v-if="!saving" class="role-name" :value="props.item.name" v-model="newName"
                        v-on:keyup.enter="saveItem(props.item)" v-on:keyup.esc="cancelEdit()" 
                        v-validate="'ruleRoleExist'" :error-messages="errors.collect('newName')" 
                        data-vv-name="newName" required autofocus>
                    </v-text-field>
                </td>
                <td v-if="!props.item.editting" class="col-delete pl-0" align="right">
                        <v-flex>
                            <span class="edit-nowrap">
                        <v-tooltip v-if="props.item.editable" class="edit-tooltip" bottom>
                            <v-btn icon slot="activator" @click="editItem(props.item)" class="edit-icon">
                                <v-icon color="grey">mdi-pencil</v-icon>
                            </v-btn>
                            <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip v-if="props.item.editable" class="delete-tooltip" bottom>
                            <v-btn icon slot="activator" @click="confirmDelete(props.item)" class="delete-icon">
                                <v-icon color="grey">mdi-delete</v-icon>
                            </v-btn>
                            <span>Delete</span>
                        </v-tooltip>
                        </span>
                    </v-flex>
                </td>
            </template>
        </v-data-table>
        <div v-if="isEditing" class="buttons-confirm"> 
            <v-btn @click="saveEvent" color="primary" class="add-confirm-button mt-2" :loading="saving" :disabled="saving">Save</v-btn> 
            <v-btn @click="cancelEdit" color="primary" class="delete-role mr-0 mt-2" :disabled="saving">Cancel</v-btn> 
        </div> 
        <modal v-if='confirmModal' @confirm='deleteItemConfirm' @cancel='cancelDelete' :text="owner" :item="itemName"></modal>
    </div>
</template>
<script>
    import ModalComponent from '@/components/common/modal.component';

    export default {
        name: 'app-table',
        components: {
            'modal': ModalComponent
        },
        data: function () {
            return {
                confirmModal: false,
                editingId: -1,
                newName: '',
                itemName: '',
            }
        },
        props: ['data', 'owner', 'saving'],
        created() {
            this.$validator.extend('ruleRoleExist', {
                getMessage: field => 'Already exist!',
                validate: value => {
                    var count = this.data.items.filter(item => item.name.trim().toLowerCase() == value.trim().toLowerCase() && 
                        item.id !== this.editingId && value);
                    return (!count.length);
                }
            });
        },
        computed: {
            isEditing() {
                const ret = this.data.items.find(x => x.editting);
                if (ret) {
                    if (ret.id === -1) {
                        this.newName = '';
                        this.editingId = -1;
                    }
                    return true;
                }
                return false;
            },
        },
        methods: {
            confirmDelete(item) {
                this.index = item.id;
                this.itemName = item.name;
                this.confirmModal = true;
            },
            cancelDelete() {
                this.confirmModal = false;
            },
            deleteItemConfirm() {
                this.confirmModal = false;
                this.$emit('deleteItem', this.index);
                this.modalTitle = '';
            },
            editItem(item) {
                this.editingId = item.id;
                this.newName = item.name;
                this.$emit('editItem', item.id);
            },
            cancelEdit() {
                this.editingId = -1;
                this.newName = '';
                this.$emit('cancelEdit');
            },
            saveItem(val) {
                if (this.newName &&
                    !this.$validator.errors.has('newName')) {
                        val.name = this.newName.trim();
                        this.newName = '';
                        this.$emit('saveItem', val);
                } else if (!this.newName) {
                    this.cancelEdit();
                }
            },
            saveEvent() {
                const item = this.data.items.find(x => x.editting);
                if (item) {
                    if (this.newName &&
                      !this.$validator.errors.has('newName')) {
                        item.name = this.newName;
                        this.$emit('saveItem', item);
                        this.newName = '';
                    } else if (!this.newName) {
                        this.cancelEdit();
                    }
                }
            },
        }
    }
</script>

<style scoped>
.add-confirm-button {
    margin-right: 0px;
}
.edit-icon.btn.btn--icon .mdi.icon.grey--text.mdi-pencil,
.delete-icon.btn.btn--icon .mdi.icon.grey--text.mdi-delete {
    font-size: 20px;
} 
.edit-icon.btn {
    margin-right: 18px !important;
}
.role-name >>> .input-group__details {
    min-height: 16px;
}
.role-name >>> input {
    font-size: 13px;
}
.input-group {
    padding: 3px 0 0;
}
@media screen and (min-width: 601px) and (max-width: 960px) {
    .delete-role.mr-0 {
        margin-left: 5px;
    }
    .add-confirm-button {
        margin-right: 5px;
    }
}
.table-word-nowrap {
    white-space: nowrap;
}
.table-role {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100vw - 150px);
    margin-bottom: 0;
}
.col-delete {
    width: 120px;
}
.app-table-item-name {
    width: auto;
}
@media screen and (max-width: 750px) {
    .delete-icon {
        margin-right: 0;
        margin-left: 0;
    }
    .edit-icon {
        margin-left: 0;
    }
    .col-delete {
        width: 100px;
    }
}
@media screen and (min-width: 600px) {
    .table-role {
        max-width: calc(100vw - 190px);
    }
}
@media screen and (min-width: 700px) {
    .table-role {
        max-width: calc(100vw - 470px);
    }
}
@media screen and (min-width: 960px) {
    .table-role {
        max-width: calc(100vw - 480px);
    }
}
.edit-nowrap {
    white-space: nowrap;
}
</style>