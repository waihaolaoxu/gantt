<template>
    <div class="form-page">
         <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">站点管理</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form :model="query" :rules="rules" ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-form-item label="站点名称：" prop="name">
                    <el-input v-model="query.name" placeholder="请输入站点名称"></el-input>
                </el-form-item>
                <el-form-item label="主题ID：" prop="theme_id">
                    <el-select v-model.number="query.theme_id" placeholder="请选择主题">
                        <el-option
                            v-for="item in themeData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ICP备案信息：" prop="icp">
                    <el-input
                        placeholder="请输入ICP备案信息"
                        v-model="query.icp">
                    </el-input>
                </el-form-item>
                <el-form-item label="公网安备信息：">
                    <el-input
                        placeholder="请输入公网安备信息"
                        v-model="query.gwab">
                    </el-input>
                </el-form-item>
                <el-form-item label="版权所有：">
                    <el-input
                        placeholder="请输入公司全名"
                        v-model="query.copyright">
                    </el-input>
                </el-form-item>
                <el-form-item label="是否开启：" prop="is_closed">
                    <el-radio v-model="query.is_closed" label="0">是</el-radio>
                    <el-radio v-model="query.is_closed" label="1">否</el-radio>
                </el-form-item>
                <!--<el-form-item label="PC菜单：" prop="pc_menu">
                    <el-input v-model="query.pc_menu" placeholder="请输入PC菜单"></el-input>
                </el-form-item>-->
                <el-form-item label="PC站header：">
                    <el-input v-model="query.pc_header" placeholder="请输入PC站header" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="PC站footer：">
                    <el-input v-model="query.pc_footer" placeholder="请输入PC站footer" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <!--<el-form-item label="H5菜单：" prop="h5_menu">
                    <el-input v-model="query.h5_menu" placeholder="请输入H5菜单"></el-input>
                </el-form-item>-->
                <el-form-item label="M站header：">
                    <el-input v-model="query.h5_header" placeholder="请输入M站header" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="M站footer：">
                    <el-input v-model="query.h5_footer" placeholder="请输入M站footer" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="网站Logo：" prop="logo">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess" name='file'
                        :data='uploadData' :accept='$.accept' :before-upload="beforeAvatarUploadLoding">
                        <img v-if="query.logo" :src="query.logo" class="avatar cover">
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                    <div style="color:#777;">请上传20：7比例图片  建议尺寸200PX*70PX</div>
                </el-form-item>
                <el-form-item label="二维码：" prop="qrcode">
                    <el-upload :action="$.upload"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview1"
                        :on-success="handleAvatarSuccess1"
                        :on-remove="handleRemove1" multiple name='file'
                        :data='uploadData'
                        :file-list="fileList1"
                        :before-upload="beforeAvatarUploadLodingerweima"
                        :limit="limit"
                        :on-exceed="handleExceed"
                        :accept='$.accept'>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible1">
                        <img width="100%" :src="dialogImageUrl1" alt="">
                    </el-dialog>
                    <div style="color:#777;">请上传1：1比例图片  建议尺寸130PX*130PX,二维码最多上传3张</div>
                </el-form-item>
                <el-form-item label="ICON：" prop="icon">
                    <el-upload class="avatar-uploader" :action="$.upload" :show-file-list="false" :on-success="handleAvatarSuccess2" name='file'
                        :data='uploadData' :accept='$.accept+",image/x-icon"' :before-upload="beforeAvatarUploadLoding1">
                        <img v-if="query.icon" :src="query.icon" class="avatar cover">
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                    <div style="color:#777;">请上传1：1比例图片  建议尺寸64PX*64PX</div>
                </el-form-item>
                <el-form-item label="水印图：" prop="watermark">
                    <el-upload class="avatar-uploader" action="/api/company/watermark/upload" :show-file-list="false" :on-success="handleAvatarSuccess3" name='file'
                        :data='uploadData1' :accept='$.accept' :before-upload="beforeAvatarUploadLoding1">
                        <img v-if="query.watermark" :src="'https://i1.jiajuol.com'+query.watermark+'!mm'" class="avatar cover">
                        <i v-else class="el-icon-plus avatar-uploader-icon error-text"></i>
                    </el-upload>
                    <div style="color:#777;">建议宽度不超过100PX</div>
                </el-form-item>
                <el-form-item label="计算器单价：">
                    <el-input type='number' v-model.number="query.calculator_price" placeholder="请输入计算器单价"></el-input>
                </el-form-item>
                <el-form-item label="计算器总价下限 ：">
                    <el-input type='number' v-model.number="query.calculator_total_floor" placeholder="请输入计算器总价下限"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('query')">提交</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import {
        limitUpload
    } from '@/mixins/index';
    var self, uLoading;
    export default {
        data() {
            return {
                limit:3,

                query: {
                    is_closed: '0',
                    logo:'',
                    qrcode:'',
                    icon:'',
                    copyright: '',
                    calculator_price:'',
                    calculator_total_floor:'',
                    watermark:'',
                    server_url:""
                },
                uploadData1:{
                    module: 'watermark',
                    type: 'image'
                },
                themeData:[],
                rules: {
                    name: [{
                        required: true,
                        message: '请填写站点名称',
                        trigger: 'blur'
                    }],
                    theme_id: [{
                        required: true,
                        message: '请选择主题ID',
                        type:'number',
                        trigger: 'blur'
                    }],
                    icp: [{
                        required: true,
                        message: '请填写ICP备案信息',
                        trigger: 'blur'
                    }],
                    is_closed: [{
                        required: true,
                        message: '请选择是否关闭',
                        // type:'number',
                        trigger: 'blur'
                    }],
                    logo: [{
                        required: true,
                        message: '请上传站点logo',
                        trigger: 'blur'
                    }],
                    qrcode: [{
                        required: true,
                        message: '请上传站点二维码',
                        trigger: 'blur'
                    }],
                    icon: [{
                        required: true,
                        message: '请上传站点icon',
                        trigger: 'blur'
                    }],

                }
            };
        },
        mixins: [limitUpload],
        created(){
            self = this;
            this.getInfo();
            this.getTheme();
        },
        methods: {
            getInfo(){
                self.$http.get('site/list')
                .then(function(res){
                    if (res.codeFlag && res.data.data.name) {
                        self.query = res.data.data;
                        self.query.is_closed = String(res.data.data.is_closed);
                        self.qrcode = res.data.data.qrcode;
                        res.data.data.qrcode.forEach(function(v,i) {
                            self.fileList1.push({
                                url: v
                            })
                        });
                    }
                })
            },
            // 获取获取主题列表
            getTheme(){
                self.$http.get('site/theme')
                .then(function(res){
                    if (res.codeFlag) {
                        self.themeData = res.data.data.list;
                    }
                })
            },
            //      logo上传
           handleAvatarSuccess(res, file) {
                this.query.logo = res.data[0].preview;
                // this.$set(this.query,"logo",res.data[0].preview)
                // this.imageUrl = URL.createObjectURL(file.raw);
                uLoading.close();
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
            //      icon上传
           handleAvatarSuccess2(res, file) {
                this.query.icon = res.data[0].preview;
                // this.imageUrl = URL.createObjectURL(file.raw);
                console.log("this icon", this)
                uLoading.close();
            },
            handleAvatarSuccess3(res, file) {
                this.query.watermark = res.data.file_path;
                this.query.server_url=res.data.server_url
                // this.imageUrl = URL.createObjectURL(file.raw);
                uLoading.close();
            },
            beforeAvatarUploadLoding(file) {
                var imgType = true;
                const isJPG = file.name.split('.')[1] === 'jpeg';
                const isJPEG = file.name.split('.')[1] === 'jpg';
                const isPNG = file.name.split('.')[1] === 'png';
                const isGIF = file.name.split('.')[1] === 'gif';
                // const isLt2M = file.size / 1024 / 200 <= 1;

                if (isJPG || isJPEG || isPNG || isGIF) {} else {
                    imgType = false;
                    this.$message.error('上传图片只能是 JPG,JPEG,PNG,GIF 格式!');
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
            blurFn(){
                self.$http.get('clue/check/phone', {
                    params: {
                        phone: self.query.phone
                    }
                })
            },
            submitForm(formName) {
                console.log( this.query.watermark)
                this.query.qrcode = this.qrcode;
                console.log('提交数据', this.query.qrcode, this.qrcode)
                if (this.query.qrcode.length) {
                    this.query.qrcode = JSON.stringify(this.query.qrcode);
                }
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.$http.post('site/add', self.query)
                            .then(function (res) {
                                console.log(res);
                                if (res.data.code == '1000') {
                                    self.$message({
                                        type: 'success',
                                        message: res.data.description
                                    });
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

