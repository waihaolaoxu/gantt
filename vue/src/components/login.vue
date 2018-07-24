<template>
    <div class="box login-page">
        <div class="login">
            <div class="f18 text-center">
                网家装企云管理平台
            </div>
            <div class="loginCon">
                <div class="loginCon_header">
                    <p :class="{'activeType':activeType}" @click="passwdFn">密码登录</p>
                    <p :class="{'activeType':!activeType}" @click="messageFn">短信登录</p>
                </div>

                <div style='overflow:hidden;' class="mt20">
                    <div class="loginCon_con" style='width:220%' :class='{"form-left":!activeType}'>
                         <el-form :model="ruleAccountForm" :rules="rulesAccount" ref="ruleAccountForm" label-width="100px" class="demo-ruleForm fl">
                            <el-form-item style="position:relative;" prop="phone">
                                <el-input placeholder="账号" v-model="ruleAccountForm.phone" @keyup.enter.native="submitForm('ruleAccountForm')"></el-input>
                            </el-form-item>
                            <el-form-item style="position:relative;" prop="passwd" @keyup.enter.native="submitForm('ruleAccountForm')">
                                <el-input type="password" placeholder="密码" v-model="ruleAccountForm.passwd"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleAccountForm')" style="width:100%">登录</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form :model="ruleCodeForm" ref="ruleCodeForm" :rules="rulesCode" label-width="100px" class="demo-ruleForm fl">
                            <el-form-item style="position:relative;" prop="phone">
                                <span style="position:absolute;right:10px;color:#ccc;z-index:10" @click="getCode" class="allowcode" :class='{"no-pointer":getCodeText!="获取验证码"}'>
                                    {{getCodeText}}
                                </span>
                                <el-input placeholder="手机号" v-model="ruleCodeForm.phone" @keyup.enter.native="submitForm('ruleCodeForm')"></el-input>
                            </el-form-item>
                            <el-form-item style="position:relative;" prop="telcode">
                                <el-input placeholder="验证码" v-model="ruleCodeForm.telcode" @keyup.enter.native="submitForm('ruleCodeForm')"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleCodeForm')" style="width:100%">登 陆</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<style lang="scss">
    .login-page {
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }

