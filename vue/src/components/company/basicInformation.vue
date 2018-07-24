<template>
  <div class="list-box">
    <div class="list-body">
      <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <div class="gs-content">
            <el-form ref="form" :model="form" label-width="80px">
              <el-form-item>
                <div class="projectItem">
                  <span class="projectLab">公司名称：</span>
                  <el-input v-model="form.name" style="width:30%" placeholder="请输入公司名称"></el-input>
                </div>
              </el-form-item>
              <el-form-item>
                <span class="projectLab">公司简称：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司简称"></el-input>
              </el-form-item>
              <el-form-item>
                <span class="projectLab">公司电话：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司电话"></el-input>
              </el-form-item>
              <el-form-item>
                <span class="projectLab">工作时间：</span>
                  <el-time-select
                    placeholder="起始时间"
                    v-model="startTime"
                    :picker-options="{
                      start: '08:30',
                      step: '00:15',
                      end: '18:30'
                    }">
                  </el-time-select>
                  <span>-</span>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="endTime"
                    :picker-options="{
                      start: '08:30',
                      step: '00:15',
                      end: '18:30',
                      minTime: startTime
                    }">
                  </el-time-select>
              </el-form-item>
              <el-form-item>
                <div class="projectItem">
                  <span class="projectLab">logo:</span>
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
                </div>
                <p class="promp">请上传1：1比例图片</p>
                <p class="promp">文件格式GIF、JPG、JPEG、PNG，文件大小200K以内，建议尺寸至少800PX*800PX</p>
              </el-form-item>
              <el-form-item>
                <span class="projectLab">公司地址：</span>
                <el-input v-model="form.name" style="width:30%" placeholder="请输入公司地址"></el-input>
              </el-form-item>
              <map-search></map-search>
              <!--<el-form-item>
                <span class="projectLabNo">地图位置：</span>
                <div id="r-result">请输入:<input type="text" id="suggestId" size="20" value="百度" style="width:150px;" /></div>

              </el-form-item>-->
              <el-form-item>
                <el-button type="primary" @click="onSubmit">提交</el-button>
                <el-button>取消</el-button>
              </el-form-item>
            </el-form>
            <el-amap vid="amapDemo"></el-amap>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import mapSearch from '@/components/company/mapSearch';
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
    },
    components: {
      mapSearch
    }
  }
</script>
