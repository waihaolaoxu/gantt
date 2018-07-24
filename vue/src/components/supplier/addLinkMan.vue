<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl" :class="{'is-active':query.source_type==1}" @click="query.source_type=1;goRouter();">添加联系人</div>
                    <div class="el-tabs__item fl" :class="{'is-active':query.source_type==2}" @click="query.source_type=2;goRouter();">添加类型</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="params" :rules="rules" ref="params" label-width="130px" class="demo-ruleForm" size="medium" v-if="query.source_type==1">
                <el-form-item label="联系人名称：" prop="name">
                    <el-input v-model="params.name" placeholder="请输入联系人名称"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话：" prop="phone">
                    <el-input v-model="params.phone" placeholder="请输入联系人电话"></el-input>
                </el-form-item>
                <el-form-item label="公司名称：">
                    <el-input v-model="params.company" placeholder="请输入公司名称"></el-input>
                </el-form-item>
                <el-form-item label="职位：">
                    <el-input v-model="params.position" placeholder="请输入职位"></el-input>
                </el-form-item>
                <el-form-item label="类型：" prop="flag">
                    <el-radio-group v-model="params.flag">
                        <el-radio :label="v.id" v-for="(v,index) in typeList" :key="index">{{v.name}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="备注：">
                    <el-input v-model="params.des" placeholder="请输入备注" type="textarea"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('params')">提交</el-button>
                </el-form-item>
            </el-form>
            <div v-if="query.source_type==2">
                <config :type="3"></config>
            </div>
        </div>
    </div>
</template>

<script>
import config from '../config/config';
import {
    pagingEvent
} from '@/mixins/index';
var self;
export default {
    data() {
        return {
            loading: false,
            typeList: [],
            params: {
                id: this.$route.query.id || "",
                name: this.$route.query.name || "",
                phone: this.$route.query.phone || "",
                company: this.$route.query.company || "",
                position:this.$route.query.position || "",
                flag:this.$route.query.flag || "",
                des:this.$route.query.des || ""
            },
            query:{
                source_type: this.$route.query.source_type || "1",
                id: this.$route.query.id || ""
            },
            submitUrl: '',
            rules: {
                name: [{
                    required: true,
                    message: '联系人名称不能为空',
                    trigger: 'blur'
                }],
                phone: [{
                    required: true,
                    message: '联系人电话不能为空',
                    trigger: 'blur'
                }],
                company: [{
                    required: true,
                    message: '公司名称不能为空',
                    trigger: 'blur'
                }],
                position: [{
                    required: true,
                    message: '职位不能为空',
                    trigger: 'blur'
                }],
                flag: [{
                    required: true,
                    type: "number",
                    message: '类型不能为空',
                    trigger: 'blur,change'
                }]
            }
        };
    },
    created() {
        self = this;
        if (this.$route.query.id) {
            this.getData();
            this.submitUrl = 'linkman/update'
        } else {
            this.submitUrl = 'linkman/create'
        }
        this.getTypeData();
    },
    mixins: [pagingEvent],
    methods: {
        // 获取联系人详情
        getData() {
            this.$http.get('linkman/info', {
                    params: {
                        id: self.$route.query.id
                    }
                })
                .then(function (res) {
                    self.params = res.data.data
                    self.loading = false;

                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        // 获取类型
        getTypeData() {
            this.$http.get('config/type/list',{
                params: {
                    type: 3
                }
            })
                .then(function (res) {
                    self.typeList = res.d;
                })
        },
        submitForm(formName) {
            self.$refs[formName].validate((valid) => {
                if (valid) {
                    self.$http.post(self.submitUrl, self.params)
                        .then(function (res) {
                            if (res.codeFlag) {
                                self.$message({
                                    type: 'success',
                                    message: res.data.description
                                });
                                if (!self.$route.query.id) {
                                    self.$back('linkmanList');
                                }
                            }
                        })
                }
            })

        }
    },
    components: {
        config
    }
}

</script>
