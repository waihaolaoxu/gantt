<template>
    <div class="form-page">
        <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">添加供应商</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="供应商名称：" prop="name">
                    <el-input v-model="query.name" placeholder="请输入供应商名称"></el-input>
                </el-form-item>
                <el-form-item label="联系人：">
                    <el-input v-model="query.link_name" placeholder="请输入联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：">
                    <el-input v-model="query.mobile" placeholder="请输入联系方式"></el-input>
                </el-form-item>
                <el-form-item label="材料类型：" prop="type">
                    <el-checkbox-group v-model="query.type">
                        <el-checkbox v-for="(v,index) in typeData" :label="index" :key='index'>{{v}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    var self;
    export default {
        data() {
            return {
                loading: false,
                query: {
                    id: this.$route.query.id ? this.$route.query.id : "",
                    name: "",
                    link_name: "",
                    mobile: "",
                    type: []
                },
                typeData: {},
                submitUrl: '',
                rules: {
                    name: [{
                        required: true,
                        message: '供应商名称不能为空',
                        trigger: 'blur'
                    }],
                    type: [{
                        type: 'array',
                        required: true,
                        message: '请至少选择一个材料类型',
                        trigger: 'blur'
                    }]
                }
            };
        },
        created() {
            self = this;
            if (this.$route.query.id) {
                this.getData();
                this.submitUrl = 'supplier/update'
            } else {
                this.submitUrl = 'supplier/create'
            }
            this.getTypeData()
        },
        methods: {
            // 获取供应商详情
            getData() {
                this.$http.get('supplier/get', {
                        params: {
                            id: self.$route.query.id
                        }
                    })
                    .then(function (res) {
                        self.query = res.data.data
                        self.loading = false;

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            // 获取材料类型
            getTypeData() {
                this.$http.get('common/company/dict')
                    .then(function (res) {
                        // self.query = res.data.data
                        self.typeData = res.data.data.supplier_material_type;
                        self.loading = false;
                    })
            },
            submitForm(formName) {
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post(self.submitUrl, self.query)
                            .then(function (res) {
                                if (res.codeFlag) {
                                    self.$message({
                                        type: 'success',
                                        message: res.data.description
                                    });
                                    if (!self.$route.query.id) {
                                        self.$back('list');
                                    }
                                }
                            })
                    }
                })

            }
        },
        components: {

        }
    }

</script>
