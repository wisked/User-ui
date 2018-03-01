<template>
    <v-dialog v-model="dialog" max-width="250px" v-on-clickaway="onCancel">
        <v-card>
            <v-card-title>
                    <p class="modal-header">Are you sure you want to Delete <span v-if="text">the</span> <span class="text-bold">{{ item }}</span> {{text}}?</p>
            </v-card-title>
            <v-card-actions>
                <div class="modal-confirm">
                    <v-btn class="cancel" @click.stop="onCancel">Cancel</v-btn>
                    <v-btn class="confirm error" @click.stop="onConfirm">Delete</v-btn>
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { directive as onClickaway } from 'vue-clickaway';

    export default {
        name: 'modal',
        directives: {
            onClickaway
        },
        data: function () {
            return {
                dialog: true,
            }
        },
        props: ['text', 'item'],
        methods: {
            onConfirm() {
                this.$emit("confirm");
            },
            onCancel() {
                this.$emit("cancel");
            }
        }
    }
</script>

<style scoped>
    .modal-confirm {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }

    .modal-header {
        font-size: 18px;
    }
    .text-bold {
        font-weight: bold;
    }
</style>