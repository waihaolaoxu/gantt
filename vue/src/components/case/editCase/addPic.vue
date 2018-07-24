<template>
    <div>
        <edit-title></edit-title>
        <div class="wrapper bg-white b" style='background:#fff;'>
            <el-form :model="d" :rules="rules" ref="d" class="demo-ruleForm" style='max-width:none;'>
                <div class="over">
                    <el-button-group class="fl pr" style='z-index:2;'>
                        <el-button size="small" @click='selectAll' :disabled="layoutMini" v-if='allFlag'>全选</el-button>
                        <el-button size="small" @click='noSelectAll' :disabled="layoutMini" v-if='!allFlag'>全不选</el-button>
                        <el-button size="small" @click='delSelect' :disabled="layoutMini">删除</el-button>
                        <el-upload class="upload-demo fl pr" style='z-index:-1;margin-left:-1px;' :before-upload="beforeAvatarUploadLoding" :accept='$.accept'
                            :action="$.upload" :show-file-list="false" name='file' multiple :data='uploadData' :on-success="handleAvatarSuccessCase"
                            :on-error='uploadCloseLoding' :file-list="imgs.fileList">
                            <el-button size="small" class="pr">
                                上传案例图
                            </el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>
                        <!-- <el-upload :action="$.upload" :show-file-list='false' multiple :limit="3" :on-success='upload' :accept='$.accept' :data='imgs.uploadData'
                        class="fl">
                        <el-button size="small" style='margin-right:-1px;border-radius:0;'>上传案例图片</el-button>
                    </el-upload> -->
                        <!-- <el-button size="small">上传案例图片</el-button> -->
                        <el-button size="small" @click='submitFormFns("d")'>保存</el-button>

                    </el-button-group>
                    <el-button-group class="fr">
                        <el-button size="mini" icon='el-icon-picture' @click="layoutMini=false"></el-button>
                        <el-button size="mini" icon='el-icon-menu' @click="layoutMini=true"></el-button>
                    </el-button-group>
                </div>
                <empty :empty='!loading&&!d.list.length' :loading='loading'></empty>
                <div class="imgsList mt20">
                    <el-row :gutter="10">
                        <draggable v-model="d.list" :options="dragOptions">
                            <!-- <transition-group type="transition" :name="'flip-list'"> -->
                            <el-col class="ms_full_w caseitem" :class="{'el-small':layoutMini}" v-for='(x,index) in d.list' style='margin-bottom:10px;overflow:hidden;position:relative;width:300px;' :key='x.thumb' v-if="!x.delflag">
                                <el-card :body-style="{ padding: '0px' }" :class="{active:selectList[index]}">
                                    <div style="padding:10px;" class="flex-box flex-between" v-show="!layoutMini">
                                        <!-- <el-checkbox name="type" v-model='x.delflag' class="label-hide">删除</el-checkbox> -->
                                        <el-checkbox name="type" v-model="selectList[index]"></el-checkbox>
                                        <a :href="x.imgurl" target="_blank" class="a-hover f14">
                                            <i class="el-icon-download"></i>原图</a>
                                        <el-radio :label="1" name='is_cover' v-model='x.is_cover' @change='coverChange(index)'>设为封面</el-radio>
                                    </div>
                                    <div class="cover-body handle" style='cursor:move;padding-bottom:75%;'>
                                        <!-- <img :src="x.thumb" alt="" class="cover"> -->
                                        <img v-lazy='x.thumb' alt="" class="cover">
                                    </div>
                                    <div style="padding: 10px;overflow:hidden;" v-show="!layoutMini">
                                        <el-form-item :prop="'list.' + index + '.des'" :rules="{required: true, message: '描述不能为空', trigger: 'blur,change'}">
                                            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="x.des" class="no">
                                            </el-input>
                                        </el-form-item>
                                        <div style="overflow:hidden;width:100%;height: 185px;" class="dragBug text-right">
                                            <el-form-item label="空间类型" :prop="'list.' + index + '.photo_space_id'" :rules="{required: true, message: '空间类型不能为空', type:'number', trigger: 'blur,change'}"
                                                size="mini">
                                                <el-select v-model="x.photo_space_id" placeholder="请选择" style="width:52%;">
                                                    <el-option v-for="(item,k) in options.space" :key="k" :label="item" :value="Number(k)">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="颜色类型" :prop="'list.' + index + '.photo_color_id'" :rules="{required: true, message: '颜色类型不能为空', type:'number', trigger: 'blur,change'}"
                                                size="mini">
                                                <el-select v-model="x.photo_color_id" placeholder="请选择" style="width:52%;">
                                                    <el-option v-for="(item,k) in options.color" :key="k" :label="item" :value="Number(k)">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="风格类型" :prop="'list.' + index + '.photo_style_id'" :rules="{required: true, message: '风格类型不能为空', type:'number', trigger: 'blur,change'}"
                                                size="mini">
                                                <el-select v-model="x.photo_style_id" placeholder="请选择" style="width:52%;">
                                                    <el-option v-for="(item,k) in options.style" :key="k" :label="item" :value="Number(k)">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                            <el-form-item label="局部类型" :prop="'list.' + index + '.photo_house_section_id'" :rules="{required: true, message: '局部类型不能为空', type:'number', trigger: 'blur,change'}"
                                                size="mini">
                                                <el-select v-model="x.photo_house_section_id" placeholder="请选择" style="width:52%;">
                                                    <el-option v-for="(item,k) in options.section" :key="k" :label="item" :value="Number(k)">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <!-- <div class="bottom clearfix text-right">
                                                <el-button type="text" class="button" @click='uploadRemove(x,index)'>删除</el-button>
                                            </div> -->
                                    </div>
                                </el-card>
                            </el-col>
                            <!-- </transition-group> -->
                        </draggable>
                    </el-row>
                </div>
                <div class="over">
                    <el-button-group class="fl pr" style='z-index:2;'>
                        <el-button size="small" @click='selectAll' :disabled="layoutMini" v-if='allFlag'>全选</el-button>
                        <el-button size="small" @click='noSelectAll' :disabled="layoutMini" v-if='!allFlag'>全不选</el-button>
                        <el-button size="small" @click='delSelect' :disabled="layoutMini">删除</el-button>
                        <el-upload class="upload-demo fl pr" style='z-index:-1;margin-left:-1px;' :before-upload="beforeAvatarUploadLoding" :accept='$.accept'
                            :action="$.upload" :show-file-list="false" name='file' multiple :data='uploadData' :on-success="handleAvatarSuccessCase"
                            :on-error='uploadCloseLoding' :file-list="imgs.fileList">
                            <el-button size="small" class="pr">
                                上传案例图
                            </el-button>
                        </el-upload>
                        <el-button size="small" @click='submitFormFns("d")'>保存</el-button>
                    </el-button-group>
                </div>
            </el-form>

        </div>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'
    import editTitle from './editTitle';
    import {
        uploadLoading
    } from '@/mixins/index';
    var _self;
    export default {
        mixins: [uploadLoading],
        data() {
            return {
                allFlag: true,
                layoutMini: false,
                selectList: [],
                loading: true,
                id: this.$route.query.id,
                d: {
                    list: []
                },
                value: '',
                options: {},
                imgs: {
                    fileList: [],

                },
                uploadData: {
                    module: 'photo',
                    type: 'image'
                },
                rules: {
                    des: [{
                        required: true,
                        message: '请填写描述',
                        trigger: 'blur,change'
                    }],
                }
            }
        },
        computed: {
            dragOptions() {
                return {
                    animation: 0,
                    ghostClass: 'ghost',
                    filter: '.no',
                    handle: '.handle',
                    preventOnFilter: false,
                    // draggable:'.item'
                };
            }
        },
        watch: {
            // 'd': {
            //     handler: () => {
            //         var n=0;
            //         _self.d.list.forEach((e, index) => {
            //             if(e.delflag){
            //                 n++;
            //             }
            //         });
            //         // console.log(n);
            //         _self.allFlag = _self.selectList.length>n;
            //     },
            //     deep: true
            // }
        },
        created() {
            _self = this;
            _self.getDeital();
            _self.getOptions();

        },
        methods: {
            selectAll() {
                var arr = [];
                _self.d.list.forEach((e, index) => {
                    arr.push(true)
                });
                _self.selectList = arr;
                _self.allFlag = false;
            },
            noSelectAll() {
                var arr = [];
                _self.d.list.forEach((e, index) => {
                    arr.push(false)
                });
                _self.selectList = arr;
                _self.allFlag = true;
            },
            delSelect(){
                _self.selectList.forEach((e,index) => {
                    if(e){
                        var data = _self.d.list[index];
                        if(data.is_cover){
                            _self.$message({
                                message: '封面图不能删除！',
                                type: 'warning'
                            });
                            return;
                        }
                        data.delflag = 1;
                        _self.$set(_self.d.list, index, data);
                    }
                });
            },
            coverChange(k) {
                _self.d.list.forEach((e, index) => {
                    if (index != k) {
                        e.is_cover = '';
                    }
                });
            },
            getDeital() {
                _self.$id({
                    msg: '请传入案例ID',
                    cb: function () {
                        _self.$http.get('case/photo/list', {
                            params: {
                                id: _self.id
                            }
                        }).then(res => {
                            _self.loading = false;
                            if (res.codeFlag) {
                                var d = res.data.data;
                                d.list.forEach(function (e, index) {
                                    e.delflag = 0;
                                });
                                console.log(d);
                                _self.d = d;
                            }
                        })
                    }
                });
            },
            getOptions() {
                _self.$cache('case/dict', {
                    params: {
                        name: 'space,price,type,style,color,section'
                    }
                }).then(res => {
                    if (res) {
                        var d = res.data.data;
                        _self.options = d;
                    }
                })
            },
            submitFormFns(formName) {
                var flag = false;
                this.d.list.forEach(function (value, index) {
                    console.log(22, value)
                    if (value.is_cover == 1) {
                        flag = true;
                    }
                });
                if (!flag) {
                    _self.$message({
                        message: '必须勾选一个封面图！',
                        type: 'warning'
                    });
                    return false;
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.post('case/photo/update', {
                            id: _self.id,
                            info: _self.d.list
                        }).then(res => {
                            if (res.codeFlag) {
                                _self.$message({
                                    type: 'success',
                                    message: res.data.description
                                });
                                // _self.$back('list');
                               _self.$.reload();
                            }
                        });
                    } else {
                        _self.$message({
                            message: '表单填写不完整',
                            type: 'warning'
                        });
                        return false;
                    }
                })
            },
            handleAvatarSuccessCase(res, file, fileList) { //案例图片
                if (res.code != '1000') {
                    //如果上传失败，提示
                    _self.$message({
                        type: 'error',
                        message: res.description
                    });
                    _self.uploadCloseLoding();
                    return false
                }
                var d = res.data[0]
                if (d) {
                    _self.d.list.push({
                        imgurl: d.preview + '!' + d.secret,
                        // imgurl: d.preview,
                        secret: d.secret,
                        thumb: d.preview + '!zmm',
                        is_cover: 0,
                        imgfile: d.file,
                        secret: d.secret,
                        server_index: d.server_index,
                        server_url: d.server_url,
                        width:d.width,
                        height:d.height
                    });
                }

                this.uploadCloseLoding();
            },
        },
        components: {
            draggable,
            editTitle
        }
    }

</script>
