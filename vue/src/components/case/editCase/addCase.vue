<template>
    <div>
        <edit-title></edit-title>
        <div class="wrapper bg-white b" style='background:#fff;'>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="案例名称：" prop="subject">
                    <el-input v-model="ruleForm.subject" placeholder="请输入案例名称"></el-input>
                </el-form-item>
                <city-options label="选择城市：" :province='ruleForm.province' :city='ruleForm.city' @syncProvince='provinceChange' @syncCity='cityChange'
                    props='province,city'></city-options>
                <!-- <el-form-item label="案例排序：" prop="main_sort">
                            <el-input v-model.number="ruleForm.main_sort" placeholder="请输入案例排序"></el-input>
                        </el-form-item> -->
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
                    </el-select>
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
                <el-form-item label="案例面积区间：" prop="area_id">
                    <el-select v-model="ruleForm.area_id" placeholder="请选择案例面积区间">
                        <el-option v-for="(item,k) in options.area" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择户型：" prop="housetype">
                    <el-select v-model="ruleForm.housetype" placeholder="请选择户型">
                        <el-option v-for="(item,k) in options.type" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择风格：" prop="style">
                    <el-select v-model="ruleForm.style" placeholder="请选择风格">
                        <el-option v-for="(item,k) in options.style" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总造价：" prop="cost">
                    <el-input v-model.number="ruleForm.cost" placeholder="请输入总造价">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="选择造价区间：" prop="price_id">
                    <el-select v-model.number="ruleForm.price_id" placeholder="请选择造价区间">
                        <el-option v-for="(item,k) in options.price" :key="k" :label="item" :value="Number(k)">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="独立站状态：" prop="company_isshow" v-if="info.has_site==1">
                    <el-radio-group v-model="ruleForm.company_isshow">
                      <el-radio :label="1">显示</el-radio>
                      <el-radio :label="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="案例说明：" prop="description">
                    <el-input type="textarea" v-model="ruleForm.description" :rows="6" placeholder="公司介绍限制在1000个字符以内"></el-input>
                </el-form-item>
                <el-form-item label="排序值：">
                    <el-input type='number' v-model.number="ruleForm.sort" min='0' placeholder="请输入排序值"></el-input>
                </el-form-item>
                <!--多张图片-->
                <!-- <el-form-item label="户型图：">
                    <el-upload :action="$.upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" multiple
                        name='file' :data='imgs.uploadData' :file-list="imgs.fileList" :accept='$.accept'>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="imgs.dialogVisible" size="tiny">
                        <img width="100%" :src="imgs.dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item> -->

                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import cityOptions from '@/components/block/city';
    import editTitle from './editTitle';
    var _self;
    let designerid = '';
    export default {
        data() {
            return {
                loupanflag:false,
                id: this.$route.query.id,
                info:JSON.parse(this.$localStorage.get('userInfoM')).info,
                a: {},
                ruleForm: {
                    province:JSON.parse(this.$localStorage.get('userInfoM')).info.company_province_id,
                    city: JSON.parse(this.$localStorage.get('userInfoM')).info.company_city_id,
                    q:''
                },
                rules: {
                    subject: [{
                        required: true,
                        message: '请输入案例名称',
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
                    province: [{
                        required: true,
                        message: '请选择省',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    city: [{
                        required: true,
                        message: '请选择市',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    area: [{
                        required: true,
                        message: '请输入案例面积',
                        trigger: 'blur,change',
                        type: 'number'
                    }],
                    area_id: [{
                        required: true,
                        message: '请输入案例面积区间',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    housetype: [{
                        required: true,
                        message: '请选择户型',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    style: [{
                        required: true,
                        message: '请选择风格',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    cost: [{
                        required: true,
                        message: '请输入总造价',
                        trigger: 'blur,change',
                        type: 'number'
                    }],
                    price_id: [{
                        required: true,
                        message: '请选择造价区间',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    company_isshow: [{
                        required: true,
                        message: '请选择是否显示',
                        type:'number',
                        trigger: 'change'
                    }],
                    description: [{
                        required: true,
                        message: '请输入案例说明',
                        trigger: 'blur,change'
                    }]
                },
                options: {},
                buildingData:''
                // imgs: {
                //     fileList: [{
                //         name: 'food.jpeg',
                //         url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                //     }, {
                //         name: 'food2.jpeg',
                //         url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                //     }],
                //     dialogVisible: false,
                //     dialogImageUrl: '',
                //     uploadData: {
                //         module: 'store',
                //         type: 'image'
                //     },
                // }
            }
        },
        created() {
            _self = this;
            _self.getOptions();
            _self.getDetail();
            // _self.buildingSearch()
        },
        methods: {
            //跳转添加楼盘
            // addLink(){
            //     this.$router.push({path:'/case/building/add',query:{prevPath:this.$route.query.prevPath}})
            // },
            provinceChange(v) {
                this.ruleForm.province = v;
                setTimeout(() => {
                    this.$refs.ruleForm.validateField('city');
                })
            },
            cityChange(v) {
                this.ruleForm.city = v;
            },
            getDetail() { //获取详情信息
                if (this.id) {
                    this.$http.get('case/get', { 
                        params: {
                            id: this.id
                        }
                    }).then(res => {
                        if (res.codeFlag) {
                            var d = res.data.data;
                            
                            //转换需要的数据
                            d.designer_name = d.designer.name;
                            d.designerid = designerid = d.designer.id;
                            d.dName=d.designer.name;
                            d.dId=d.designer.id;
                            d.q=d.building.name;
                            d.loupanName=d.building.name
                            d.loupan_id=d.building.id
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
                
                // console.log(_self.ruleForm.loupan_id)
                // console.log(JSON.stringify(this.ruleForm));
                if(_self.ruleForm.designer_name.indexOf(_self.ruleForm.dName)==-1 && designerid==_self.ruleForm.dId){
                    designerid=""
                }
                _self.$refs[formName].validate((valid) => {
                    if (valid) {
                        var url = 'case/create',
                            msg = '创建成功';
                        if (this.$route.query.id) {
                            url = 'case/update';
                            msg = '修改成功'
                        }
                        _self.$http.post(url, _self.ruleForm).then(res => {
                           
                           
                            if (res.codeFlag) {
                                _self.$message({
                                    type: 'success',
                                    message: msg
                                });
                                if (!this.$route.query.id) {
                                    var q = _self.$.extend({
                                        id:res.data.data
                                    },_self.$route.query)
                                    _self.$router.replace({
                                        query: q
                                    })
                                } else {
                                    // _self.$back('list');
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
            querySearchAsync(queryString, cb) {
                if (queryString) {
                    if (this.ruleForm.province) {
                        this.$cache('common/building/search', {
                            params: {
                                name: queryString,
                                province_id: this.ruleForm.province,
                                city_id: this.ruleForm.city
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
            //查询楼盘列表
            // buildingSearch(){
            //     const _self=this
                
            //     var a={}
            //     a.company_id=this.info.company_id
            //     if (this.$route.query.id) {
            //         a.subject_id= _self.id
            //     }
            //     this.$cache('common/company/building/list', {
            //         params: a
            //     }).then(res => {
            //         if (res) {
            //             _self.buildingData = res.data.data.list;
            //         }
            //     })
            // },
            handleSelect(item) {
                this.ruleForm.loupan_id = item.id;
            },
            querySearchAsync1(queryString, cb) {
                console.log('11111',queryString)
                // if (queryString) {
                    // if (this.ruleForm.city) {
                        this.$cache('common/designer/options', {
                            params: {
                                name: queryString
                                // city: this.ruleForm.city
                            }
                        }).then(res => {
                            if (res) {
                                var d = res.data.data;
                                console.log(d);
                                cb(d);
                            }
                        })
                    // } else {
                    //     this.$message({
                    //         message: '请先选择城市',
                    //         type: 'warning'
                    //     });
                    // }
                // }
            },
            handleSelect1(item) {
                this.ruleForm.designerid = designerid = item.id;
            },
            //      上传
            // handlePictureCardPreview(file) {
            //     this.imgs.dialogImageUrl = file.url;
            //     this.imgs.dialogVisible = true;
            // },
            // handleRemove(file, fileList) {
            //     console.log(file, fileList);

            // }
        },
        components: {
            cityOptions,
            editTitle
        }
    }

</script>