</style>
<style scoped lang="scss">
    .box {
        width: 100%;
        height: 100%;
        background: url(../assets/bg.png) repeat;
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .form-left {
        margin-left: -110%;
    }

    .demo-ruleForm {
        width: 50%;
        box-sizing: border-box;
        padding-right: 5%;
    }

    .login {
        width: 300px;
        background: #fff;
        margin: 0 auto;
        padding: 30px;
        border-radius: 8px; // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.18);


        .logo {
            width: 200px;
            margin: 0 auto;
            img {
                width: 100%;
            }
        }
        .loginCon {
            width: 300px;
            margin-top: 30px;
            .loginCon_header {
                width: 160px;
                margin: 0 auto;
                margin-bottom: 20px;
                overflow: hidden;
                p {
                    width: 60px;
                    font-size: 14px;
                    font-weight: 700;
                    text-align: left;
                    color: #333333;
                    padding-bottom: 5px;
                    float: left;
                    cursor: pointer;
                    position: relative;
                }
                .activeType {
                    color: #2395ff;
                }
                p:first-child {
                    margin-right: 40px;
                }
                .activeType:after {
                    content: '';
                    width: 60px;
                    height: 2px;
                    background: red;
                    position: absolute;
                    bottom: 0;
                    left: 0;
                }
            }
            .loginCon_con {
                transition: all 0.4s;
                .allowcode {
                    pointer-events: none;
                    user-select: none;
                }
                .is-success {
                    .allowcode:not(.no-pointer) {
                        color: #2395ff !important;
                        cursor: pointer;
                        pointer-events: auto;
                    }
                }
            }
        }
    }

</style>
<script>
    var _self;
    export default {
        data() {
            return {
                activeType: true,
                getCodeText: '获取验证码',
                ruleCodeForm: {
                    phone: '',
                    telcode: ''
                },
                ruleAccountForm: {
                    phone: '',
                    passwd: ''
                },
                rulesCode: {
                    phone: [{
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur,change'
                    }, {
                        validator: this.$.v.tel,
                        trigger: 'blur,change',
                    }],
                    telcode: [{
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur,change'
                        },
                        {
                            min: 3,
                            max: 6,
                            message: '验证码长度在 3 到 5 个字符',
                            trigger: 'blur,change'
                        }
                    ]
                },
                rulesAccount: {
                    phone: [{
                        required: true,
                        message: '请输入登录账号',
                        trigger: 'blur,change'
                    }],
                    passwd: [{
                            required: true,
                            message: '请输入登录密码',
                            trigger: 'blur,change'
                        },
                        {
                            min: 6,
                            message: '密码必须是字母数字混合且6位以上!',
                            trigger: 'blur,change'
                        }
                    ],
                }
            };
        },
        watch: {
            'ruleCodeForm.phone': function (newval, old) {
                // if (this.$refs.ruleCodeForm.validateField('phone')) {
                //     this.allowGetCode = true
                // } else {
                //     this.allowGetCode = false
                // }
            }
        },
        created() {
            _self = this;
        },
        methods: {
            interval() {
                var _self = this,
                    time = 60;
                _self.getCodeText = time + 's';
                var s = setInterval(function () {
                    time--;
                    _self.getCodeText = time + 's';
                    if (time <= 0) {
                        _self.getCodeText = '获取验证码';
                        clearInterval(s);
                    }
                }, 1000)
            },
            messageFn() {
                this.activeType = false;
                // this.$refs["ruleAccountForm"].resetFields();

            },
            passwdFn() {
                this.activeType = true;
                // this.$refs["ruleCodeForm"].resetFields();

            },
            getCode() {
                var _self = this;
                var phone = this.ruleCodeForm.phone;

                function reload_img() {
                    document.querySelector('#phone_code').src =
                        `/api/company/common/captcha?phone=${phone}&d=${new Date()}`
                }
                var img = `<img id='phone_code' style='cursor:pointer;'>`;
                this.$prompt(img, '请输入图片验证码', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: 'prompt-code',
                    dangerouslyUseHTMLString: true,
                    inputPattern: /^[a-z0-9]+$/i,
                    inputErrorMessage: '验证码格式不正确',
                    beforeClose: function (action, instance, done) {
                        if (action == 'confirm') { //确定按钮点击
                            _self.$http.post('common/get_tel_code', {
                                phone: phone,
                                vcode: instance.inputValue
                            }).then(res => {
                                if (res.codeFlag) {
                                    _self.$message({
                                        type: 'success',
                                        message: res.data.description
                                    });
                                    _self.interval();
                                    done();
                                } else {
                                    reload_img();
                                }
                            });
                        } else {
                            done();
                        }
                    }
                }).then(({
                    value
                }) => {

                }).catch(() => {

                }); 
                setTimeout(function () {
                    reload_img();
                    document.querySelector('#phone_code').addEventListener('click', function () {
                        reload_img();
                    })
                })

            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var url = 'account/login',
                            d = _self.ruleAccountForm;
                        if (!this.activeType) { // 验证码登录
                            url = 'account/fast/login';
                            d = _self.ruleCodeForm;
                        }
                        this.$http.post(url, d).then(res => {
                            if (res.codeFlag) {
                                _self.$localStorage.set('userInfoM', JSON.stringify(res.data.data), 24 *
                                    60 * 60 * 1000); // 1天后过期
                                _self.$.userInfo = res.data.data;
                                _self.$message({
                                    message: res.data.description,
                                    type: 'success'
                                });
                                _self.$.userInfo = res.data.data;
                                _self.$router.replace({
                                    path: '/'
                                });
                            }
                        })
                    } else {
                        _self.$message({
                            message: '表单填写不完整',
                            type: 'warning'
                        });
                        return false;
                    }
                });
            }
        }
    }

</script>
