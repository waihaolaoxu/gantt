<template>
    <div class="form-page">
         <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
            <div class="el-tabs__header" style='border:none;'>
                <div role="tablist" class="el-tabs__nav">
                    <div class="el-tabs__item fl is-active">seo文件</div>
                </div>
            </div>
        </div>
        <div class="wrapper bg-white b">
            <el-form ref="query" label-width="130px" class="demo-ruleForm" size="medium">
                <el-row :gutter="10" style='width:100%;'>
                    <el-col :sm="24" :md="24" :lg="12" :xl="12">
                        <el-upload
                            drag
                            :action="$.uploadhtml"
                            :file-list="fileList"
                            :on-change="handleChange"
                            :on-success="handleAvatarSuccess">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        </el-upload>
                    </el-col>
                    <el-col :sm="24" :md="24" :lg="12" :xl="12" class="f14" style="line-height: 1.5">
                        <p class="mb15">Sitemap（即站点地图）就是您网站上各网页的列表。创建并提交 Sitemap 有助于搜索引擎今后更全面、更快速地对网站进行抓取。目前百度、360、搜狗等主流搜索引擎都提供对 Sitemap 的支持。</p>
                        <div class="mb15">
                            <div>提交sitemap的一般步骤：</div>
                            <div class="ml15">1. 登录站长平台</div>
                            <div class="ml15">2. 验证网站：从站长平台中选择文件验证方式，下载验证文件，然后上传到本地服务器。</div>
                            <div class="ml15">3. 在站长平台中完成验证。</div>
                            <div class="ml15">4. 向站长平台提交 {{filename}}。（详细说明见下方）</div>
                        </div>

                        <div class="mb15">
                            <div>百度：</div>
                            <div class="ml15">
                                <a class="a-hover" href="https://jingyan.baidu.com/article/49ad8bce4b6f4a5834d8fadc.html" target="_blank">
                                    如何将 sitemap 文件提交到百度站长平台？
                                </a>
                            </div>
                            <div class="ml15 mt15">
                                <a class="a-hover" href="https://ziyuan.baidu.com/?castk=LTE%3D" target="_blank">
                                    【去百度提交Sitemap文件】
                                </a>
                            </div>
                        </div>
                        <div class="mb15">
                            <div>360：</div>
                            <div class="ml15">
                                <a class="a-hover" href="https://www.so.com/help/help_3_3.html" target="_blank">
                                    如何将 sitemap 文件提交到360站长平台？
                                </a>
                            </div>
                            <div class="ml15 mt15">
                                <a class="a-hover" href="http://zhanzhang.so.com/" target="_blank">
                                    【去360提交Sitemap文件】
                                </a>
                            </div>
                        </div>
                        <div>
                            <div>搜狗：</div>
                            <div class="ml15">
                                <a class="a-hover" href="http://help.sogou.com/sitemap.html" target="_blank">
                                    如何将 sitemap 文件提交到搜狗站长平台？
                                </a>
                            </div>
                            <div class="ml15 mt15">
                                <a class="a-hover" href="http://open.sogou.com/" target="_blank">
                                    【去搜狗提交Sitemap文件】
                                </a>
                            </div>
                        </div>
                    </el-col>
                </el-row>

            </el-form>
        </div>
    </div>
</template>

<script>
    var self;
    export default {
        data() {
            return {
                filename:"",
                fileList:[],
                successFlag: true
            };
        },
        created(){
            self = this;
            this.getdomin();
        },
        methods: {
            getdomin(){
                this.$http.get('site/list')
                .then(function (res) {
                    if (res.codeFlag) {
                        self.filename = 'http://' + res.data.data.pc_domain + '/sitemap.xml';
                    }
                })
            },
            // 上传成功
            handleAvatarSuccess(res, file){
                if (res.code != '1000') {
                    this.successFlag = false;
                    this.$message.error(res.description);
                }
            },
            handleChange(file, fileList) {
                if (!this.successFlag) {
                    fileList.pop();
                    this.fileList = fileList;
                    console.log(123)
                }
                this.successFlag = true;
            }
        },
        components: {

        }
    }
</script>
