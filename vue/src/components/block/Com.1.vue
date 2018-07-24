<template>
    <div>
        <transition mode="out-in" enter-active-class="animated fadeInDown">
            <div class="wrapper">
                <!--<keep-alive>
                -->
                <router-view :key='key'></router-view>
                <!--</keep-alive>--></div>
        </transition>
    </div>

</template>

<script>
    export default {
        computed: {
            key() {
                return this.$route + this.$root.date + new Date()
            }
        }
    }

</script>

<style scoped>


</style>
