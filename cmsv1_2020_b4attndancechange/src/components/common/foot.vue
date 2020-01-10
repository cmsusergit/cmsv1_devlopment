<template>
    <div class="tile level">

        <span class="level-item">
            &copy; {{ mesg }}
        </span>
    </div>
</template>

<script>
    export default {
        name: 'Footr',

        data() {
            return {
                mesg: 'Sardar Vallabhbhai Patel Institute of Technology,Vasad'
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    /* .footrbox{
        background-color: floralwhite;
        padding:.4em;
        color:#224444;
        border-top:1px solid #224444;
    } */
</style>
