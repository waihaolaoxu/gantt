<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">{{label}}</div>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="list-body no-border-top">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" size="medium">
                    <el-form-item label="设计师姓名：" prop="name">
                        <el-input v-model="ruleForm.name" placeholder="请输入设计师姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop='mobile'>
                        <el-input v-model.number="ruleForm.mobile" placeholder="请输入手机号码"></el-input> {{ruleForm.mobile}}
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    var _self;
    export default {
        data() {
            return {
                label: "添加成员",
                id: this.$route.query.id,
                ruleForm: {
                },
                rules: {
                    name: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur,change'
                    }],
                    mobile: [{
                        validator: this.$.v.tel,
                        trigger: 'blur,change',
                    }],
                },
            };
        },
        created() {
            _self = this;
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var data = this.$.extend({}, _self.ruleForm);
                        for (let key in _self.attr) {
                            var a = _self.attr[key];
                            data[a] = data[a].join(',');
                        }
                        _self.$http.post(this.url, data).then(res => {
                            // console.log(res);
                            if (res.codeFlag) {
                                _self.$message({
                                    type: 'success',
                                    message: res.data.description
                                });
                                if(!_self.id){
                                    _self.$back('list');
                                }
                            }
                        });
                    } else {
                        _self.$message({
                            message: '表单填写不完整',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            }
        },
        components: {
        }
    }

</script>
