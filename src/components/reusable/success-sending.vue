<template> 
    <v-dialog v-model="dialog" max-width="300px" v-on-clickaway="ok"> 
        <v-card> 
            <v-card-title>
                <p class="text-xs-center full-width">{{content.title}}</p>
            </v-card-title> 
            <v-card-text>
                <p class="text-xs-center full-width">{{content.text}}</p>
            </v-card-text> 
            <v-card-actions class="button-center"> 
                <v-btn class="confirm" @click.stop="ok">Ok</v-btn> 
            </v-card-actions> 
        </v-card> 
    </v-dialog> 
</template> 
 
<script> 
    import { directive as onClickaway } from 'vue-clickaway';

    export default { 
        name: 'success-sending', 
        directives: {
            onClickaway
        },
        data: function () { 
            return { 
                dialog: true, 
            } 
        }, 
        props: ['content'], 
        methods: { 
            ok() { 
                this.$emit("ok"); 
            } 
        } 
    } 
</script>

<style scoped>
    .confirm {
        margin: 0 auto;
    }
    .full-width {
        width: 100%;
    }
</style>