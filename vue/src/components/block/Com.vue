<template>
    <div :class="{'aside-folded':asideFolded}">
        <v-header></v-header>
        <v-menu></v-menu>
        <div class="content">
            <div class="wrapper">
                <div v-if='!rule'>
                    <!-- <transition mode="out-in" name='fadeDown' v-show="set"> -->
                        <router-view :key='key' v-show='set'></router-view>
                    <!-- </transition> -->
                </div>
                <div v-if="rule" class="text-center" style="padding:30px 0;color:#999">
                    <div style="margin-bottom: 8px;">
                        <i class="el-icon-warning f30"></i>
                    </div>
                    暂无权限
                </div>
            </div>
        </div>
        <v-edit></v-edit>
    </div>
</template>
<script>
    import header from '@/components/block/Header'
    import menu from '@/components/block/Menu'
    import edit from '@/components/block/EditPassword'
    import bus from '../../state'
    export default {
        data() {
            return {
                asideFolded: true,
                rule: false,
                set: false,
                d: new Date()
            }
        },
        computed: {
            key() {
                return this.$route + new Date() + this.d
            }
        },
        created() {
            var _self = this;
            _self.$.reload = () => {
                _self.d = new Date();
            }
            bus.$on('asideToggle', function (asideFolded) {
                _self.asideFolded = asideFolded;
            })
            //权限控制
            bus.$on('rule', function (flag) {
                _self.rule = flag;
            });
            _self.$router.beforeEach((to, from, next) => {
                _self.set = false;
                _self.rule = false;
                next();
            })
            _self.$router.afterEach((to, from) => {
                setTimeout(() => {
                    _self.set = true;
                }, 500)
            });
            setTimeout(() => {
                _self.set = true;
            }, 500)
        },
        components: {
            'v-header': header,
            'v-menu': menu,
            'v-edit': edit
        }
    }

</script>
