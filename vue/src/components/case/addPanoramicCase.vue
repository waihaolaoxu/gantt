<template>
    <div>
      <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <a class="el-tabs__item fl is-active">{{id?'编辑全景案例':'添加全景案例'}}</a>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b" style='background:#fff;'>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="全景案例名称：" prop="title">
                    <el-input v-model="ruleForm.title" placeholder="请输入全景案例名称"></el-input>
                </el-form-item>
                <el-form-item label="全景案例链接：" prop="url">
                    <el-input v-model="ruleForm.url" placeholder="请输入全景案例链接"></el-input>
                </el-form-item>
                <city-options label="选择城市：" :province='ruleForm.province_id' :city='ruleForm.city_id' @syncProvince='provinceChange' @syncCity='cityChange'
                    props='province_id,city_id'></city-options>
                <el-form-item label="查询楼盘：" prop="q">
                    <el-autocomplete v-model="ruleForm.q"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="请输入查询楼盘"
                            @select="handleSelect"
                            :trigger-on-focus="false"
                            valueKey='name'
                            style='width:100%;'>
                    </el-autocomplete>
                    <input type="hidden" v-model='ruleForm.loupan_id'>
                    <!-- <span class="addLink pd-l20" style="cursor:pointer;color:#3C8DBF" @click="addLink()">添加楼盘</span> -->
                </el-form-item>
                <!-- <el-form-item label="查询楼盘：" prop="q">
                    <el-select v-model="ruleForm.q" placeholder="请查询楼盘">
                        <el-option v-for="(item,ind) in buildingData" :key="ind" :label="item.name_format" :value="item.id">
                        </el-option>
                    </el-select><span class="addLink pd-l20" style="cursor:pointer;color:#3C8DBF" @click="addLink()">添加楼盘</span>
                </el-form-item> -->
                <el-form-item label="查询设计师：" prop='designer_name'>
                    <el-autocomplete v-model="ruleForm.designer_name" :fetch-suggestions="querySearchAsync1" placeholder="查询设计师" @select="handleSelect1"
                        valueKey='name' style='width:100%;'>
                    </el-autocomplete>
                </el-form-item>

                <el-form-item label="面积：" prop="area">
                    <el-input placeholder="请输入面积" v-model.number="ruleForm.area">
                        <template slot="append">㎡</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="面积区间：" prop="area_id">
                    <el-select v-model="ruleForm.area_id" placeholder="请选择案例面积区间">
                        <el-option v-for="(item,k) in options.area" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择户型：" prop="house_type_id">
                    <el-select v-model="ruleForm.house_type_id" placeholder="请选择户型">
                        <el-option v-for="(item,k) in options.type" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择风格：" prop="style_id">
                    <el-select v-model="ruleForm.style_id" placeholder="请选择风格">
                        <el-option v-for="(item,k) in options.style" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择造价区间：" prop="price_id">
                    <el-select v-model.number="ruleForm.price_id" placeholder="请选择造价区间">
                        <el-option v-for="(item,k) in options.price" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="ruleForm.is_show" placeholder="状态" style="width:100px;">
                        <el-option v-for="(item,k) in [[1,'显示'],[0,'隐藏']]" :key="k" :label="item[1]" :value="item[0]"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序值：">
                    <el-input type='number' v-model.number="ruleForm.sort" min='0' placeholder="请输入排序值"></el-input>
                </el-form-item>
                <el-form-item label="封面图：" prop="cover">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess2" name='file' :accept='$.accept' :before-upload="beforeAvatarUploadLoding1" :data='uploadData'>
                        <img v-if="ruleForm.cover" :src="ruleForm.cover+'!mm'" class="avatar cover">
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                    <div style="color:#777;">建议尺寸800PX*600PX</div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import cityOptions from '@/components/block/city';
    import editTitle from './editCase/editTitle';
    var _self,uLoading;
    let designerid = '';
    export default {
        data() {
            return {
                id: this.$route.query.id,
                info:JSON.parse(this.$localStorage.get('userInfoM')).info,
                a: {},
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                ruleForm: {
                    province_id:JSON.parse(this.$localStorage.get('userInfoM')).info.company_province_id,
                    city_id: JSON.parse(this.$localStorage.get('userInfoM')).info.company_city_id,
                    q:'',
                    cover:'',
                    is_show:1,
                    url:'',
                    title:'',
                    designer_id:'',
                    price_id:''
                },
                rules: {
                    title: [{
                        required: true,
                        message: '请输入全景案例名称',
                        trigger: 'blur,change'
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
                    url: [{
                        required: true,
                        message: '请输入全景案例链接',
                        trigger: 'blur,change'
                    }],
                    main_sort: [{
                        validator: this.$.v.positive,
                        trigger: 'blur,change',
                        message: '排序是不能小于0的数字',
                    }],
                    designer_name: [{
                        required: true,
                        message: '请选择设计师',
                        trigger: 'blur,change'
                    }, {
                        validator: function (rule, value, callback) {
                            if (!designerid) {
                                callback(new Error('请选择正确的设计师'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur,change',
                    }],
                    house_type_id: [{
                        required: true,
                        message: '请选择户型',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    style_id: [{
                        required: true,
                        message: '请选择风格',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    price_id: [{
                        required: true,
                        message: '请选择造价区间',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    area: [{
                        required: true,
                        message: '请输入全景案例面积',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    area_id: [{
                        required: true,
                        message: '请输入全景案例面积区间',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    cover: [{
                        required: true,
                        message: '请上传封面图',
                        trigger: 'blur,change'
                    }]
                },
                options: {},
                buildingData:''
            }
        },
        created() {
            _self = this;
            _self.getOptions();
            _self.getDetail();
            
            // _self.buildingSearch()
        },
        methods: {
            provinceChange(v) {
                this.ruleForm.province_id = v;
                setTimeout(() => {
                    this.$refs.ruleForm.validateField('city');
                })
            },
            cityChange(v) {
                this.ruleForm.city_id = v;
            },
            querySearchAsync(queryString, cb) {
                if (queryString) {
                    if (this.ruleForm.province_id) {
                        this.$cache('common/building/search', {
                            params: {
                                name: queryString,
                                province_id: this.ruleForm.province_id,
                                city_id: this.ruleForm.city_id
                            }
                        }).then(res => {
                            if (res) {
                                var d = res.data.data.list;
                                // console.log(d);
                                cb(d);
                            }
                        })
                    } else {
                        this.$message({
                            message: '请先选择城市',
                            type: 'warning'
                        });
                    }
                }
            },
            handleSelect(item) {
                this.ruleForm.building_id = item.id;
            },
          handleAvatarSuccess2(res, file) {
              this.ruleForm.cover = res.data[0].preview;
                // this.imageUrl = URL.createObjectURL(file.raw);
                uLoading.close()
            },
          beforeAvatarUploadLoding1(file) {
                var imgType = true;
                const isJPG = file.name.split('.')[1] === 'jpeg';
                const isJPEG = file.name.split('.')[1] === 'jpg';
                const isPNG = file.name.split('.')[1] === 'png';
                const isGIF = file.name.split('.')[1] === 'gif';
                const isIco = file.name.split('.')[1] === 'ico';
                // const isLt2M = file.size / 1024 / 200 <= 1;
                // console.log(isJPG,isJPEG,isPNG,isGIF)

                if (isJPG || isJPEG || isPNG || isGIF || isIco) {} else {
                    imgType = false;
                    this.$message.error('上传图片只能是 JPG,JPEG,PNG,GIF,ico 格式!');
                    return imgType;
                }
                if (imgType) {
                    uLoading = this.$loading({
                        background: 'rgba(255,255,255,.2)',
                        text: '拼命上传中...'
                    });
                }
                return imgType;
            },
            //跳转添加楼盘
            // addLink(){
            //     this.$router.push({path:'/case/building/add',query:{prevPath:this.$route.query.prevPath}})
            // },
            getDetail() { //获取详情信息
                if (this.id) {
                    this.$http.get('panorama/get', { 
                        params: {
                            id: this.id
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            var d = res.data.data;
                            if(!d.province_id){
                                d.province_id=''
                                d.city_id=''
                            }
                            d.q=d.building.name
                            d.designer_name=d.designer.name
                            d.dName=d.designer.name
                            d.dId=d.designer.id
                            designerid=d.designer.id
                            //转换需要的数据
                            d.subject = d.title;
                            this.ruleForm = d;
                            this.a = d;
                        }

                    })
                }

            },
            getOptions() {
                this.$cache('case/dict', {
                    params: {
                        name: 'space,price,area,type,style'
                    }
                }).then(res => {
                    if (res) {
                        var d = res.data.data;
                        this.options = d;
                    }
                })
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            submitForm(formName) {
                // _self.ruleForm.loupan_id=_self.buildingData
                // _self.ruleForm.building_id=_self.ruleForm.q
                console.log(designerid)
                console.log(_self.ruleForm.designer_id)
                if(_self.ruleForm.designer_name.indexOf(_self.ruleForm.dName)==-1 && designerid==_self.ruleForm.dId){
                    designerid=''
                }
                _self.$refs[formName].validate((valid) => {
                    if (valid) {
                      
                            var msg = '创建成功';
                        if (this.$route.query.id) {
                            _self.ruleForm.id=_self.id
                            var msg = '修改成功'
                        }
                        _self.$http.post('panorama/create', _self.ruleForm).then(res => {
                            if (res.codeFlag) {
                                _self.$message({
                                    type: 'success',
                                    message: msg
                                });
                                if (!this.$route.query.id) {
                                    this.$router.push({path:'/case/panorama/list'})
                                    // var q = _self.$.extend({
                                    //     id:res.data.data
                                    // },_self.$route.query)
                                    // _self.$router.replace({
                                    //     query: q
                                    // })
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
            //查询楼盘列表
            // buildingSearch(){
            //     const _self=this
            //     const a={}
            //     a.company_id=this.info.company_id
            //      if (this.$route.query.id) {
            //          a.panorama_subject_id=this.$route.query.id
            //     }
            //     this.$cache('common/company/building/list', {
            //         params: a
            //     }).then(res => {
            //         if (res) {
            //             _self.buildingData = res.data.data.list;
            //         }
            //     })
            // },
            querySearchAsync1(queryString, cb) {
                        this.$cache('common/designer/options', {
                            params: {
                                name: queryString,
                                // city: this.ruleForm.city
                            }
                        }).then(res => {
                            if (res) {
                                var d = res.data.data;
                                cb(d);
                            }
                        })
            },
            handleSelect1(item) {
                this.ruleForm.designer_id =designerid=item.id;
                // this.ruleForm.designer.name=item.name
            },
        },
        components: {
            cityOptions,
            editTitle
        }
    }

</script>