<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">{{t}}专题</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="名称：" prop="name" label-width="100px">
                    <el-input v-model="query.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="封面：" label-width="100px" prop="cover">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                        :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar cover">
                        <span v-if="imageUrl" class="el-prompting">点击更换</span>
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="摘要：" prop="summary" label-width="100px" >
                    <el-input type='textarea' v-model="query.summary" placeholder="请输入专题摘要" :rows="6"></el-input>
                </el-form-item>
                <!-- <el-form-item label="内容：" prop="content" label-width="100px">
                    <ueditor ref="ueditor" :start-value="startContent" :value='query.content' @input='input'></ueditor>
                </el-form-item> -->
                <el-form-item label="内容：" prop="content" label-width="100px">
                    <el-input type="textarea" v-model="query.content" :rows="20"  placeholder="内容："></el-input>
                </el-form-item>
                <el-form-item label="恢复内容：" label-width="100px" v-if="$route.query.id">
                    <el-select placeholder="请选择恢复版本" v-model="snapshot" style="width: 280px;">
                        <el-option v-for="item in query.snapshot_list" :key="item.special_data" :label="item.add_date +'-'+item.add_user" :value="item.special_data">
                        </el-option>
                    </el-select>
                    <el-button type="info" @click="resetSnapshot">恢复内容</el-button>
                </el-form-item>
                <el-form-item label="排序值：" prop='sort' label-width="100px">
                    <el-input type='number' v-model.number="query.sort" min='0' placeholder="请输入排序值"></el-input>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_show" label-width="100px">
                    <el-radio v-model="query.is_show" :label="1">是</el-radio>
                    <el-radio v-model="query.is_show" :label="0">否</el-radio>
                </el-form-item>
                <el-form-item label="终端类型：" prop="terminal" label-width="100px">
                    <el-select v-model="query.terminal" placeholder="请选择终端类型">
                        <el-option v-for="item in typeData" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="100px">
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>
                <div style="width:820px;margin-top: 45px;" v-if="$route.query.id">
                    <SpliceImagePrefix :imagesLists1="imagesLists"  :tag="tag" :contents="query.content" @getConents='getConentsFn'></SpliceImagePrefix>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        uploadLoading
    } from '@/mixins/index';
    import Ueditor from "../block/ueditor.vue";
    import SpliceImagePrefix from "../block/spliceImagePrefix.vue";
    var _self;
    export default {
        data() {
            return {
                id: this.$route.query.id,
                t: this.$route.query.id ? "修改" : "添加",
                startContent: '',
                loading: false,
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                tag: 'specialSave',
                snapshot:'', // 版本号内容
                imageUrl: '',
                imagesLists:[],
                typeData: [{
                    value: 0,
                    label: '不限'
                }, {
                    value: 1,
                    label: 'PC'
                }, {
                    value: 2,
                    label: 'H5'
                }],
                query: {
                    id: this.$route.query.id ? Number(this.$route.query.id) : '',
                    is_show: 1,
                    sort: 0,
                    content: '',
                    terminal: 0,
                    summary:""
                },
                themeData: [],
                rules: {
                    name: [{
                        required: true,
                        message: '请填写名称',
                        trigger: 'blur,change'
                    }],
                    sort: [{
                        validator: this.$.v.positive,
                        trigger: 'blur,change',
                        type: 'number'
                    }],
                    content: [{
                        required: true,
                        message: '请填写内容',
                        trigger: 'blur,change'
                    }, {
                        validator: this.$.ueditor,
                        message: '请填写内容',
                        trigger: 'blur,change'
                    }],
                    summary: [{
                        required: true,
                        message: '请填写专题摘要',
                        trigger: 'blur,change'
                    }],
                    cover: [{
                        required: true,
                        message: '请上传封面图',
                        trigger: 'blur,change'
                    }],
                }
            };
        },
        created() {
            _self = this;
            if (_self.id) {
                this.getInfo();
            }
        },
        mixins: [uploadLoading],
        methods: {
            // 恢复版本号代码
            resetSnapshot(){
                console.log('要恢复的代码',this.snapshot)
                if (this.snapshot) {
                    this.query.content = Base64.decode(this.snapshot) // Base64.encode('dankogai');
                }
            },
            getConentsFn(v){
                this.$set(this.query,'content',v)
            },
            getInfo() {
                _self.$http.get('special/info', {
                        params: {
                            id: _self.id
                        }
                    })
                    .then(function (res) {
                        if (res.codeFlag) {
                            _self.query = res.d;
                            _self.imageUrl = res.d.cover ? res.d.cover + '!l' : "";
                            _self.startContent = res.d.content;
                            if (res.d.snapshot_list.length) {
                                _self.snapshot = Base64.encode(res.d.content);
                            }
                            // _self.imagesLists = res.d.image_list;
                            var lists = []
                            res.d.image_list.forEach(function (v,i) {
                                lists.push({
                                    url: v.filename,
                                    width: v.width,
                                    height: v.height
                                })
                            });
                            _self.$set(_self,'imagesLists',lists)
                            console.log("1-1", _self.imagesLists)
                        }
                    })
            },
            submitForm(formName) {
                _self.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.$http.post(`special/${_self.id?"update":"create"}`, _self.query)
                            .then(function (res) {

                                if (res.codeFlag) {
                                    if (!_self.id) {
                                        _self.$back('list')
                                    }
                                    _self.$message({
                                        message: _self.id ? "修改成功！" : "添加成功！",
                                        type: 'success'
                                    });
                                }
                            })
                    }
                })
            },
            // 百度编辑器方法
            input(editorContent) {
                this.query.content = editorContent.content
            },
            handleAvatarSuccess(res, file) {
                this.query.cover = res.data[0].preview;
                this.imageUrl = URL.createObjectURL(file.raw);
                this.uploadCloseLoding();
                this.$refs.query.validateField('cover');
            },
        },
        components: {
            Ueditor,
            SpliceImagePrefix
        }
    }

</script>

