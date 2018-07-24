<template>
    <div class="list-box">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl" :class="{'is-active':queryData.selectType==1}" @click="selectTag(1)">{{query.type == 1 ? '收入' : '支出'}}</div>
                    <div class="el-tabs__item fl" :class="{'is-active':queryData.selectType==2}" @click="selectTag(2)">添加类型</div>
                </div>
            </div>
        </div>
        <div class="list-body">
            <el-form :model="query" :rules="rules" ref="query" label-width="120px" class="demo-ruleForm" size="medium" v-if="queryData.selectType == 1">
                <el-form-item label="工地：" prop='q' class="need-required">
                    <div class="pr">
                        <div class="f14 bg-greyBg flex-box middle" style='line-height:1.5em;padding:10px;border-radius:5px;' v-if='d.id'>
                            <div class="flex1">
                                <div>{{d.title}}</div>
                                <!-- <div>{{d.build_name}} {{d.landlord_name}} {{d.room_name?d.room_name+"居室":''}} {{d.area?d.area+"㎡":''}}</div> -->
                                <div class="mt5 f12">
                                    <i class="iconfont icon-ren f12"></i> {{ d.landlord_name }}
                                    <span class="pd-r10"></span>
                                    <i class="iconfont icon-ziyuan f12"></i> {{ d.build_name }}
                                </div>
                            </div>
                            <i class="el-icon-arrow-down"></i>
                        </div>
                        <el-autocomplete v-model="query.q" :fetch-suggestions="querySearchAsync" placeholder="请输入查询工地" @select="handleSelect" :trigger-on-focus="true"
                            style='width:100%;' :class="{'autoInput':d.id}" class="pa full zero">
                            <template slot-scope="props">
                                <div class="f14" style='line-height:1.5em;padding:5px;'>
                                    <div>{{props.item.title}}</div>
                                    <!-- <div>{{props.item.build_name}} {{props.item.landlord_name}} {{props.item.room_name?props.item.room_name+"居室":''}} {{props.item.area?props.item.area+"㎡":''}}</div> -->
                                    <div class="mt5 f12">
                                        <i class="iconfont icon-ren f12"></i> {{ props.item.landlord_name }}
                                        <span class="pd-r10"></span>
                                        <i class="iconfont icon-ziyuan f12"></i> {{ props.item.build_name }}
                                    </div>
                                </div>
                            </template>
                        </el-autocomplete>
                        <input type="hidden" v-model='query.engineer_id'>
                    </div>
                </el-form-item>
                <!--<el-form-item label="类型：" prop="type">
                    <el-radio v-model.number="query.type" :label="1">收入</el-radio>
                    <el-radio v-model.number="query.type" :label="2">支出</el-radio>
                </el-form-item>-->

                <el-form-item :label="$route.query.type == 1 ? '收入类型：' : '支出类型：'" prop="expend_type">
                    <!--<el-radio v-model="query.expend_type" @change='query.expend_uid="";query.expend_value=""' :label="item.key" v-for='(item,index) in typeList' :key='index'>{{item.value}}</el-radio> -->
                    <!-- <el-radio :label="v.id" v-for="(v,index) in typeList"  v-model="query.expend_type" :key='index'>{{v.name}}</el-radio> -->
                    <ul class="typeImg">
                        <li class="flex-box flex-column middle" :class="typeImgItem.id == query.expend_type ? 'selectdType' : ''" v-for="typeImgItem,index in typeList" :key="index" @click="clickTypeBtn(index,typeImgItem.id)" style="width: 100px;float:left;margin-bottom: 15px;">
                            <img :src="typeImgItem.cover">
                            <div class="text">{{typeImgItem.name}}</div>
                        </li>
                    </ul>
                    <input type="hidden" v-model='query.expend_type'>
                </el-form-item>
                <template v-if="$route.query.type == 2">
                    <el-form-item label="支出用户类型：" prop="expend_user_type">
                        <el-select v-model="query.expend_user_type" @change="changeExpendType" placeholder="请选择支出类型" >
                            <el-option key="0" label="请选择支出类型" value="0"></el-option>
                            <el-option key="1" label="员工" value="1"></el-option>
                            <el-option key="2" label="供应商" value="2"></el-option>
                            <el-option key="3" label="业务联系人" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支出用户姓名：" prop="expend_user_name" v-if="Number(query.expend_user_type)">
                        <el-autocomplete
                            v-model="query.expend_user_name"
                            class="inline-input"
                            :value-key="this.query.expend_user_type == 1 ? 'nickname' : 'name'"
                            :fetch-suggestions="querySearchName"
                            placeholder="请输入支出用户姓名"
                            @select="handleSelectName"
                        ></el-autocomplete>
                    </el-form-item>
                </template>

                <!-- <el-form-item v-if='query.type==2&&query.expend_type'>
                    <div v-for='(item,i) in users' :key='i' v-if="query.expend_type !=7 && query.expend_type !=2">
                        <el-select v-model="query.expend_uid" :placeholder="'请选择'+item.name" v-if='query.expend_type==item.type'>
                            <el-option v-for="(item1,index1) in item.list" :key="index1" :label="item1.name" :value="item1.id">
                            </el-option>
                        </el-select>
                    </div>
                    v-model="query.expend_uid"
                    <div v-if="query.expend_type !=7 && query.expend_type !=2">
                        <el-autocomplete
                            v-if="query.expend_type !=7 && query.expend_type !=2"
                            value-key='name'
                            v-model="query.expend_value"
                            :fetch-suggestions="querySearchAsyncType"
                            placeholder="请输入支出用户姓名"
                            @select="handleSelectType"
                        ></el-autocomplete>
                    </div>
                </el-form-item> -->
                <el-form-item label="金额：" prop="money">
                    <el-input type="number" v-model="query.money" min='0' :rows="10" :maxlength="255" placeholder="金额">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="时间：" prop="create_date">
                    <el-date-picker v-model="query.create_date" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="单据附件：">
                    <el-upload :action="$.upload" name='file' :data='$.uploadData' list-type="picture-card" :show-file-list="true" multiple :on-remove="handleRemove"
                        :before-upload="beforeAvatarUploadLoding" :on-success="handleAvatarSuccess" :file-list="imgs.fileList"
                        :accept='$.accept' :on-exceed='exceed' :on-preview="handlePictureCardPreview2">
                        <!-- <i class="el-icon-plus" :class='{"text-danger":imgFlag}'></i> -->
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="imgs.dialogVisible">
                        <img width="100%" :src="imgs.dialogImageUrl" alt="">
                    </el-dialog>
                    <p class="el-prompting"><!-- 图片张数1-9张， -->文件格式GIF、JPG、JPEG，文件大小500K以内，建议尺寸800PX*600PX</p>
                </el-form-item>
                <!-- <div class="el-form-item__error" v-if='imgFlag'>
                    请上传图片
                </div> -->
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input type="textarea" v-model="query.remark" :rows="10" :maxlength="255" placeholder="请填写备注信息"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                    <!-- <el-button @click="submitForm('query')">删除</el-button> -->
                </el-form-item>
            </el-form>
            <el-form v-if="queryData.selectType == 2">
                <config :type="query.type"></config>
            </el-form>
        </div>
    </div>
