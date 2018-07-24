<template>
    <div class="spliceImage">
        <div class="spliceImage-bar flex-box flex-between middle-a">
            <div>上传图片</div>
            <div>
                <span>查找</span>
                <el-input placeholder="/images" style="width:90px;" v-model="imgPath"></el-input>
                <span>替换</span>
                <el-input :placeholder="'https://i.jiajuol.com/company/' + filePath" style="width:180px;" disabled></el-input>
                <el-button plain @click="spliceUrlFn">批量替换url</el-button>
            </div>
        </div>
        <div class="spliceImage-cons">
            <el-upload
                :action="$.upload1"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview1"
                :on-success="handleAvatarSuccess1"
                :on-remove="handleRemove1"
                multiple name='file'
                :data='img.uploadData'
                :file-list="imagesLists1"
                :accept='$.accept'>
                <i class="el-icon-plus"></i>
            </el-upload>
        </div>
    </div>
</template>

<script>
    var self;
    export default {
        props: ['imagesLists1','contents','tag'],
        data() {
            return {
                imgPath:"images",
                img: {
                    fileList1: [],
                    dialogVisible1: false,
                    dialogImageUrl1: '',
                    del_ids1: [],
                    filePath:'',
                    uploadData: {
                        module: 'store',
                        type: 'image',
                        id: this.$route.query.id
                    },
                },
            }
        },
        created(){
            self = this;
            setTimeout(() => {

                // self.$set(this.img,'fileList1',self.imagesLists1)
                console.log('1@1:', this.imagesLists1, this.img.fileList1)
            }, 2000);
            if (this.tag == 'specialSave') { // 专题
                this.$.upload1 = '/api/company/special/photo/upload';
                this.filePath = 'special/';
            } else if (this.tag == 'addCustom') { // 自定义页面
                this.$.upload1 = '/api/company/page/upload';
                this.filePath = 'page/';
            }
            console.log("1-1-1-0101001", this.$.upload1)
        },
        methods:{
            // 批量替换
            spliceUrlFn(){
                this.$emit('getConents',this.contents.replace(new RegExp(this.imgPath,'g'), 'https://i.jiajuol.com/company/'+ this.filePath + this.$route.query.id));
            },
            //图片上传成功
            handlePictureCardPreview1(file) {
                // this.img.dialogImageUrl1 = file.url;
                // this.img.dialogVisible1 = true;
            },
            handleRemove1(file, fileList) {
                // // console.log(file, fileList,this.del_ids1, self.img.fileList1);
                // // // this.img.fileList1 = fileList;
                // // if (file.id != 0) { // 删除的是之前保存过的图片
                // //     this.img.del_ids1.push(file.id)
                // //     var cover1 = JSON.stringify(self.img.fileList1).replace(/url/g, 'src')
                // //     if (this.img.del_ids1.length) {
                // //         this.del_ids1 = this.img.del_ids1.toString()
                // //     }
                // //     this.$http.post('engineer/photo/update', {
                // //             id: self.$route.query.id,
                // //             cover1: cover1,
                // //             del_ids: this.del_ids1
                // //         })
                // //         .then(function (res) {
                // //             console.log('修改成功！')
                // //         })
                // }
            },
            handleAvatarSuccess1(res, file) {
                // console.log("!23123", res, file,this.img.fileList1)
                // var that = this;
                // this.img.dialogVisible1 = false;

                // var v = res.data[0];
                // that.img.fileList1 = [];
                // that.img.fileList1[0] = {
                //     url: v.preview,
                //     width: v.width,
                //     height: v.height
                //     // secret: v.secret,
                // }
                // that.img.fileList1 = JSON.parse(JSON.stringify(that.img.fileList1).replace(/url/g, 'path_url'))
                // this.$http.post('special/photo/upload', {
                //         id: self.$route.query.id,
                //         info: that.img.fileList1
                //     })
                //     .then(function (res) {
                //         if(res.codeFlag){
                //             // that.img.fileList1[n].id = file.id = res.d[0]
                //             console.log('修改成功！')
                //         }
                //     })
            },
        },
        computed: {}
    }

</script>
<style lang='scss'>
.spliceImage{
    .el-upload-list__item-actions{
        display: none;
    }
}
</style>
<style scoped lang='scss'>
.spliceImage{
    border: 1px solid #ddd;
    // box-shadow: 0 1px 1px rgba(0,0,0,.05);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    .spliceImage-bar{
        padding: 10px 19px;
        border-bottom: 1px solid #ddd;
        background: #f5f5f5;
    }
    .spliceImage-cons{
        padding: 10px 15px;
    }
}

</style>
