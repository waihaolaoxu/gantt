<template>
    <div>
        <div class="loading middle flex-box" style='height:300px;' v-if='loading'>
            <!-- <i class="f30 el-icon-loading" style='color:#666;' :class='{"el-icon-loading":showLoading}'></i> -->
            <i class="f30" style='color:#666;' :class='{"el-icon-loading":showLoading}'></i>

        </div>
        <div class="middle flex-box" style='height:300px;' v-if='empty'>
            <div class="empty-body" style='text-align:center;'>
                <i :class='icons' class="icon"></i>
                <br/>
                <slot>
                    <p>暂无数据</p>
                </slot>
            </div>
        </div>

    </div>

</template>

<script>
    export default {
        props: ['icon', 'loading', 'empty','showLoading'],
        data() {
            return {
                icons: this.icon || 'el-icon-tickets'
            }
        },
        computed: {}
    }

</script>

<style scoped lang='scss'>
    .empty-body {
        i.icon {
            font-size: 30px;
            color: #999;
        }
        p {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    }

</style>
