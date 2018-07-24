<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">基本信息</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <empty :empty='!loading&&!modular_data' :loading='loading'></empty>
            <div class="moduleSild" v-if="modular_data">
                <template v-for="(modularItem,key) in modular_data.modular_page">
                    <p class="moduleSildTit">{{modularItem}}</p>
                    <ul>
                        <template v-for="(modularItem2,key2) in modular_data.modular_list[key]">
                            <li>
                                <a @click="jumpFn(modularItem2,modularItem)" class="a-hover">{{modularItem2.name}}</a>
                            </li>
                        </template>
                    </ul>
                </template>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .moduleSild .moduleSildTit {
        font-size: 18px;
        margin-top: 10px;
        margin-bottom: 10px;
        color: #000;
        font-weight: 500;
    }

    .moduleSild ul li {
        font-size: 14px;
    }

</style>
<script>
    var _self;
    export default {
        data() {
            return {
                loading: true,
                modular_data: ''
            };
        },
        methods: {
            jumpFn(row, page_name) {
                console.log("rowrow", row)
                this.$router.push({
                    path: '/site/modular_data_list',
                    query: {
                        id: row.id,
                        page_id: row.page_id,
                        t_id: row.id,
                        name: row.name,
                        page_name: page_name
                    }
                })
            }
        },
        created() {
            _self = this;
            this.$http.get('modular/list')
                .then(function (res) {
                    _self.loading = false;
                    if (res.codeFlag) {
                        var d = res.data.data;
                        _self.modular_data = d
                    }
                })
        },
        components: {}
    }

</script>
