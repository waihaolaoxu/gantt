<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">添加第三方代码</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="名称：" prop="name" label-width="150px">
                    <el-input v-model="query.name" placeholder="请填写自定义站点名称"></el-input>
                </el-form-item>
                <el-form-item label="内容：" prop="content" label-width="150px">
                    <el-input type="textarea" :rows="6" placeholder="例如：var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement('script');
            hm.src = 'https://hm.baidu.com/hm.js?c123123123123';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(hm, s);
        })();')</script>" v-model="query.content">
                    </el-input>
                    <p class="el-prompting">该内容将在前台页面原样输出</p>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_show" label-width="150px">
                    <el-radio v-model="query.is_show" :label="1">是</el-radio>
                    <el-radio v-model="query.is_show" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="终端类型：" prop="terminal" label-width="150px">
                    <el-select v-model="query.terminal" placeholder="请选择终端类型">
                        <el-option
                        v-for="item in typeData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    // import {
    //     uploadLoading
    // } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                id: this.$route.query.id,
                loading: false,
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                query: {
                    oper: 'add',
                    id: this.$route.query.id ? Number(this.$route.query.id) : '',
                    name: '',
                    content: '',
                    is_show: 1,
                    terminal: 0
                },
                themeData: [],
                typeData: [{
                    value: 0,
                    label: '不限'
                    }, {
                    value: 1,
                    label: 'PC'
                    }, {
                    value: 2,
                    label: 'H5'
                }],
                rules: {
                    name: [{
                        required: true,
                        message: '请填写第三方代码名称',
                        trigger: 'blur,change'
                    }],
                    content: [{
                        required: true,
                        message: '请填写第三方代码内容',
                        trigger: 'blur,change'
                    }],
                    is_show: [{
                        required: true,
                        message: '请填写是否显示',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    terminal: [{
                        required: true,
                        message: '请选择终端类型',
                        type: 'number',
                        trigger: 'blur,change'
                    }]
                }
            };
        },
        created() {
            _self = this;
            if (_self.id) {
                this.getInfo();
            }
        },
        methods: {
            getInfo() {
                _self.$http.get('code/get', {
                        params: {
                            id: _self.id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.query = res.d;
                        }
                    })
            },
            submitForm(formName) {
                _self.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.get(`code/${_self.id?"update":"create"}`, {
                                params: _self.query
                            })
                            .then(function (res) {

                                if (res.codeFlag) {
                                    if (!_self.id) {
                                        _self.$back('list')
                                    }
                                    _self.$message({
                                        message: _self.id ? "修改成功！" : "添加成功！",
                                        type: 'success'
                                    });
                                }
                            })
                    }
                })
            }
        },
        components: {

        }
    }

</script>
