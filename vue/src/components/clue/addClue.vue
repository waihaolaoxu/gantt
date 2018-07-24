<template>
    <div class="form-page">
         <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">添加线索</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="预约联系人：">
                    <el-input v-model="query.name" placeholder="请输入预约联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话：" prop="phone">
                    <el-input v-model="query.phone" placeholder="请输入联系人电话" @blur="blurFn"></el-input>
                </el-form-item>
                <el-form-item label="线索来源：">
                    <el-input v-model="query.enter_source" placeholder="请输入线索来源"></el-input>
                </el-form-item>
                <el-form-item label="描述：">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入描述"
                        v-model="query.des">
                    </el-input>
                </el-form-item>
                <el-form-item label="JA_UUID：">
                    <el-input v-model="query.ja_uuid" placeholder="ja_uuid(用户唯一标识)"></el-input>
                </el-form-item>
                <el-form-item label="DEVICE_UUID：">
                    <el-input v-model="query.device_uuid" placeholder="device_uuid(设备唯一标识)"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import cityOptions from '@/components/block/city';
    var self;
    export default {
        data() {
            return {
                loading: false,
                query: {
                    name: "",
                    phone: "",
                    enter_source: "",
                    des: "",
                    ja_uuid: "",
                    device_uuid: ""
                },
                rules: {
                    phone: [{
                        validator: this.$.v.tel,
                        required: true,
                        trigger: 'blur'
                    }]
                }
            };
        },
        created(){
            self = this;
        },
        methods: {
            blurFn(){
                self.$http.get('clue/check/phone', {
                    params: {
                        phone: self.query.phone
                    }
                })
            },
            submitForm(formName) {
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('clue/self/create', self.query)
                            .then(function (res) {
                                console.log(res);
                                if (res.data.code == '1000') {
                                    self.$router.push({
                                        path: 'clueDetail',
                                        query: {
                                            apply_id: res.data.data.apply_id,
                                            resource: res.data.data.resource
                                        }
                                    })
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                })

            }
        },
        components: {

        }
    }
</script>
