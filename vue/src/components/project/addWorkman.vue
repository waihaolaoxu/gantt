<template>
    <div class="form-page">
         <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">编辑工长信息</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="姓名：" prop="name">
                    <el-input v-model="query.name" placeholder="请输入工长姓名"></el-input>
                </el-form-item>
                <el-form-item label="工长账号：" prop="phone">
                    <el-input v-model="query.phone" placeholder="工长账号即手机号"></el-input>
                </el-form-item>
                <city-options label="籍贯：" :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange'
                        props='province_id,city_id'></city-options>
                <el-form-item label="年龄：" prop="age">
                    <el-input v-model.number="query.age" placeholder="周岁"></el-input>
                </el-form-item>
                <el-form-item label="工作年限：" prop="work_time">
                    <el-input v-model.number="query.work_time" placeholder="年"></el-input>
                </el-form-item>
                <el-form-item label="施工团体：" prop="people_num">
                    <el-input v-model="query.people_num" placeholder="人"></el-input>
                </el-form-item>

                <el-form-item label="服务城市：" prop="service_area" >
                    <el-select
                        v-model="query.service_area"
                        multiple
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入服务城市"
                        :remote-method="remoteMethod"
                        :loading="loading" style='width:100%;'>
                        <el-option
                            v-for="item in optionsCity"
                            :key="item.id"
                            :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="从业经历：" prop="work_info">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容"
                        v-model="query.work_info">
                    </el-input>
                </el-form-item>
                <el-form-item label="自我评价：" prop="introduce">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入自我评价"
                        v-model="query.introduce">
                    </el-input>
                </el-form-item>
                <el-form-item label="排序ID：" prop="order_id">
                    <el-input v-model.number="query.order_id" :controls="false"></el-input>
                </el-form-item>
                <el-form-item label="工长状态：" prop="is_show">
                    <el-radio v-model="query.is_show" label="yes">显示</el-radio>
                    <el-radio v-model="query.is_show" label="no">不显示</el-radio>
                </el-form-item>
                <el-form-item label="推荐工长：" prop="recommend">
                    <el-radio v-model="query.recommend" label="yes">推荐</el-radio>
                    <el-radio v-model="query.recommend" label="no">不推荐</el-radio>
                </el-form-item>
                <el-form-item label="联系电话：" prop="tel">
                    <el-input v-model="query.tel" placeholder="联系电话"></el-input>
                </el-form-item>
                <el-form-item label="现住址：" prop="address">
                    <el-input v-model="query.address" placeholder="现住址"></el-input>
                </el-form-item>
                <el-form-item label="签约开始时间：" prop="sign_time_begin">
                    <el-date-picker
                        v-model="query.sign_time_begin"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="签约结束时间：" prop="sign_time_end">
                    <el-date-picker
                        v-model="query.sign_time_end"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="工长等级：" prop="level">
                    <el-input v-model="query.level" placeholder="工长等级"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="note">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入备注"
                        v-model="query.note">
                    </el-input>
                </el-form-item>
                <el-form-item label="用户头像：" prop="headimg">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                        :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                        <img v-if="imageUrl" :src="imageUrl+'!zs'" class="avatar cover">
                        <span v-if="imageUrl" class="el-prompting">点击更换</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                    <el-button @click="resetForm('query')">返回</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        uploadLoading
    } from '@/mixins/index';
    import cityOptions from '@/components/block/city';
    export default {
        mounted() {
//            this.list = this.states.map(item => {
//                return { value: item, label: item };
//            });
        },
        data() {
            return {
                loading: false,
                imageUrl:'',
                query: {
                    name: '',
                    phone:'',
                    province_id: '',
                    city_id: '',
                    work_time: '',
                    people_num: '',
                    work_info: '',
                    introduce: '',
                    service_area:[],
                    order_id: '',
                    is_show: 'no',
                    recommend:'no',
                    age: '',
                    level: '',
                    note:'',
                    tel: '',
//                    ensure:'',
                    address: "",
                    sign_time_begin: "",
                    sign_time_end: "",
                    headimg: '',
                },
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                optionsCity: [],
                submitUrl:'',
                rules: {
                    name: [
                        {required: true, message: '请输入工长姓名', trigger: 'blur'}
                    ],
                    age: [{
                        validator: this.$.v.positive1,
                        required: true,
                        trigger: 'blur,change'
                    }],
                    province_id: [{
                        required: true,
                        type:'number',
                        message: '请选择省',
                        trigger: 'blur,change'
                    }],
                    city_id: [{
                        required: true,
                        type:'number',
                        message: '请选择市',
                        trigger: 'blur,change'
                    }],
                    work_time: [{
                        validator: this.$.v.positive2,
                        required: true,
                        trigger: 'blur,change'
                    }],
                    work_info: [
                        {required: true, message: '请输入从业经历', trigger: 'blur'}
                    ],
                    headimg: [
                        {required: true, message: '请上传用户头像', trigger: 'blur'}
                    ],
                }
            };
        },
        mixins: [uploadLoading],
        created(){
            if (this.$route.query.id) {
                var _self = this;
                this.submitUrl = 'workman/update'
                this.query.id = this.$route.query.id
                this.$http.get('workman/info',{
                    params: {
                        id: this.$route.query.id
                    }
                })
                    .then(function (res) {
                        console.log("工长详情：",res.data.data)
                        _self.query.name =  res.data.data.name || '' ;
                        _self.query.phone =  res.data.data.phone || '' ;
                        _self.query.province_id =  res.data.data.province_id || '' ;
                        _self.query.city_id =  res.data.data.city_id || '' ;
                        _self.query.work_time =  res.data.data.work_time || '' ;
                        _self.query.people_num =  res.data.data.people_num || '' ;
                        _self.query.work_info =  res.data.data.work_info || '' ;
                        _self.query.introduce =  res.data.data.introduce || '' ;

                        var arr = [];
                        (res.d.service_area||[]).forEach(e=>{
                            if(e){
                                arr.push(e);
                            }
                        });
                        _self.query.service_area = arr;
                        _self.query.order_id =  res.data.data.order_id || '' ;
                        _self.query.is_show =  res.data.data.is_show || '' ;
                        _self.query.recommend =  res.data.data.recommend || '' ;
                        _self.query.age =  res.data.data.age || '' ;
                        _self.query.level =  res.data.data.level || '' ;
                        _self.query.note =  res.data.data.note || '' ;
                        _self.query.tel =  res.data.data.tel || '' ;
//                        _self.query.ensure =  res.data.data.ensure || '' ;
                        _self.query.address =  res.data.data.address || '' ;
                        _self.query.sign_time_begin =  res.data.data.sign_time_begin || '' ;
                        _self.query.sign_time_end =  res.data.data.sign_time_end || '' ;
                        _self.query.headimg =  res.data.data.headimg || '' ;
                        _self.imageUrl = res.data.data.headimg || '' ;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                this.submitUrl = 'workman/create';
            }
        },
        methods: {
            remoteMethod(query) {
                if (query !== '') {
                    var that = this;
                    setTimeout(() => {
                        that.$http.get('common/city/list',{
                            params: {
                                name: query
                            }
                        })
                        .then(function (res) {
                            that.optionsCity = res.data.data.list.filter(item => {
                                return item.value.toLowerCase()
                                    .indexOf(query.toLowerCase()) > -1;
                            });

                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    }, 200);
                } else {
                    this.optionsCity = [];
                }
            },
            provinceChange(v) {
                this.query.province_id = v;
                setTimeout(() => {
                    this.$refs.query.validateField('city_id');
                })
            },
            cityChange(v) {
                this.query.city_id = v;
            },
            // handleAvatarSuccess(res, file) {
            //     this.query.headimg = res.data[0].preview;
            //     // this.imageUrl = URL.createObjectURL(file.raw);
            //     this.uploadCloseLoding();
            // },
            submitForm(formName) {
                if(this.$route.query.id) {
                    this.submitUrl = 'workman/update'
                } else {
                    this.submitUrl = 'workman/create'
                }
                console.log("工长提交数据:",this.query)
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        that.$http.post(this.submitUrl,this.query)
                            .then(function (res) {
                                if(res.data.code == '1000') {
                                    that.$message({
                                        type: 'success',
                                        message: res.data.description
                                    });
                                    if(!that.query.id){
                                        that.$back();
                                    }
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                                that.loading = false;
                            });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 上传
            handleAvatarSuccess(res, file) {
                this.query.headimg = res.data[0].preview;
                this.imageUrl = res.data[0].preview;
                this.uploadCloseLoding();
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        },
        components: {
            cityOptions
        }
    }
</script>
