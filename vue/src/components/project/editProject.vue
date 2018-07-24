<template>
    <div class="list-box editProject">
        <el-tabs v-model="activeName2" type="card" @tab-click="tabClick">
            <el-tab-pane label="工程信息" name="first">
                <div class="list-body">
                    <add-project></add-project>
                </div>
            </el-tab-pane>
            <el-tab-pane label="施工过程" name="second">
                <div class="list-body">
                    <!-- <div class="cardBox" v-if="engineer_progress_data.listData">
                        <template v-for="(progressItem,index) in engineer_progress_data.listData">
                            <el-card class="box-card" v-bind:class="{'box-card1':progressItem.progress == 1,'box-card2':progressItem.progress == 2,'box-card3':progressItem.progress == 0}">
                                <div slot="header" class="clearfix">
                                    <span>{{progressItem.tag}}</span>
                                </div>

                                //<div class="text item">
                                    <el-button type="primary" size="mini" v-if="progressItem.progress == 0 && index != 6" @click="finshFn(progressItem)">开始
                                    </el-button>
                                    <el-button type="success" size="mini" v-if="progressItem.progress == 0 && index == 6" @click="finshFn(progressItem)">完成
                                    </el-button>
                                    <span v-if="progressItem.progress == 1">{{progressItem.date}}&nbsp;&nbsp;&nbsp;完成</span>
                                    <span v-if="progressItem.progress == 2">进行中</span>
                                </div>//


                                <div class="text item">
                                    <span v-if="progressItem.progress == 0 && index != 6">&nbsp;&nbsp;&nbsp;待开始</span>
                                    <span v-if="progressItem.progress == 0 && index == 6">&nbsp;&nbsp;&nbsp;待完成</span>
                                    <span v-if="progressItem.progress == 1">{{progressItem.date}}&nbsp;&nbsp;&nbsp;完成</span>
                                    <span v-if="progressItem.progress == 2">进行中</span>
                                </div>
                            </el-card>

                        </template>
                    </div> -->
                    <div class="progressLineBox">
                        <ul class="flex-box">
                            <li :class="{flex1: index != 6}" v-for="(progressItem,index) in engineer_progress_data.listData" :key="index">
                                <div class="point active" v-if="progressItem.progress == 1">
                                    <i class="el-icon-circle-check iconF"></i>
                                </div>
                                <div class="point ing" v-if="progressItem.progress == 2"></div>
                                <div class="point" v-if="progressItem.progress == 0"></div>

                                <div :class="{linerRed: progressItem.progress == 1}"></div>
                                <div class="pointword" :class="{wordIng: progressItem.progress == 2}">
                                    <p class="tagName">{{progressItem.tag}}</p>
                                    <p v-if="progressItem.progress == 1" class="proDate">{{progressItem.date}}</p>
                                </div>
                            </li>
                        </ul>
                        <div class="line"></div>
                    </div>
                </div>
                <el-tabs v-model="activeName" type="card" style="margin-top:30px; font-size:14px;">
                    <el-tab-pane label="施工过程" name="first">
                        <div class="list-body">
                            <el-button type="primary" size="mini" @click="addProgressFn" style="margin-bottom:15px;">添加进度</el-button>
                            <div class="progressInfo" v-for="v,index in process_list" :key="index">
                                <div class="el-prompting" style="position:relative;line-height: 30px;">
                                    <span v-if="v.user_name">添加人：{{v.user_name}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <span v-if="v.create_date">添加时间：{{v.create_date}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <span v-if="v.stage">阶段：<span class="text-blue">{{v.stage}}</span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    <span v-if="v.source">来源：<span class="text-blue">{{v.source}}</span></span>
                                    <el-button-group style="position: absolute;right:0;top:0;" v-if="v.editable == 1">
                                        <el-button size="mini" @click="jumpEditProgress(v.id)">编辑</el-button>
                                        <el-button size="mini" @click="deleteProgress(v.id)" v-if="v.deletable == 1">删除</el-button>
                                    </el-button-group>
                                </div>
                                <ul>
                                    <li v-for="val,i in v.photos" style="width:150px;height:150px;margin:10px 10px 10px 0;display: inline-block;">
                                        <!-- <img :src="val.photo_url" class="cover"> -->
                                        <img v-lazy="val.photo_url" class="cover pointer" :src="val.photo_url" alt="" @click='imgBig(v.photos,i)'>
                                    </li>
                                </ul>
                                <div v-if="v.remark" class="el-prompting">{{v.remark}}</div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeName" type="card" style="margin-top:30px;">
                    <el-tab-pane label="效果图" name="first">
                        <div class="list-body">
                            <div style="margin-bottom: 15px;">
                                <el-upload :action="$.upload" list-type="picture-card" :on-preview="handlePictureCardPreview1" :on-success="handleAvatarSuccess1"
                                    :on-remove="handleRemove1" multiple name='file' :data='img.uploadData' :file-list="img.fileList1"
                                    :accept='$.accept'>
                                    <i class="el-icon-plus"></i>
                                </el-upload>

                            </div>
                            <el-dialog :visible.sync="img.dialogVisible1">
                                <img width="100%" :src="img.dialogImageUrl1" alt="">
                            </el-dialog>
                            <!--<el-button type="primary" size="mini" @click="submitPhoto(1)">提交</el-button>-->
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeName" type="card" style="margin-top:30px;">
                    <el-tab-pane label="施工图" name="first">
                        <div class="list-body">
                            <div style="margin-bottom: 15px;">
                                <el-upload :action="$.upload" list-type="picture-card" :on-preview="handlePictureCardPreview1" :on-success="handleAvatarSuccess2"
                                    :on-remove="handleRemove2" multiple name='file' :data='img.uploadData' :file-list="img.fileList2"
                                    :accept='$.accept'>
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                            <!--<el-button type="primary" size="mini" @click="submitPhoto(2)">提交</el-button>-->
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeName" type="card" style="margin-top:30px;">
                    <el-tab-pane label="实景图" name="first">
                        <div class="list-body">
                            <div style="margin-bottom: 15px;">
                                <el-upload :action="$.upload" list-type="picture-card" :on-preview="handlePictureCardPreview1" :on-success="handleAvatarSuccess3"
                                    :on-remove="handleRemove3" multiple name='file' :data='img.uploadData' :file-list="img.fileList3"
                                    :accept='$.accept'>
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                            <!--<el-button type="primary" size="mini" @click="submitPhoto(3)">提交</el-button>-->
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-tab-pane>
        </el-tabs>
        <transition name='slide-scale'>
            <el-carousel :autoplay='false' arrow="always" class="pf zero full bigImgs tran" v-if='imgs.show' :initial-index='imgs.now'>
                <span class="no-select pa closeImg flex-box middle" @click='closeImg'>X</span>
                <el-carousel-item v-for="(item,index) in imgs.list" :key="index">
                    <div class="flex-box full middle">
                        <img v-lazy="item.re_photo_url" class="full" alt="" style="object-fit:contain;background-color:transparent!important;">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </transition>
    </div>
</template>
<style lang="scss">
    // 工程进度条
    .progressLineBox {
        width: 80%;
        height: 100px;
        margin: 20px auto;
        position: relative;
        .line {
            width: 100%;
            height: 1px;
            background: #dddddd;
            position: absolute;
            top: 12px;
        }
        ul{
            &.flex-box{
                width: 100%;
                display: flex;
                position: absolute;
                top: 1px;
                z-index: 1;
            }
            li {
                position: relative;
                .point {
                    width: 20px;
                    height: 20px;
                    border: 1px solid #ddd;
                    border-radius: 50%;
                    background: #fff;
                    position: relative;
                    top: 0;
                    left: 0;
                    &.active{
                        // background: #57c90c;
                    }
                }
                .linerRed{
                    height: 1px;
                    background: #57c90c;
                    margin-top: -16px;
                }
                .pointword{
                    width: 100px;
                    position: absolute;
                    text-align: center;
                    left: -40px;
                    top: 30px;
                    p.proDate{
                        font-size: 13px;
                    }
                    &.wordIng{
                        font-weight: bold;
                    }
                }
                .active{
                    .iconF{
                        color: #57c90c;
                        font-size: 24px;
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        z-index: 5;
                    }
                }
                .ing{
                    &::before{
                        content: "";
                        width: 12px;
                        height: 12px;
                        border-radius: 6px;
                        background: #57c90c;
                        position: absolute;
                        top: 4px;
                        left: 4px;
                    }
                }
            }
        }
    }
    .editProject{
        div.el-card__header{
            padding: 12px 20px;
        }
        .el-card__body{
            padding: 16px 20px;
        }

        .box-card1{
            border-color: #d6e9c6;
            div.el-card__header{
                background: #d6e9c6;
                color: #3c763d;
            }
        }
        .box-card2{
            border-color: #bce8f1;
            div.el-card__header{
                background: #d9edf7;
                color: #31708f;
            }
        }
        .box-card3{
            border-color: #faebcc;
            div.el-card__header{
                background: #fcf8e3;
                color: #8a6d3b;
            }
        }
    }
</style>
<style scoped lang="scss">
    .cardBox {
        width: 100%;
        overflow: hidden;
        display: flex;
    }

    .text {
        font-size: 14px;
    }

    .text.item {
        margin-bottom: 18px;
        line-height: 28px;
    }
    .clearfix {
        text-align: center;
        font-weight: 500;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }
    .box-card {
        width: 480px;
    }


    .box-card .item {
        margin-bottom: 0;
        text-align: center;
    }
    .list-body {
        .progressInfo {
            padding: 10px;
            border: 1px solid #ddd;
            &:not(:last-child) {
                border-bottom: 0;
            }
        }
    }
    .el-card.box-card {
        // width: calc((100% - 5 * 30px - 2px * 6) / 6);
        // width: -moz-calc((100% - 5 * 30px) / 6);
        // width: calc((100% - 5 * 30px - 2px * 6) / 6);
        // margin-right: 30px;
        // margin-bottom: 30px;
        // float: left;
        margin-left: 15px;
        flex: 1;
    }

    .el-card.box-card:first-child {
        margin-left: 0;
    }

</style>
<script>
    import addProject from './addProject'
    import {
        lookimg
    } from '@/mixins/index';
    var self;
    export default {
        data() {
            return {
                loading: false,
                activeName2: this.$route.path == '/construction/edit_project_process' ? 'second' : 'first',
                activeName: 'first',
                process_list: [],
                // imageUrl1: '',
                // imageUrl2: '',
                // imageUrl3: '',
                engineer_progress_data: {}, //顶部工程进度数据
                progress_info: '',
                img: {
                    fileList1: [],
                    dialogVisible1: false,
                    dialogImageUrl1: '',
                    del_ids1: [],
                    fileList2: [],
                    dialogVisible2: false,
                    dialogImageUrl3: '',
                    del_ids2: [],
                    fileList3: [],
                    dialogVisible3: false,
                    dialogImageUrl3: '',
                    del_ids3: [],
                    uploadData: {
                        module: 'store',
                        type: 'image'
                    },
                },
                del_ids1: "",
                del_ids2: "",
                del_ids3: "",
                query: {
                    id: this.$route.query.id,
                    del_ids: '',
                    cover1: '',
                    cover2: '',
                    cover3: ''
                }
            }
        },
        mixins: [lookimg],
        created() {
            self = this;
            console.log(this.$route, 1219291829)
            if (this.$route.path == '/construction/edit_project_process') {
                self.getProgressData()
            }
        },
        methods: {
            // 获取工程进度数据
            getProgressData() {
                // 施工过程详情
                var that = this;
                this.$http.get('engineer/process/detail', {
                        params: {
                            id: this.$route.query.id
                        }
                    })
                    .then(function (res) {
                        console.log("过程详情的数据：", res.data)
                        that.process_list = res.data.data.process_list;
                        that.progress_info = res.data.data.info;
                        var obj = new Object();
                        obj.id = res.data.data.id;
                        obj.listData = new Array();
                        console.log('res.data.data.engineer_stage_date', res.data.data.engineer_stage_date)
                        for (var key in res.data.data.engineer_stage_date) {
                            var obj1 = new Object();
                            obj1.name = res.data.data.engineer_stage_date[key];
                            obj1.key = key;
                            console.log(key, res.data.data.engineer_stage_date[key])
                            for (var key1 in res.data.data.engineer_stage) {
                                if (key == key1) {
                                    obj1.tag = res.data.data.engineer_stage[key1];
                                    obj1.date = res.data.data.info[obj1.name]
                                }
                            }
                            obj.listData.push(obj1);
                        }
                        console.log('obj.listData', obj.listData)
                        var finshIndex = -1;
                        for (var i = 0; i < obj.listData.length; i++) {
                            if (obj.listData[i].date.indexOf('0000-00-00') != -1 && that.progress_info.stage != 1) {
                                finshIndex = i;
                                break;
                            }
                        }
                        if (that.progress_info.stage == 2000) {
                            finshIndex = 6;
                        }
                        console.log("i的值：", finshIndex)
                        for (var key3 in obj.listData) {
                            if (finshIndex == 0) {
                                if (key3 == 0) {
                                    obj.listData[key3].progress = 2
                                } else {
                                    obj.listData[key3].progress = 0
                                }

                            } else if (finshIndex != 0 && finshIndex != -1) {
                                if (key3 <= finshIndex - 1) {
                                    obj.listData[key3].progress = 1
                                } else if (key3 == finshIndex) {
                                    obj.listData[key3].progress = 2
                                } else {
                                    obj.listData[key3].progress = 0
                                }
                                if (finshIndex == 6) {
                                    obj.listData[key3].progress = 1
                                }
                            } else if (finshIndex == -1) {
                                obj.listData[key3].progress = 0
                            }

                        }
                        that.engineer_progress_data = JSON.parse(JSON.stringify(obj))
                        console.log("渲染的数据：", that.engineer_progress_data)
                        if (res.data.data.photos['type-1']) {
                            that.img.fileList1 = [];
                            res.data.data.photos['type-1'].forEach((v, i) => {
                                var obj3 = {};
                                obj3.url = v.photo_url;
                                obj3.secret = v.secret;
                                obj3.id = v.id;
                                that.img.fileList1.push(obj3);
                                console.log(that.img.fileList1)
                            })
                        }
                        if (res.data.data.photos['type-2']) {
                            that.img.fileList2 = [];
                            res.data.data.photos['type-2'].forEach((v, i) => {
                                var obj3 = {};
                                obj3.url = v.photo_url;
                                obj3.secret = v.secret;
                                obj3.id = v.id;
                                that.img.fileList2.push(obj3);
                            })
                        }
                        if (res.data.data.photos['type-3']) {
                            that.img.fileList3 = []
                            res.data.data.photos['type-3'].forEach((v, i) => {
                                var obj3 = {};
                                obj3.url = v.photo_url;
                                obj3.secret = v.secret;
                                obj3.id = v.id;
                                that.img.fileList3.push(obj3);
                            })
                        }
                    })
            },
            // 点击tab选项卡
            tabClick(tab, event) {
                console.log(tab, event);

                if (tab.index == '1') {
                    this.$router.replace({
                        path: 'edit_project_process',
                        query: {
                            id: this.$route.query.id
                        }
                    })
                } else {
                    this.$router.replace({
                        path: 'edit_project',
                        query: {
                            id: this.$route.query.id
                        }
                    })
                }
            },
            //  点击完成按钮
            finshFn(progressItem) {
                console.log("progressItem:", progressItem)
                // this.$set(this.progressData[index], 'progess', 3)
                // 施工过程修改
                var that = this;
                this.$http.post('engineer/stage/change', {
                        id: that.$route.query.id, //标识id
                        stage: progressItem.key //进度标识
                    })
                    .then(function (res) {
                        if (res.data.code == '1000') {
                            that.getProgressData()
                        }
                    })
            },
            // 编辑进度
            jumpEditProgress(id) {
                this.$router.push({
                    path: 'add_progress',
                    query: {
                        progressId: id,
                        id: this.$route.query.id
                    }
                })
            },
            // 删除进度
            deleteProgress(id) {
                this.$confirm('确认删除此进度记录？')
                    .then(() => {
                        this.$http.post('engineer/process/delete', {
                                id: id,
                                engineer_id: self.$route.query.id,
                            })
                            .then(function (res) {
                                self.getProgressData()
                                done();
                                console.log('删除成功！')
                            })
                    })
                    .catch(_ => {});


            },
            //添加进度
            addProgressFn() {
                this.$router.push({
                    path: 'add_progress',
                    query: {
                        id: this.$route.query.id
                    }
                })
            },
            //图片上传成功
            handlePictureCardPreview1(file) {
                this.img.dialogImageUrl1 = file.url;
                this.img.dialogVisible1 = true;
            },
            handleRemove1(file, fileList) {
                console.log(file, fileList,this.del_ids1, self.img.fileList1);
                // this.img.fileList1 = fileList;
                if (file.id != 0) { // 删除的是之前保存过的图片
                    this.img.del_ids1.push(file.id)
                    var cover1 = JSON.stringify(self.img.fileList1).replace(/url/g, 'src')
                    if (this.img.del_ids1.length) {
                        this.del_ids1 = this.img.del_ids1.toString()
                    }
                    this.$http.post('engineer/photo/update', {
                            id: self.$route.query.id,
                            cover1: cover1,
                            del_ids: this.del_ids1
                        })
                        .then(function (res) {
                            console.log('修改成功！')
                        })
                }
            },
            handleAvatarSuccess1(res, file) {
                console.log("!23123", res, file,this.img.fileList1)
                var that = this;
                this.img.dialogVisible1 = false;
                // res.data.forEach(function(v,i){
                //     that.img.fileList1.push({

                var v = res.data[0];
                console.log(that.img.fileList1)
                var n = that.img.fileList1.length - 1;
                if(n<0){
                    n=0;
                }
                that.img.fileList1[n] = {
                        url: v.preview,
                        secret: v.secret,
                        id: 0
                    }
                //     )
                // })
                console.log('多选图片',that.img.fileList1)
                var cover1 = JSON.stringify(self.img.fileList1).replace(/url/g, 'src')
                if (this.img.del_ids1.length) {
                    this.del_ids1 = this.img.del_ids1.toString()
                }
                this.$http.post('engineer/photo/update', {
                        id: self.$route.query.id,
                        cover1: cover1,
                        del_ids: this.del_ids1
                    })
                    .then(function (res) {
                        if(res.codeFlag){
                            that.img.fileList1[n].id = file.id = res.d[0]
                            console.log('修改成功！',that.img.fileList1[n])

                        }

                    })
            },
            handleRemove2(file, fileList) {
                console.log(file, fileList);
                this.img.fileList2 = fileList;
                if (file.id != 0) { // 删除的是之前保存过的图片
                    this.img.del_ids2.push(file.id)
                    var cover2 = JSON.stringify(self.img.fileList2).replace(/url/g, 'src')
                    if (this.img.del_ids2.length) {
                        this.del_ids2 = this.img.del_ids2.toString()
                    }
                    this.$http.post('engineer/photo/update', {
                            id: self.$route.query.id,
                            cover2: cover2,
                            del_ids: this.del_ids2
                        })
                        .then(function (res) {
                            console.log('修改成功！')
                        })
                }
            },
            handleAvatarSuccess2(res, file) {
                var that = this;
                this.img.dialogVisible2 = false;
                var v = res.data[0];
                var n = that.img.fileList2.length - 1;
                if(n<0){
                    n=0;
                }
                that.img.fileList2[n] = {
                    url: v.preview,
                    secret: v.secret,
                    id: 0
                }
                console.log('多选图片',that.img.fileList2)
                var cover2 = JSON.stringify(self.img.fileList2).replace(/url/g, 'src')
                this.$http.post('engineer/photo/update', {
                        id: self.$route.query.id,
                        cover2: cover2
                    })
                    .then(function (res) {
                        console.log('修改成功！')
                        if(res.codeFlag){
                            that.img.fileList2[n].id = file.id = res.d[0]
                            console.log('修改成功！',that.img.fileList2[n])

                        }
                    })
            },


            handleRemove3(file, fileList) {
                console.log(file, fileList);
                this.img.fileList3 = fileList;
                if (file.id != 0) { // 删除的是之前保存过的图片
                    this.img.del_ids3.push(file.id)
                    var cover3 = JSON.stringify(self.img.fileList3).replace(/url/g, 'src')
                    if (this.img.del_ids3.length) {
                        this.del_ids3 = this.img.del_ids3.toString()
                    }
                    this.$http.post('engineer/photo/update', {
                            id: self.$route.query.id,
                            cover3: cover3,
                            del_ids: this.del_ids3
                        })
                        .then(function (res) {
                            console.log('修改成功！')
                        })
                }
            },
            handleAvatarSuccess3(res, file) {
                var that = this;
                this.img.dialogVisible3 = false;
                var v = res.data[0];
                var n = that.img.fileList3.length - 1;
                if(n<0){
                    n=0;
                }
                that.img.fileList3[n] = {
                    url: v.preview,
                    secret: v.secret,
                    id: 0
                }
                var cover3 = JSON.stringify(self.img.fileList3).replace(/url/g, 'src')
                this.$http.post('engineer/photo/update', {
                        id: self.$route.query.id,
                        cover3: cover3
                    })
                    .then(function (res) {
                        console.log('修改成功！')
                        if(res.codeFlag){
                            that.img.fileList3[n].id = file.id = res.d[0]
                            console.log('修改成功！',that.img.fileList3[n])

                        }
                    })
            },
            // 修改工程进度图片
            submitPhoto(index) {
                console.log('进度图片修改', this.imageUrl1, this.imageUrl2, this.imageUrl3)
            }
        },
        components: {
            addProject
        }
    }

</script>
