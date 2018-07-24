<template>
    <div>

    </div>
</template>

<script>
    var _self;
    export default {
        data() {
            return {

            }
        },
        created() {
            _self = this;
            var q = _self.$route.query;
            if (q.cms_userid && q.token && q.sub_uid) {
                _self.login(q);
            } else {
                _self.$message({
                    message: '缺少参数',
                    type: 'error'
                });
            }
        },
        methods: {
            login(q) {
                _self.$http.post('account/cms/login', q).then(res => {
                    if (res.codeFlag) {
                        _self.$localStorage.set('userInfoM', JSON.stringify(res.data.data), 24 *
                            60 * 60 * 1000); // 1天后过期
                        _self.$.userInfo = res.data.data;
                        _self.$message({
                            message: res.data.description,
                            type: 'success'
                        });
                        _self.$router.replace({
                            path: '/'
                        });
                    } else {
                        _self.$router.replace({
                            path: '/login'
                        });
                    }
                }).catch(error => {
                    _self.$router.replace({
                        path: '/login'
                    });
                })
            }
        },
    }

</script>

<style scoped>


</style>
