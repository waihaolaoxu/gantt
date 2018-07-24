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
                    <city-options label="选择城市：" :province='ruleForm.province_id' :city='ruleForm.city_id' @syncProvince='provinceChange' @syncCity='cityChange'
                        props='province_id,city_id'></city-options>
                    <el-form-item label="设计师姓名：" prop="name">
                        <el-input v-model="ruleForm.name" value="请输入设计师姓名"></el-input>
                    </el-form-item>
                     <el-form-item label="级别：">
                        <el-input v-model.number="ruleForm.level" placeholder="请输入级别"></el-input>
                    </el-form-item>
                    <el-form-item label="价格：" prop="price">
                        <el-input placeholder="请输入价格" v-model.number="ruleForm.price">
                            <template slot="append">元/㎡</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="从业年限：" prop="work_years">
                        <el-input placeholder="请输入从业年限" v-model.number="ruleForm.work_years">
                            <template slot="append">年</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="手机号码：" prop='mobile'>
                        <el-input v-model.number="ruleForm.mobile" placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="排序值：" prop='sort'>
                        <el-input type='number' v-model.number="ruleForm.sort" min='0' placeholder="请输入排序值"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="空间：">
                        <el-checkbox :indeterminate="isIndeterminate.space" v-model="checkAll.space" @change="handleCheckAllChange_space">全选</el-checkbox>
                        <el-checkbox-group v-model="ruleForm.space_id" @change="handleCheckedCitiesChange_space" style='margin-top:-36px;margin-left:-30px;'>
                            <span class="checkbox_p"></span>
                            <el-checkbox v-for="(item,k) in options.space" :label="Number(k)" :key="k">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="风格：">
                        <el-checkbox :indeterminate="isIndeterminate.style" v-model="checkAll.style" @change="handleCheckAllChange_style">全选</el-checkbox>
                        <el-checkbox-group v-model="ruleForm.style_id" @change="handleCheckedCitiesChange_style" style='margin-top:-36px;margin-left:-30px;'>
                            <span class="checkbox_p"></span>
                            <el-checkbox v-for="(item,k) in options.style" :label="Number(k)" :key="k">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="户型：">
                        <el-checkbox :indeterminate="isIndeterminate.type" v-model="checkAll.type" @change="handleCheckAllChange_type">全选</el-checkbox>
                        <el-checkbox-group v-model="ruleForm.house_type_id" @change="handleCheckedCitiesChange_type" style='margin-top:-36px;margin-left:-30px;'>
                            <span class="checkbox_p"></span>
                            <el-checkbox v-for="(item,k) in options.type" :label="Number(k)" :key="k">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item> -->
                    <el-form-item label="显示状态：" prop="company_isshow" v-if="info.has_site==1">
                        <el-radio-group v-model="ruleForm.company_isshow">
                            <el-radio :label="1">显示</el-radio>
                            <el-radio :label="0">隐藏</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="设计师简介：">
                        <el-input type="textarea" :rows="4" placeholder="请输入设计师简介" v-model="ruleForm.description">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="设计师头像：">
                        <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                            :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar cover">
                            <span v-if="imageUrl" class="el-prompting">点击更换</span>
                            <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                        </el-upload>
                        <p class="el-prompting">
                            请上传1：1比例图片&nbsp;&nbsp;文件格式JPG、JPEG、PNG，文件大小120K以内，建议尺寸500PX*500PX
                        </p>
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
    import cityOptions from '@/components/block/city';
    import {
        uploadLoading
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                label: this.$route.query.id ? "修改设计师" : "添加设计师",
                info: JSON.parse(this.$localStorage.get('userInfoM')).info,
                value: '',
                imageUrl: '',
                url: '',
                id: this.$route.query.id,
                ruleForm: {
                    id: this.$route.query.id || '',
                    province_id: '',
                    city_id: '',
                    space_id: [],
                    style_id: [],
                    house_type_id: [],
                    sort:0,
                    level:'高级设计师'
                },
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                options: {},
                checkAll: {
                    space: false,
                    style: false,
                    type: false
                },
                isIndeterminate: {
                    space: false,
                    style: false,
                    type: false
                },
                attr: {
                    space: 'space_id',
                    style: 'style_id',
                    type: 'house_type_id'
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
                     sort: [{
                        validator: this.$.v.positive,
                        trigger: 'blur,change',
                        type:'number'
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
                    company_isshow: [{
                        required: true,
                        message: '请选择是否显示',
                        type: 'number',
                        trigger: 'change'
                    }]
                    // price: [{
                    //     validator: this.$.v.positive,
                    //     trigger: 'blur,change',
                    // }],
                    // work_years: [{
                    //     validator: this.$.v.positive,
                    //     trigger: 'blur,change',
                    // }],

                },
            };
        },
        created() {
            _self = this;
            if (this.id) {
                this.getDetail(this.id);
                this.url = "designer/update"
            } else {
                this.getOptions();
                this.url = "designer/create"
            }
        },
        mixins: [uploadLoading],
        methods: {
            provinceChange(v) {
                this.ruleForm.province_id = v;
                setTimeout(() => {
                    this.$refs.ruleForm.validateField('city_id');
                })
            },
            cityChange(v) {
                this.ruleForm.city_id = v;
            },
            getDetail(id) {
                _self.$http.get('designer/get', {
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.codeFlag) {
                        var d = res.data.data;
                        // for (let key in _self.attr) {
                        //     var a = _self.attr[key];
                        //     d[a] = d[a].map(item => {
                        //         return item.toString();
                        //     })
                        // }
                        _self.ruleForm = d;
                        _self.imageUrl = d.cover_img ? d.cover_img + '!zmm' : "";
                        _self.getOptions();
                    }

                })
            },
            getOptions() {
                _self.$cache('case/dict', {
                    params: {
                        name: 'space,type,style'
                    }
                }).then(res => {
                    if (res.codeFlag) {
                        var d = res.data.data;
                        _self.options = d;
                        for (let key in d) {
                            let arr = [];
                            var ds = d[key];
                            for (let k in ds) {
                                arr.push(Number(k));
                            }
                            _self.checkAll[key + 'Arr'] = arr;
                            let checkedCount = _self.ruleForm[_self.attr[key]].length;
                            console.log(checkedCount)
                            if (arr.length == checkedCount) {
                                _self.checkAll[key] = true;
                            } else {
                                _self.checkAll[key] = false;
                            }
                            _self.isIndeterminate[key] = checkedCount > 0 && checkedCount < arr.length;
                        };
                    }
                })
            },
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
                                if (!_self.id) {
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
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            //      上传
            handleAvatarSuccess(res, file) {
                this.ruleForm.cover_url = res.data[0].preview;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.uploadCloseLoding();
            },
            handleCheckAllChange(val, key) {
                this.ruleForm[this.attr[key]] = val ? _self.checkAll[key + 'Arr'] : [];
                this.isIndeterminate[key] = false;
            },
            handleCheckedCitiesChange(value, key) {
                let checkedCount = value.length;
                this.checkAll[key] = checkedCount === this.checkAll[key + 'Arr'].length;
                this.isIndeterminate[key] = checkedCount > 0 && checkedCount < this.checkAll[key + 'Arr'].length;
            },
            handleCheckAllChange_space(val) {
                this.handleCheckAllChange(val, 'space');
            },
            handleCheckedCitiesChange_space(value) {
                this.handleCheckedCitiesChange(value, 'space');
            },
            handleCheckAllChange_style(val) {
                this.handleCheckAllChange(val, 'style');
            },
            handleCheckedCitiesChange_style(value) {
                this.handleCheckedCitiesChange(value, 'style');
            },
            handleCheckAllChange_type(val) {
                this.handleCheckAllChange(val, 'type');
            },
            handleCheckedCitiesChange_type(value) {
                this.handleCheckedCitiesChange(value, 'type');
            }
        },
        components: {
            cityOptions
        }
    }

</script>
