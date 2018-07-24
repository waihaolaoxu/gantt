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
                    <el-form-item label="查询楼盘：" prop='building_id'>
                        <el-autocomplete v-model="ruleForm.name" :fetch-suggestions="querySearchAsync" placeholder="请输入查询楼盘" @select="handleSelect"
                            valueKey='name' :trigger-on-focus="false" style='width:100%;'>
                        </el-autocomplete>
                        <input type="hidden" v-model='ruleForm.building_id'>
                    </el-form-item>
                    <el-form-item label="封面图：">
                        <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                            :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar cover">
                            <span v-if="imageUrl" class="el-prompting">点击更换</span>
                            <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                        </el-upload>
                        <p class="el-prompting">
                            文件格式JPG、JPEG、PNG，文件大小120K以内，建议尺寸800PX*600PX
                        </p>
                    </el-form-item>
                    <el-form-item label="首页推荐：" prop='sort'>
                        <el-switch v-model="ruleForm.index_flag" active-color="#13ce66" inactive-color="#ccc"
                            active-text="" inactive-text="" active-value="1" inactive-value="0" @change="setStatus(ruleForm.index_flag)"> <!-- :disabled="scope.row.cover == null"-->
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="排序值：" prop='sort'>
                        <el-input v-model.number="ruleForm.sort" placeholder="排序值越大越靠前默认值0"></el-input>
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
    import {
        uploadLoading
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
            return {
                d: [],
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                imageUrl: '',
                buildingData:'',
                label: this.$route.query.id ? "修改楼盘" : "添加楼盘",
                id: this.$route.query.id,
                info:JSON.parse(this.$localStorage.get('userInfoM')).info,
                ruleForm: {
                    id: this.$route.query.id || '',
                    index_flag: "",
                    cover:"",
                    sort: 0
                },
                rules: {
                    building_id: [{
                        required: true,
                        message: '请查询楼盘',
                        type:'number',
                        trigger: 'blur,change'
                    }],
                    sort: [{
                        validator: this.$.v.positive,
                        trigger: 'blur,change',
                        message: '排序是不能小于0的数字',
                    }]
                },
            };
        },
        created() {
            _self = this;
            if (this.id) {
                this.getDetail(this.id);
            } else {

            }
        },
        mixins: [uploadLoading],
        methods: {
            setStatus(obj) {
                console.log("修改状态", obj)
                if (!_self.ruleForm.cover) {
                    this.$message({
                        message: '请维护楼盘封面图片！',
                        type: 'warning'
                    });
                    this.ruleForm.index_flag = '0'
                }
            },
            querySearchAsync(queryString, cb) {
                if (queryString) {
                    this.$cache('building/search/list', {
                        params: {
                            key: queryString,
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            if (res.data.data) {
                                var d = res.data.data.list;
                                // console.log(d);
                                cb(d);
                            }

                        }
                    })
                }

            },
            //      上传
            handleAvatarSuccess(res, file) {
                this.ruleForm.cover = res.data[0].preview;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.uploadCloseLoding();
            },
            handleSelect(item) {
                this.ruleForm.building_id = item.building_id;
            },
            getDetail(id) {
                _self.$http.get('building/get', {
                    params: {
                        id: id
                    }
                }).then(res => {
                    if (res.codeFlag) {
                        var d = res.data.data;
                        _self.ruleForm = d;
                        _self.imageUrl = d.cover ? d.cover + '!mm' : "";
                        _self.ruleForm.index_flag = String(_self.ruleForm.index_flag);
                    }

                })
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.post(`building/${_self.id?'update':'create'}`, _self.ruleForm).then(res => {
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
    }

</script>
