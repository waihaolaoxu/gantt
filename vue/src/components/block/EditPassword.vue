<template>
    <div>
        <el-dialog
            title="修改密码"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
                     size="medium">
                <el-form-item label="旧密码" prop="old_pwd" v-if="$.userInfo.info.has_password==1">
                    <el-input type="password" v-model="ruleForm.old_pwd" placeholder="请输入旧密码"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_pwd">
                    <el-input type="password" v-model="ruleForm.new_pwd" placeholder="请输入新密码"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="confirm_new_pwd">
                    <el-input type="password" v-model="ruleForm.confirm_new_pwd" placeholder="请重复输入新密码"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm')" size="medium">提交</el-button>
                <el-button @click="resetForm('ruleForm')" size="medium">重置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import bus from '../../state'

    export default {
        data() {
            return {
                dialogVisible: false,
                ruleForm: {
                    old_pwd: '',
                    new_pwd: '',
                    confirm_new_pwd: ''
                },
                rules: {
                    old_pwd: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                        {min: 6, message: '密码长度最少6个字符', trigger: 'blur'}
                    ],
                    new_pwd: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {min: 6, message: '密码长度最少6个字符', trigger: 'blur'}
                    ],
                    confirm_new_pwd: [
                        {required: true, message: '请重复输入新密码', trigger: 'blur'},
                        {min: 6, message: '密码长度最少6个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            var that = this;
            bus.$on('editShow', function (editShow) {
                that.dialogVisible = editShow;
            })
        },
        mounted() {

        },
        methods: {
            handleClose(done) {
                 done();
                // this.$confirm('确认关闭？')
                //     .then(_ => {
                //         done();
                //     })
                //     .catch(_ => {
                //     });
            },
            submitForm(formName) {
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$http.post('account/updatePwd',this.ruleForm)
                            .then(function(res){
                                if (res.data.code == '1000') {
                                    that.$back('/login')
                                }
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>
