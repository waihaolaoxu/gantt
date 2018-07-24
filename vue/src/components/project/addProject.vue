<template>
    <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
        <el-form-item label="关联线索：">
            <div class="f14 bg-greyBg flex-box middle" style='line-height:1.5em;padding:10px;border-radius:5px;' v-show='flag' @click="getBlurFn">
                <div class="flex1">
                    <div>{{d.landlord_name}}</div>
                    <div class="mt5 f12">
                        <i class="iconfont icon-date f12"></i> {{d.transform_info.deal_time}}
                        <span class="pd-r10"></span>
                        <i class="iconfont icon-price f12"></i> {{d.transform_info.deal_price}}元
                        <span class="pd-r10"></span>
                        <i class="iconfont icon-icon_status-three-dots f12"></i> {{d.transform_info.status}}
                    </div>
                </div>
                <!--<i class="el-icon-circle-close-outline"></i>
                <span>取消关联</span>-->
                <el-button icon="el-icon-circle-close-outline" round size="mini" @click="cancelRelevancyFn">取消</el-button>
            </div>

            <!--@blur="handleBlurClue"-->
            <el-autocomplete v-show="!flag" ref="clueInput" class="inline-input" v-model="query.clueName" :fetch-suggestions="querySearchAsyncClue"
                placeholder="请选择关联线索" style="width:100%" @blur="handleBlurClue" @select="handleSelectClue">
                <template slot-scope="props">
                    <div style="color: #999">{{props.item.landlord_name}}</div>
                    <div style="line-height: 20px; font-size:12px; color: #ddd;">
                        <span v-if="props.item.transform_info.deal_time">
                            <i class="iconfont icon-date"></i> {{props.item.transform_info.deal_time}}</span>
                        <span v-if="props.item.transform_info.deal_price">
                            <i class="iconfont icon-price"></i> {{props.item.transform_info.deal_price}}元</span>
                        <span v-if="props.item.transform_info.status">
                            <i class="iconfont icon-icon_status-three-dots"></i> {{props.item.transform_info.status}}</span>
                    </div>
                </template>
            </el-autocomplete>
        </el-form-item>
        <el-form-item label="工程标题：" prop="title">
            <el-input v-model="query.title" placeholder="请输入工程标题"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
            <el-col :span="5">
                <el-form-item>
                    <el-input v-model="query.landlord_name" placeholder="请输入姓名"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item style="margin-left: 15px;">
                    <el-select v-model="query.landlord_sex" placeholder="请选择性别">
                        <el-option key="0" label="男" value="0"></el-option>
                        <el-option key="1" label="女" value="1"></el-option>
                        <el-option key="2" label="保密" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="业主手机：">
            <el-input v-model="query.landlord_mobile" placeholder="请输入公司电话"></el-input>
        </el-form-item>
        <el-form-item label="纸质合同编号：">
            <el-input v-model="query.contract_number" placeholder="请输入纸质合同编号"></el-input>
        </el-form-item>
        <el-form-item label="用户UID：">
            <el-input v-model="query.landlord_uid" placeholder="请输入用户UID"></el-input>
        </el-form-item>
        <city-options label="省/市/区：" :province='query.province_id' :city='query.city_id' @syncProvince='provinceChange' @syncCity='cityChange'
            props="province_id,city_id"></city-options>
        <el-form-item label="楼盘名称：" prop="build_name">
            <el-autocomplete class="inline-input" v-model="query.build_name1" :fetch-suggestions="querySearchAsync1" placeholder="请输入楼盘名称"
                :trigger-on-focus="false" valueKey='name' @select="handleSelect1" style='width:100%;'></el-autocomplete>
        </el-form-item>
        <!-- <el-form-item label="楼盘名称：" prop="build_name1">
            <el-select v-model="query.build_name1" placeholder="请查询楼盘名称">
                <el-option v-for="(item,ind) in buildingData" :key="ind" :label="item.name_format" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="楼盘地址：" prop="build_address">
            <el-input v-model="query.build_address" placeholder="请输入楼盘地址"></el-input>
        </el-form-item>
        <el-form-item label="门牌号：">
            <el-input v-model="query.house_number" placeholder="请输入门牌号"></el-input>
        </el-form-item>
        <el-form-item label="装修面积：" prop="area">
            <el-input v-model="query.area" placeholder="请输入装修面积">
                <template slot="append">㎡</template>
            </el-input>
        </el-form-item>
        <el-form-item label="户型：">
            <el-row :gutter="0">
                <el-col :span="5">
                    <el-form-item>
                        <el-input-number v-model="query.room" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    <el-form-item>
                        室
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-input-number v-model="query.parlour" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="1" style="margin: 0 auto;">
                    <el-form-item>
                        厅
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-input-number v-model="query.toilet" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="1" style="margin: 0 auto;">
                    <el-form-item>
                        卫
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item>
                        <el-input-number v-model="query.kitchen" controls-position="right" @change="handleChange" :min="0" :max="10"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="1" style="margin: 0 auto;">
                    <el-form-item>
                        厨
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form-item>
        <el-form-item label="装修方式：" prop="decoration_mode">
            <el-select v-model="query.decoration_mode" placeholder="请选择装修方式">
                <el-option key="0" label="请选择装修方式" value=""></el-option>
                <el-option :key="key" :label="decorationItem" :value="key" v-for="(decorationItem,key) in decoration_mode_data"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="承保方式：">
            <el-select v-model="query.contrcact_mode" placeholder="请选择承保方式">
                <el-option key="0" label="请选择承保方式" value="0"></el-option>
                <el-option :key="key" :label="contrcactItem" :value="key" v-for="(contrcactItem,key) in contrcact_mode_data"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="工程期限：">
            <el-date-picker v-model="clueDate" @change='timeChange' type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>

            <!--<el-date-picker
                v-model="query.start_date"
                type="date"
                @change="changeStartDate"
                placeholder="选择日期">
            </el-date-picker>
             至
            <el-date-picker
                v-model="query.end_date"
                @change="changeEndDate"
                type="date"
                placeholder="选择日期">
            </el-date-picker>-->
            工期共
            <el-form-item style="display: inline-block;margin-right: 10px;">
                <el-input v-model="query.time_limit" placeholder="工期" style="width: 120px;" disabled=""></el-input>
            </el-form-item>
            天
        </el-form-item>
        <el-form-item label="工地报价：" prop="price">
            <el-input v-model="query.price" placeholder="请输入工程造价">
                <template slot="append">元</template>
            </el-input>
        </el-form-item>
        <el-form-item label="装修风格：">
            <el-select v-model="query.decoration_style" placeholder="请选择装修风格">
                <el-option key="0" label="请选择装修风格" value="0"></el-option>
                <el-option :key="key" :label="decorationStyleItem" :value="key" v-for="(decorationStyleItem,key) in decoration_style_data"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="前台显示：">
            <el-radio v-model="query.is_show" label="1">显示</el-radio>
            <el-radio v-model="query.is_show" label="2">隐藏</el-radio>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
            <el-input v-model.number="query.sort" :min="1" :max="10" :controls="false"></el-input>
        </el-form-item>
        <el-form-item label="封面图：" :prop="query.is_show==1?'cover':'imgurl'">
            <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                <img v-if="imageUrl" :src="imageUrl" class="avatar cover">
                <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
            </el-upload>
        </el-form-item>
        <!-- <el-form-item label="团队成员：" v-if="$route.query.id">
            <el-select v-model="optionsArray" multiple filterable remote reserve-keyword placeholder="请输入团队成员" :remote-method="remoteMethod"
                @change="peopleFn" :loading="loading" style='width:100%;'>
                <el-option v-for="item in optionsPeople" :key="item.id" :label="item.nickname" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="团队成员：" v-if="$route.query.id">
            <el-select v-model="nowUsers" multiple filterable default-first-option reserve-keyword placeholder="请选择团队成员" class="full-w"
                :disabled="query.engineer_add == 0">
                <el-option v-for="item in users" :key="item.id" :label="item.position ? item.nickname+'('+item.position+')' : item.nickname" :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <!--<el-form-item label="工长：">
            <el-autocomplete
                v-model="query.workman_name"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入工长名称"
                valueKey='name'
                @select="handleSelect"
            ></el-autocomplete>
        </el-form-item>-->

        <el-form-item>
            <el-button type="primary" @click="submitForm('query')">提交</el-button>
            <el-button @click="cancleFn('query')">取消</el-button>
        </el-form-item>
    </el-form>
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
<script>
    import cityOptions from '@/components/block/city';
    import {
        uploadLoading
    } from '@/mixins/index';
    var _self;
    export default {
        data() {
           var checkArea = (rule, value, callback) => {
               if(!this.query.area){
                    callback(new Error('请输入装修面积'))
                }else if(this.query.area<=0){
                    callback(new Error('请输入大于零的数字'))
                } else {
                callback();
                }
            }
            return {
                flag: false,
                clueDate: '',
                decoration_mode_data: null,
                contrcact_mode_data: null,
                decoration_style_data: null,
                workmanData: [],
                loading: false,
                workman_name: '',
                allow_build_name: true,
                imageUrl: '',
                optionsArray: [],
                optionsPeople: [],
                users: [],
                nowUsers: [],
                first: true,
                timeout:  null,
                buildingData:'',
                info:JSON.parse(this.$localStorage.get('userInfoM')).info,
                d: {
                    landlord_name: '',
                    transform_info: {

                    }
                },
                query: {
                    id: this.$route.query.id || '',
                    transform_id: '',
                    clueName: '',
                    title: '',
                    landlord_name: '',
                    landlord_mobile: '',
                    landlord_sex: '',
                    contract_number: "",
                    landlord_uid: "",
                    province_id: JSON.parse(this.$localStorage.get('userInfoM')).info.company_province_id,
                    city_id: JSON.parse(this.$localStorage.get('userInfoM')).info.company_city_id,
                    build_name: '',
                    build_id: "",
                    build_address: '',
                    house_number: '',
                    area: '',
                    room: '',
                    parlour: '',
                    toilet: '',
                    kitchen: '',
                    decoration_mode: '',
                    contrcact_mode: '',
                    start_date: '',
                    end_date: '',
                    time_limit: '',
                    price: '',
                    decoration_style: '',
                    is_show: '',
                    sort: '',
                    workman_id: '',
                    cover: '',
                    workman_name: '',
                    member_ids: [],
                    engineer_add: '1',
                    imageUrl: '',
                    build_name1:''
                },
                addUrl: 'engineer/create',
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                rules: {
                    title: [{
                        required: true,
                        message: '请输入工程标题',
                        trigger: 'blur'
                    }],
                    province_id: [{
                        required: true,
                        type: 'number',
                        message: '请选择省',
                        trigger: 'blur,change'
                    }],
                    city_id: [{
                        required: true,
                        type: 'number',
                        message: '请选择市',
                        trigger: 'blur,change'
                    }],
                    build_name: [{
                        required: true,
                        message: '请输入楼盘名称',
                        trigger: 'blur,change'
                    }],
                    build_address: [{
                        required: true,
                        message: '请输入楼盘地址',
                        trigger: 'blur,change'
                    }],
                    area: [{
                        required: true,
                        // message: '请输入装修面积',
                        trigger: 'blur,change',
                        validator: checkArea,
                    }],
                    decoration_mode: [{
                        required: true,
                        message: '请输入装修方式',
                        trigger: 'blur,change'
                    }],
                    price: [{
                        required: true,
                        message: '请输入工程造价',
                        trigger: 'blur,change'
                    }],
                    cover: [{
                        required: true,
                        message: '请输入封面图',
                        trigger: 'blur,change'
                    }],
                    imgurl: [{
                        required: false,
                        message: '请输入封面图',
                        trigger: 'blur,change'
                    }]
                }
            };
        },
        mixins: [uploadLoading],
        computed: {
            cityId() {
                return this.query.city_id
            }
        },
        watch: {
            // clueDate: function (newValue, oldValue) {
            //     if (newValue) {
            //         this.query.start_date = newValue[0]
            //         this.query.end_date = newValue[1]
            //         // this.changeEndDate()
            //     }
            // }
            'query.clueName' (v) {
                if(v==''){
                    this.query.transform_id = '';
                }
            },
            'query.is_show' (v) {
                if (v != 1) {
                    setTimeout(() => {
                        this.$refs.query.validateField('imgurl');
                    })
                }
            }
        },
        created() {
            _self = this;
            // window.c = _self;
            var that = this;
            if (this.$route.path == '/construction/edit_project_process') {
                return false;
            }
            this.$http.get('common/engineer/dict', {
                    params: {
                        name: 'style,decoration_mode,contrcact_mode'
                    }
                })
                .then(function (res) {
                    if (res.codeFlag) {
                        that.decoration_mode_data = res.data.data.decoration_mode;
                        that.contrcact_mode_data = res.data.data.contrcact_mode;
                        that.decoration_style_data = res.data.data.style;
                    }
                })
            if (this.$route.query.id) {
                // 编辑页面
                this.getInfo()
                _self.getUsers();

            }
            // _self.buildingSearch();
        },
        methods: {
            //查询楼盘列表
            // buildingSearch(){
            //     var a={}
            //     a.company_id=this.info.company_id
                
            //      if (this.$route.query.id) {
            //          a.engineer_id=this.$route.query.id
            //      }

            //     this.$cache('common/company/building/list', {
            //         params: a
            //     }).then(res => {
            //         if (res) {
            //             this.buildingData = res.data.data.list;
            //             console.log(this.buildingData)
            //         }
            //     })
            // },
            timeChange(v) {
                if(v[0]&&v[1]){
                    _self.query.start_date = v[0];
                    _self.query.end_date = v[1];
                    _self.query.time_limit = _self.$.getTimeLimit(v[0], v[1]);
                }
            },
            getUsers(obj) {
                _self.$http.get('team/option/list', {
                        params: {
                            type: 'team',
                            page:1,
                            page_size:0
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.
                            _self.users = res.d.list;
                        }
                    })
            },
            handleClose() {

            },
            getInfo() {
                var that = this;
                this.$http.get('engineer/info', {
                        params: {
                            id: this.$route.query.id
                        }
                    })
                    .then(function (res) {
                        if (!res.codeFlag) {
                            return false;
                        }
                        that.query.build_name1=res.data.data.build_name
                        for (let attr in that.query) {
                            for (let attr1 in res.data.data) {
                                if (attr == attr1) {
                                    that.query[attr] = res.data.data[attr1].toString();
                                }

                            }
                        }
                      
                        
                        console.log("编辑的数据：", that.query)
                        if (res.d.transform_id) {
                            that.flag = true;
                            that.query.clueName = res.d.transform_info.landlord_name;
                            that.query.transform_id = res.d.transform_id
                            
                            that.d.landlord_name = res.d.transform_info.landlord_name;
                            that.d.transform_info.deal_time = res.d.transform_info.deal_time;
                            that.d.transform_info.deal_price = res.d.transform_info.deal_price;
                            that.d.transform_info.status = res.d.transform_info.status;
                        }
                        setTimeout(function () {
                            that.query['province_id'] = Number(res.data.data['province_id']);
                            that.query['city_id'] = Number(res.data.data['city_id']);
                        }, 200)
                        if (that.query.start_date && that.query.end_date) {
                            that.clueDate = [that.query.start_date, that.query.end_date]
                        }
                        that.imageUrl = res.data.data.cover_small;
                        var arr = [];
                        res.d.members.forEach(function (v, i) {
                            that.optionsArray.push(v.nickname)
                            that.query.member_ids.push(v.id)
                            arr.push(v.id);
                        })
                        _self.nowUsers = arr;
                    })
            },
            //取消关联线索按钮
            cancelRelevancyFn(){
                this.query.transform_id = '';
                this.query.clueName = '';
            },
            getBlurFn() {
                this.flag = false;
                var that = this;
                setTimeout(() => {
                    that.$refs.clueInput.focus()
                }, 100)

            },
            provinceChange(v) {
                this.query.province_id = v;
            },
            cityChange(v) {
                console.log('城市函数变化')
                this.query.city_id = v;
            },
            changeStartDate() {
                // if(this.query.start_date && this.query.end_date) {
                //     this.query.time_limit = this.$.getTimeLimit(this.query.start_date, this.query.end_date)
                // }
            },
            changeEndDate() {
                // if(this.query.start_date && this.query.end_date) {
                //     this.query.time_limit = this.$.getTimeLimit(this.query.start_date, this.query.end_date)
                // }
            },
            // 团队成员下拉
            // querySearchAsync2(queryString, cb) {
            //     var that = this;
            //     // if (queryString) {
            //         this.$http.post('/engineer/member/search', {
            //             name :queryString
            //         }).then(res => {
            //             var d = res.data.data;
            //             cb(d);
            //         })
            //     // }

            // },
            // handleSelect2(item) {
            //     this.query.workman_id = item.id;
            //     this.query.name = item.name;
            // },
            peopleFn(val) {
                this.query.member_ids.push(val)
            },
            remoteMethod(query) {
                if (query !== '') {
                    var that = this;
                    setTimeout(() => {
                        that.$http.get('engineer/member/search', {
                                params: {
                                    name: query
                                }
                            })
                            .then(function (res) {
                                that.optionsPeople = res.data.data.filter(item => {
                                    return item.nickname.toLowerCase()
                                        .indexOf(query.toLowerCase()) > -1;
                                });
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }, 200);
                } else {
                    this.optionsPeople = [];
                }
            },

            // 工长下拉
            querySearchAsync(queryString, cb) {
                var that = this;
                // if (queryString) {
                this.$http.post('common/workman/options', {
                    name: queryString
                }).then(res => {
                    var d = res.data.data.list;
                    cb(d);
                })
                // }

            },
            handleSelect(item) {
                this.query.workman_id = item.id;
                this.query.workman_name = item.name;
            },
            handleBlurClue() {
                var that = this;
                if (this.query.clueName && that.d.landlord_name) {
                    setTimeout(function () {
                        that.flag = true;
                    }, 500)
                }
            },
            // 关联线索下拉
            querySearchAsyncClue(queryString, cb) {
                var that = this;
                // if (queryString) {
                this.$http.post('clue/option/list', {
                    name: queryString
                }).then(res => {
                    var restaurants = res.data.data.list;
                    var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                    // if(results.length){
                    //     results = [{}]
                    // }else{

                    // }
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        cb(results);
                    }, 500 * Math.random());

                    // var d = res.data.data.list;
                    // cb(d);
                })
                // }

            },
            createStateFilter(queryString) {
                return (state) => {
                return (state.landlord_name.indexOf(queryString) === 0);
                };
            },
            setClueData(item) {
                this.query.price = item.price;
                this.query.decoration_mode = String(item.decoration_mode);
                this.query.landlord_mobile = item.landlord_mobile;
                this.query.province_id = item.province_id;
                setTimeout(()=>{
                    this.query.city_id = item.city_id;
                },10)
                if (item.building_id) {
                    this.query.build_name1 = item.build_name;
                    this.query.build_address = item.build_address;
                } else {
                    // 选择了替换，但是列表数据没有building_id，应该清空楼盘名称和building_id
                    this.query.build_name1 = '';
                    this.query.build_address = '';
                    this.query.build_id = '';
                }
            },
            handleSelectClue(item) {
                var that = this;
                this.query.transform_id = item.transform_id;
                this.query.clueName = item.landlord_name;
                this.d = item;
                this.flag = true;
                if (this.$route.query.id) {
                    this.$confirm('是否替换原有信息?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        that.setClueData(item)

                    })
                } else {
                    this.setClueData(item)
                }


            },
            // 楼盘下拉
            querySearchAsync1(queryString, cb) {
                var that = this;
                if (queryString) {
                    if (this.query.province_id) {
                        this.$http.post('common/building/search', {
                            name: queryString,
                            province_id: that.query.province_id,
                            city_id: that.query.city_id
                        }).then(res => {
                            var d = res.data.data.list;
                            cb(d);
                        })
                    } else {
                        this.$message({
                            message: '请先选择城市',
                            type: 'warning'
                        });
                    }

                }

            },
            handleSelect1(item) {
                this.query.build_name1 = item.name;
                
                this.query.build_id = item.id;
                this.query.province_id = item.province
                this.query.city_id = item.city
                //                console.log(this.query.province_id,this.query.city_id)
            },
            submitForm(formName) {

                if (this.$route.query.id) {
                    this.addUrl = 'engineer/update'
                } else {
                    this.addUrl = 'engineer/create'
                }
                 _self.query.build_name= _self.query.build_name1
                 _self.query.build_name=_self.query.build_name.split('(')[0]
                // for(var i=0;i<this.buildingData.length;i++){
                //     if(this.buildingData[i].id==_self.query.build_name1){
                //          _self.query.build_name=this.buildingData[i].name
                //     }
                // }
                // _self.query.build_id=_self.query.build_name1


                var that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // that.query.member_ids = that.query.member_ids.join(',');
                        _self.query.member_ids = _self.nowUsers.join(',');
                        that.$http.post(that.addUrl, that.query)
                            .then(function (data) {
                                if (data.data.code == '1000') {
                                    that.$message({
                                        type: 'success',
                                        message: data.data.description
                                    });
                                    if (!that.query.id) {
                                        that.$back('list');
                                    }
                                }
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            cancleFn(formName) {
                this.$router.push({
                    path: 'list'
                })
            },
            //      上传
            handleAvatarSuccess(res, file) {
                this.query.cover = res.data[0].preview;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.uploadCloseLoding();
                if (this.query.is_show == 1) {
                    this.$refs.query.validateField('cover');
                }
            },
            handleChange(value) {
                console.log(value);
            }
        },
        components: {
            cityOptions
        }
    }

</script>
