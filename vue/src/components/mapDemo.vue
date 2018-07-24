<style>
  .gs-content{
    margin: 20px 0;
  }
  /*上传*/
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
<template>
  <div class="list-box">
    <div class="list-body">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="mapDemo" name="first">
          <div class="gs-content">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item>
                <span>公司名称：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司名称"></el-input>
              </el-form-item>
              <el-form-item>
                <span>公司简称：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司简称"></el-input>
              </el-form-item>
              <el-form-item>
                <span>公司电话：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司电话"></el-input>
              </el-form-item>
              <el-form-item>
                <span>工作时间：</span>
                <!--<el-time-select-->
                  <!--placeholder="起始时间"-->
                  <!--v-model="startTime"-->
                  <!--:picker-options="{-->
                    <!--start: '08:30',-->
                    <!--step: '00:15',-->
                    <!--end: '18:30'-->
                  <!--}">-->
                <!--</el-time-select>-->
                <!--<span>-</span>-->
                <!--<el-time-select-->
                  <!--placeholder="结束时间"-->
                  <!--v-model="endTime"-->
                  <!--:picker-options="{-->
                    <!--start: '08:30',-->
                    <!--step: '00:15',-->
                    <!--end: '18:30',-->
                    <!--minTime: startTime-->
                  <!--}">-->
                <!--</el-time-select>-->
              </el-form-item>
              <el-form-item>
                <span>logo:</span>
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  style="display: inline-block">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item>
                <span>公司地址：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司地址"></el-input>
              </el-form-item>
              <el-form-item>
                <span>地图位置：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司地理位置"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button>取消</el-button>
              </el-form-item>
              <el-form-item>
                <el-amap vid="amapDemo"></el-amap>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import route from '../router/index'
  export default {
    data() {
      return {
        activeName2: 'first',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        imageUrl: '',
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      onSubmit() {
        console.log('submit!');
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>