</template>
<style lang='scss'>
    .el-upload-list__item-preview {
        // display: none !important;
    }

    .autoInput input {
        opacity: 0;
        height: 45px !important;
        margin-top: 10px;
    }

    .autoInput input:focus {
        opacity: 1; // height: 36px !important;
        box-shadow: 0 20px #fff, 0 -20px #fff, ;
    }

</style>
<style scoped lang="scss">
    .typeImg{
        li{
            // height: 40px;
            padding: 5px;
            font-size: 12px;
            margin-right: 15px;
            background: #93d3fc;
            color: #fff;
            cursor:pointer;
            img{
                width: 25px;
                height: 25px;
            }
            .text{
                line-height: 15px;
            }
        }
        li.selectdType{
            background: #46b7ff;
        }
    }
</style>
<script>
    var _self;
    var uLoading;
    import {
        uploadLoading
    } from '@/mixins/index';
    import config from '../config/config';
    // import {
    //     pagingEvent
    // } from '@/mixins/index';
    export default {
        mixins: [uploadLoading],
        data() {
            return {
                id: this.$route.query.id,
                isUpload: true,
                submit: false,
                d: {

                },
                users: [],
                typeList: [],
                querySearchUrl:'', // 支出用户姓名的接口
                querySearchData:[],
                queryData:JSON.parse(JSON.stringify(this.$route.query)), // 之前链接的参数
                query: {
                    engineer_id:this.$route.query.engineer_id,
                    money:'',
                    type: this.$route.query.type,
                    remark:'',
                    create_date: this.$.date_choose(1),//new Date()
                    pic: [],
                    expend_type:'', // 收支类型
                    expend_user_id:'',// 支出用户UID
                    q: '',
                    expend_uid: '',
                    expend_value: '',
                    expend_user_type:"0",// 支出用户类型 1员工，2供应商，3业务联系人
                    expend_user_name:''// 支出用户姓名

                },
                expend_typeData: [], // 当前渲染支出类型的数据
                rules: {
                    type: [{
                            required: true,
                            message: '请选择类型',
                            type: 'number',
                            trigger: 'blur,change'
                        },

                    ],
                    expend_type: [{
                            required: true,
                            message: '请选择类型',
                            type: 'number',
                            trigger: 'blur,change'
                        },

                    ],
                    create_date: [{
                            required: true,
                            message: '请选择时间',
                            trigger: 'blur,change'
                        },

                    ],
                    money: [{
                            required: true,
                            message: '请填写金额',
                            trigger: 'blur,change'
                        },

                    ],
                    q: [{
                        validator: (rule, value, callback) => {
                            if (!this.query.engineer_id) {
                                callback(new Error('请选择工地'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur,change',
                    }],
                    company_description: [{
                            required: true,
                            message: '公司介绍不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 1000,
                            message: '长度在1000个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_amount: [{
                            required: true,
                            message: '量房不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '长度在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_design: [{
                            required: true,
                            message: '设计不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '设计在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_material: [{
                            required: true,
                            message: '材料不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '材料在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_construct: [{
                            required: true,
                            message: '请填写施工不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '施工在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_inspected: [{
                            required: true,
                            message: '请输入验收不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '验收在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    company_service: [{
                            required: true,
                            message: '售后不能为空',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 255,
                            message: '售后在255个字符以内',
                            trigger: 'blur'
                        }
                    ],
                    img: [{
                        required: true,
                        message: '请上传图片',
                        trigger: 'blur,change'
                    }],
                },
                imgs: {
                    fileList: [],
                    only: {
                        url: '',
                        path: '',
                    },
                    dialogVisible: false,
                    dialogImageUrl: '',
                },
            };
        },
        created() {
            _self = this;
            // this.getData()
            _self.getDict();
            if (_self.id) {
                _self.getData();
            };
            if(_self.query.engineer_id){
                _self.getEngineer();
                _self.getUser()
            }
            // this.$set(this.queryData,'selectType',1);
        },
        watch: {
            'query.expend_type': function (n,o) {
                _self.getTypeData(n);
            },
            'query.expend_uid': function (n,o) {
                // console.log('变化了')
                // // _self.getUser();
            }
        },
        computed: {},
        methods: {
            changeExpendType() {
                this.query.expend_user_name = "";
            },
            // 点击选择类型
            clickTypeBtn(index, id){
                this.$set(this.query,'expend_type',id)
            },
            selectTag(n){
                this.$set(this.queryData,'selectType',n)
                this.$router.push({path:'/construction/capital_save', query:this.queryData})

            },
            // 获取下拉渲染了列表
            getTypeData(n) {
                _self.users.forEach((v,i)=>{
                    if (v.type == n) {
                        _self.$set(_self,'expend_typeData',v.list)
                    }
                })
            },
            getEngineer(){
                 this.$http.get(`common/engineer/info`, {
                        params: {
                            engineer_id: _self.query.engineer_id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                           _self.d = res.d;
                        }
                    });
            },
            getDict() {
                // this.$cache('config/type/list').then(res => {
                //     if (res.codeFlag) {
                //         _self.typeList = res.d.capital_expend_type_list;
                //     }
                // })
                this.$http.get('config/type/list',{
                    params: {
                        type: _self.$route.query.type
                    }
                })
                    .then(function (res) {
                        _self.typeList = res.d;
                    })
            },
            getUser() {
                if (_self.query.engineer_id) {
                    _self.$cache('engineer/capital/expend/user', {
                        params: {
                            engineer_id: _self.query.engineer_id
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            // _self.typeList = res.d.capital_expend_type_list;
                            _self.users = res.d;
                            if (_self.query.expend_type) {
                                _self.getTypeData(_self.query.expend_type);
                                if (_self.query.expend_uid) {
                                    _self.expend_typeData.forEach((v,i)=>{
                                        if (v.id == _self.query.expend_uid) {
                                            _self.$set(_self.query,"expend_value", v.name)
                                            _self.$set(_self.query,"expend_uid", v.id)
                                        }
                                    })
                                }
                            }

                        }
                    })
                }
            },
            querySearchAsync(queryString, cb) {
                this.$cache('engineer/list', {
                    params: {
                        name: queryString
                    }
                }).then(res => {
                    if (res) {
                        var d = res.data.data.list;
                        // console.log(d);
                        cb(d);
                    }
                })
            },
            handleSelect(item) {
                this.query.engineer_id = item.id;
                this.d = item;
                _self.getUser();
            },
            // 支出用户姓名
            querySearchName(queryString, cb){
                switch(this.query.expend_user_type) { // 1员工，2供应商，3业务联系人
                    case "1":
                        this.querySearchUrl = 'team/option/list';
                        break;
                    case "2":
                        this.querySearchUrl = 'supplier/list';
                        break;
                    case "3":
                        this.querySearchUrl = 'linkman/list';
                        break;
                }
                this.$http.get(this.querySearchUrl, {
                        params: {
                            page_size: 10000000
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.querySearchData = res.d.list;
                            var restaurants = _self.querySearchData;
                            var results = queryString ? restaurants.filter(_self.createFilterName(queryString)) : restaurants;
                            // 调用 callback 返回建议列表的数据
                            cb(results);
                        }
                    });

            },
            createFilterName(queryString) {
                return (restaurant) => {
                    return (this.query.expend_user_type == 1 ? restaurant.nickname.indexOf(queryString) === 0 : restaurant.name.indexOf(queryString) === 0);
                };
            },
            handleSelectName(item){
                this.query.expend_user_id = item.id;
            },
            // 选择支出类型的具体数据
            querySearchAsyncType(queryString, cb){
                var restaurants = this.expend_typeData;
                var results = queryString ? restaurants.filter(this.createStateFilterType(queryString)) : restaurants;
                console.log('results:',results)
                // clearTimeout(this.timeout);
                // this.timeout = setTimeout(() => {
                    cb(results);
                // }, 3000 * Math.random());
            },
            createStateFilterType(queryString) {
                return (state) => {
                    return (state.name.indexOf(queryString) === 0);
                };
            },
            handleSelectType(item){
                _self.$set(_self.query,"expend_value", item.name)
                _self.$set(_self.query,"expend_uid", item.id)
            },
            getData() {
                this.$http.get(`engineer/capital/get`, {
                        params: {
                            id: this.id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.query = res.d;
                            _self.query.expend_user_type = String(res.d.expend_user_type)
                            // res.query.expend_type = res.d.expend_id;
                            var arr = [];
                            _self.d = res.d.engineer_info;
                            // _self.query.expend_uid = _self.d.expend_uid
                            console.log('expend_uid',_self.query.expend_uid)
                            res.d.pic.forEach(o => {
                                arr.push({
                                    name: '',
                                    url: o.full_small_url,
                                    response: {
                                        data: [{
                                            preview: o.photo_url
                                        }]
                                    }
                                })
                            })
                            _self.imgs.fileList = arr;
                            _self.getUser();
                            console.log('_self.query', _self.query)
                        }
                    });
            },
            submitForm(formName) {
                console.log('提交的数据：', this.query)
                this.submit = true;
                var arr = [];
                this.imgs.fileList.forEach(o => {
                    arr.push(o.response.data[0].preview);
                })
                this.query.pic = arr;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$http.post(`engineer/capital/${_self.id?'update':'create'}`, this.query)
                            .then(function (res) {
                                if (res.codeFlag) {
                                    _self.$message({
                                        message: (_self.id?"修改":"创建")+'账单成功！',
                                        type: 'success'
                                    });
                                    if(!_self.id){
                                        _self.$back('capital_list')
                                    }
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
            },
            //  上传
            handleAvatarSuccess(res, file, fileList) {
                this.submit = false;
                // this.imageUrl = URL.createObjectURL(file.raw);
                this.imgs.fileList = fileList;
                if (fileList.length >= 9) {
                    this.isUpload = false
                }
                this.uploadCloseLoding();
            },
            handlePictureCardPreview2(file) {
                this.imgs.dialogImageUrl = file.url;
                this.imgs.dialogVisible = true;
            },
            exceed() {
                // this.$message({
                //     message: '上传不能大于9张',
                //     type: 'error'
                // });
            },
            // 删除图片
            handleRemove(file, fileList) {
                console.log('删除')
                this.imgs.fileList = fileList;
                if (fileList.length < 9) {
                    this.isUpload = true
                }
            }
        },
        components: {
            config
        }
    }

</script>
