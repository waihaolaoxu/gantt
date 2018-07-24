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
                            :action="$.upload" :show-file-list="false" name='file' multiple :data='$.uploadData' :on-success="handleAvatarSuccessCase"
                            :on-error='uploadCloseLoding' :file-list="imgs.fileList">
                            <el-button size="small" class="pr">
                                上传套餐图
                            </el-button>
                            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                        </el-upload>
                        <!-- <el-upload :action="$.upload" :show-file-list='false' multiple :limit="3" :on-success='upload' :accept='$.accept' :data='imgs.uploadData'
                        class="fl">
                        <el-button size="small" style='margin-right:-1px;border-radius:0;'>上传套餐图片</el-button>
                    </el-upload> -->
                        <!-- <el-button size="small">上传套餐图片</el-button> -->
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
                            :action="$.upload" :show-file-list="false" name='file' multiple :data='$.uploadData' :on-success="handleAvatarSuccessCase"
                            :on-error='uploadCloseLoding' :file-list="imgs.fileList">
                            <el-button size="small" class="pr">
                                上传套餐图
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
    import editTitle from './packageTitle';
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
                    msg: '请传入套餐ID',
                    cb: function () {
                        _self.$http.get('package/photo/list', {
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
                        _self.$http.post('package/photo/update', {
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
            handleAvatarSuccessCase(res, file, fileList) { //套餐图片
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
