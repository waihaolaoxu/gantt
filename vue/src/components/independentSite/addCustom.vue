<template>
    <div class="form-page">
         <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">添加自定义站点</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="名称：" prop="name" label-width="150px">
                    <el-input v-model="query.name" placeholder="请填写自定义站点名称"></el-input>
                </el-form-item>
                <el-form-item label="URL：" prop="url" label-width="150px">
                    <el-input v-model="query.url" placeholder="请填写自定义站点url"></el-input>
                </el-form-item>
                <el-form-item label="内容：" prop="content" label-width="150px">
                    <el-input
                        type="textarea"
                        :rows="6"
                        placeholder="请填写内容"
                        v-model="query.content">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型：" prop="type" label-width="150px">
                    <el-radio v-model="query.type" :label="1">PC</el-radio>
                    <el-radio v-model="query.type" :label="2">H5</el-radio>
                </el-form-item>
                <el-form-item label="是否显示：" prop="is_show" label-width="150px">
                    <el-radio v-model="query.is_show" :label="1">是</el-radio>
                    <el-radio v-model="query.is_show" :label="0">否</el-radio>
                </el-form-item>
                <!--<el-form-item label="菜单是否显示：" prop="show_menu" label-width="150px">
                    <el-radio v-model="query.show_menu" :label="1">是</el-radio>
                    <el-radio v-model="query.show_menu" :label="0">否</el-radio>
                </el-form-item>-->
                <el-form-item label="是否启用默认头尾：" prop="show_footer" label-width="150px">
                    <el-radio v-model="query.show_footer" :label="1">是</el-radio>
                    <el-radio v-model="query.show_footer" :label="0">否</el-radio>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>

                <div style="width:820px;margin-top: 45px;" v-if="$route.query.id">
                    <SpliceImagePrefix :imagesLists1="imagesLists" :tag="tag" :contents="query.content" @getConents='getConentsFn'></SpliceImagePrefix>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script>
    // import {
    //     uploadLoading
    // } from '@/mixins/index';
    var self;
    import SpliceImagePrefix from "../block/spliceImagePrefix.vue";
    export default {
        data() {
            return {
                loading: false,
                uploadData: {
                    module: 'store',
                    type: 'image'
                },
                tag: "addCustom",
                imagesLists:[],
                query: {
                    oper: 'add',
                    id: this.$route.query.id ? Number(this.$route.query.id) : '',
                    name: '',
                    url: '',
                    content: '',
                    type: 1,
                    is_show: 1,
                    // show_menu: 1,
                    show_footer: 1
                },
                themeData:[],
                rules: {
                    name: [{
                        required: true,
                        message: '请填写自定义站点名称',
                        trigger: 'blur'
                    }],
                    url: [{
                        required: true,
                        message: '请填写自定义站点url',
                        trigger: 'blur'
                    }],
                    content: [{
                        required: true,
                        message: '请填写内容',
                        trigger: 'blur'
                    }],
                    type: [{
                        required: true,
                        message: '请选择类型',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    is_show: [{
                        required: true,
                        message: '请填写是否显示',
                        type: 'number',
                        trigger: 'blur,change'
                    }],
                    // show_menu: [{
                    //     required: true,
                    //     message: '请填写菜单是否显示',
                    //     type: 'number',
                    //     trigger: 'blur,change'
                    // }],
                    show_footer: [{
                        required: true,
                        message: '请选择是否显示footer',
                        type: 'number',
                        trigger: 'blur,change'
                    }]
                }
            };
        },
        created(){
            self = this;
            if(this.$route.query.id){
                this.getInfo();
            }
        },
        methods: {
            getInfo(){
                self.$http.get('page/info',{
                    params: {
                        id: self.$route.query.id
                    }
                })
                .then(function(res){
                    if (res.codeFlag) {
                        self.query = res.data.data;

                        var lists = []
                        res.d.image_list.forEach(function (v,i) {
                            lists.push({
                                url: 'https://i.jiajuol.com' + v.filename + '!s',
                                width: v.width,
                                height: v.height
                            })
                        });
                        self.$set(self,'imagesLists',lists)

                        // self.query.type = String(res.data.data.type);
                        // self.query.is_show = String(res.data.data.is_show);
                        // self.query.show_menu = String(res.data.data.show_menu);
                        // self.query.show_footer = String(res.data.data.show_footer);
                        // self.query.show_header = String(res.data.data.show_header);

                    }
                })
            },
            getConentsFn(v){
                this.$set(this.query,'content',v)
            },
            addInfo(){
                self.$http.post('page/add',self.query)
                .then(function(res){
                        self.$message({
                        message: self.$route.query.id ? "修改成功！" : "添加成功！",
                        type: 'success'
                    });
                    if (res.codeFlag && !self.$route.query.id) {
                        self.$router.push({'path': 'list'})
                    }

                })
            },
            submitForm(formName) {
                if(this.$route.query.id) {
                    this.query.oper = 'update';
                } else {
                    this.query.oper = 'add';
                }
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.addInfo()
                    }
                })
            }
        },
        components: {
            SpliceImagePrefix
        }
    }
</script>
