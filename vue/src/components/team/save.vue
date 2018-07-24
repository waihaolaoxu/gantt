<template>
    <div>
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl" :class="{'is-active':tab_type==1}" @click='tab_type=1;'>基本信息</div>
                    <div class="el-tabs__item fl" :class="{'is-active':tab_type==2}" @click='tab_type=2;$refs.ruleForm.clearValidate();' v-if="ruleForm.id != nowLoginId">权限设置</div>
                </div>
            </div>
        </div>
        <div class="list-box">
            <div class="list-body no-border-top">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" size="medium" v-if="tab_type == 1">
                    <el-form-item label="员工头像：">
                        <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                            :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                            <img v-if="imageUrl&&imageUrl!='!zmm'" :src="imageUrl" class="avatar cover">
                            <span v-if="imageUrl&&imageUrl!='!zmm'" class="el-prompting">点击更换</span>
                            <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                        </el-upload>
                        <p class="el-prompting">
                            请上传1：1比例图片&nbsp;&nbsp;文件格式JPG、JPEG、PNG，文件大小120K以内，建议尺寸500PX*500PX
                        </p>
                    </el-form-item>
                    <el-form-item label="姓名：" prop="nickname">
                        <el-input v-model="ruleForm.nickname" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop='phone'>
                        <el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="工作职位：" prop="position">
                        <el-input v-model="ruleForm.position" placeholder="请输入工作职位"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-radio-group v-model="ruleForm.position" size="small">
                            <el-radio-button :label="item.name" v-for='(item,index) in types' :key='index'></el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <city-options label="籍贯：" :province='ruleForm.province_id' :city='ruleForm.city_id' @syncProvince='provinceChange' @syncCity='cityChange'></city-options>
                    <el-form-item label="年龄：" prop="age">
                        <el-input placeholder="请输入年龄" v-model.number="ruleForm.age" min='0' type='number'>
                            <template slot="append">岁</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="从业年限：" prop="work_years">
                        <el-input placeholder="请输入从业年限" v-model.number="ruleForm.worktime" min='0' type='number'>
                            <template slot="append">年</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="个人简介：">
                        <el-input type="textarea" :rows="4" placeholder="请输入设计师简介" v-model="ruleForm.info">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                    </el-form-item>
                </el-form>

                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" size="medium" v-if="tab_type == 2">
                    <el-form-item label="是否设置管理员：">
                        <el-switch v-model="ruleForm.is_admin" active-color="#13ce66" inactive-color="#ccc" active-text="" inactive-text="" active-value="1"
                            inactive-value="0">
                        </el-switch>
                    </el-form-item>
                    
                    <div v-if="ruleForm.is_admin!=1">
                        <el-form-item label="可领取客户：">
                            <el-switch v-model="ruleForm.is_clue_platform" active-color="#13ce66" inactive-color="#ccc" active-text="" inactive-text="" :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="可创建工地：">
                            <el-switch v-model="ruleForm.is_engineer_add" active-color="#13ce66" inactive-color="#ccc" active-text="" inactive-text="" :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="可管理工地账本：">
                            <el-switch v-model="ruleForm.is_income_bill" active-color="#13ce66" inactive-color="#ccc" active-text="" inactive-text="" :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="可管理公司网铺：">
                            <el-switch v-model="ruleForm.is_netshop" active-color="#13ce66" inactive-color="#ccc" active-text="" inactive-text="" :active-value="1"
                                :inactive-value="0">
                            </el-switch>
                        </el-form-item>
                    </div>
                    <el-form-item label="禁用帐号：">
                        <el-switch v-model="ruleForm.is_show" active-color="#13ce66" inactive-color="#ccc" active-text="" inactive-text="" active-value="0"
                            inactive-value="1">
                        </el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import cityOptions from '@/components/block/city';
    import {
        uploadLoading
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                // label: this.$route.query.id ? "修改成员" : "添加成员",
                nowLoginId: '', //当前登陆用户的ID
                tab_type: '1',
                value: '',
                imageUrl: '',
                url: '',
                types: [],
                id: this.$route.query.id,
                ruleForm: {
                    id: this.$route.query.id || '',
                    province_id: '',
                    city_id: '',
                    is_clue_platform: 0,
                    is_engineer_add: 0,
                    is_netshop: 0,
                    is_income_bill: 0,
                    is_admin: 0
                },
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                rules: {
                    nickname: [{
                        required: true,
                        message: '请输入姓名',
                        trigger: 'blur,change'
                    }],
                    position: [{
                        required: true,
                        message: '请输入职位',
                        trigger: 'blur,change'
                    }],
                    phone: [{
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur,change'
                    }, {
                        validator: this.$.v.tel,
                        trigger: 'blur,change',
                    }],
                    province_id: [{
                        required: true,
                        message: '请选择省',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    city_id: [{
                        required: true,
                        message: '请选择市',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    // age: [{
                    //     validator: this.$.v.positive,
                    //     trigger: 'blur,change',
                    // }],
                    // worktime: [{
                    //     validator: this.$.v.positive,
                    //     trigger: 'blur,change',
                    // }],

                },
            };
        },
        created() {
            _self = this;
            _self.getJob();
            var userInfo = JSON.parse(this.$localStorage.get('userInfoM'));
            this.nowLoginId = userInfo.info.admin_user_id
            if (_self.id) {
                _self.getDetail();
            }
        },
        watch: {
            // 'ruleForm.is_admin'(){
            //     if (this.ruleForm.is_admin === 1) {
            //         this.tab_type = '1'
            //     }
            // }
        },
        mixins: [uploadLoading],
        methods: {
            provinceChange(v) {
                this.ruleForm.province_id = v;
                // setTimeout(() => {
                //     this.$refs.ruleForm.validateField('city_id');
                // })
            },
            getJob() {
                _self.$http.get('team/job/list').then(res => {
                    if (res.codeFlag) {
                        _self.types = res.d;
                    }
                })
            },
            cityChange(v) {
                this.ruleForm.city_id = v;
            },
            getDetail(id) {
                _self.$http.get(`team/member/info`, {
                    params: {
                        id: _self.id
                    }
                }).then(res => {
                    if (res.codeFlag) {
                        var d = res.d;
                        console.log(d.is_admin)
                        _self.ruleForm = d;
                        console.log("info的数据", _self.ruleForm)
                        _self.ruleForm.is_admin = String(_self.ruleForm.is_admin)
                        _self.ruleForm.is_show = String(_self.ruleForm.is_show)
                        _self.imageUrl = d.imgfile + '!zmm';
                    }

                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (_self.ruleForm.is_admin === 1 || _self.ruleForm.id == _self.nowLoginId) {
                            console.log("删除之前的数据", _self.ruleForm)
                            delete _self.ruleForm.is_clue_platform
                            delete _self.ruleForm.is_engineer_add
                            delete _self.ruleForm.is_netshop
                            delete _self.ruleForm.is_income_bill
                            delete _self.ruleForm.is_admin
                            delete _self.ruleForm.is_show
                            console.log("删除之后的数据", _self.ruleForm)
                        }
                        _self.$http.post(`team/member/${_self.id?'update':'store'}`, _self.ruleForm).then(res => {
                            // console.log(res);
                            if (res.codeFlag) {
                                _self.$message({
                                    type: 'success',
                                    message: res.data.description
                                });
                                // if (!_self.id) {
                                //     _self.$back('list');
                                // }
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
            },
            //      上传
            handleAvatarSuccess(res, file) {
                this.ruleForm.imgfile = res.data[0].preview;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.uploadCloseLoding();
            }
        },
        components: {
            cityOptions
        }
    }

</script>
