<template>
    <div class="form-page">
        <div class="list-box">
            <div class="el-tabs el-tabs--card over" style='margin-bottom:-1px;'>
                <div class="el-tabs__header" style='border:none;'>
                    <div role="tablist" class="el-tabs__nav">
                        <div class="el-tabs__item fl is-active">线索跟进详情</div>
                    </div>
                </div>
            </div>
            <div class="wrapper bg-white b">
                <el-form class="el-form-box">
                    <el-form-item class="el-titles">添加回访</el-form-item>

                    <div class="el-item-cons" style="padding: 15px 0;">
                    <el-form :model="query" :rules="rules" ref="query" size="small">
                        <el-form-item label="客户是否有装修需求：" v-if="infoForm.if_valid == 0 && ($route.query.resource == 1 || this.$route.query.resource == 3)" style="margin-bottom: 15px;padding: 0 15px 15px;border-bottom: 1px solid #e4eaec;">
                            <el-radio-group v-model="if_valid" size="mini">
                                <el-radio label="10" border >有需求</el-radio>
                                <el-radio label="1" border>无需求</el-radio>
                            </el-radio-group>
                            <p>{{infoForm.valid_date * 1000 | countDownFn}}之后默认为“有”</p>
                        </el-form-item>
                        <el-form-item v-if="infoForm.if_valid != 0 && ($route.query.resource == 1 || this.$route.query.resource == 3)" style="margin-bottom: 15px;padding: 0 15px 15px;border-bottom: 1px solid #e4eaec;">
                            <span>装修需求：</span>
                            <span v-if="infoForm.if_valid == 10">有需求</span>
                            <span v-if="infoForm.if_valid == 1">无需求</span>
                        </el-form-item>
                        <div style="padding: 0 15px;">
                            <el-form-item>
                                <el-radio v-model="query.status" label="1" border>跟进中</el-radio>
                                <el-radio v-model="query.status" label="2" border>已成交</el-radio>
                                <el-radio v-model="query.status" label="3" border>废单</el-radio>
                                <template v-if="query.status == 1">
                                    <el-date-picker v-model="query.next_date" type="date" value-format="yyyy-MM-dd" placeholder="选择下次回访日期"></el-date-picker>
                                    <el-time-select v-model="time" :picker-options="{
                                        start: '00:00',
                                        step: '00:30',
                                        end: '23:30'
                                        }" placeholder="选择下次回访时间">
                                    </el-time-select>
                                </template>
                            </el-form-item>
                            <el-form-item label="回访图片：">
                                <el-upload :action="$.upload"
                                    list-type="picture-card"
                                    :on-success="handleAvatarSuccess1"
                                    :on-remove="handleRemove1" multiple name='file'
                                    :data='uploadData'
                                    :file-list="fileList1"
                                    :limit="limit"
                                    :on-exceed="handleExceed"
                                    :before-upload="beforeAvatarUploadLodingerweima"
                                    :accept='$.accept'>
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <!-- <div style="color:#777;">请上传1：1比例图片  建议尺寸130PX*130PX</div> -->
                            </el-form-item>

                            <div v-if="query.status == 1" style="margin:15px 0">
                                <el-form-item prop="degree">
                                    <my-evaluation @changeDegree="changeDegreeFn" :degree="query.degree"></my-evaluation>
                                </el-form-item>
                                <template v-if="query.degree == 1">
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">无人接听</el-button>
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">暂时不方便接听</el-button>
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">业主觉得报价偏高</el-button>
                                </template>
                                <template v-if="query.degree == 2">
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">有需要再联系</el-button>
                                </template>
                                <template v-if="query.degree == 3">
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">交房后在联系</el-button>
                                </template>
                                <template v-if="query.degree == 4">
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">已预约量房</el-button>
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">正在接触装修公司，比价中</el-button>
                                </template>
                                <template v-if="query.degree == 5">
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">报价可接受</el-button>
                                    <el-button plain @click="clickButton" style="margin-top:15px" size="small">要求面议</el-button>
                                </template>
                            </div>

                            <div v-if="query.status == 2" style="margin:15px 0">
                                <el-form-item label="成交金额：" prop="deal_price">
                                    <el-input v-model="query.deal_price" placeholder="请输入成交金额" style="width:300px;">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="签约时间：" prop="deal_time">
                                    <el-date-picker v-model="query.deal_time" style="width:300px;" type="date" value-format="yyyy-MM-dd" placeholder="选择签约时间">
                                    </el-date-picker>
                                </el-form-item>

                            </div>

                            <div v-if="query.status == 3" style="margin:15px 0">
                                <el-button plain @click="clickButton" size="small">点错了</el-button>
                                <el-button plain @click="clickButton" size="small">已开工</el-button>
                                <el-button plain @click="clickButton" size="small">地域超限</el-button>
                                <el-button plain @click="clickButton" size="small">随便看下</el-button>
                                <el-button plain @click="clickButton" size="small">重复预约</el-button>
                                <el-button plain @click="clickButton" size="small">测试线索</el-button>
                                <el-button plain @click="clickButton" size="small">号码是空号</el-button>
                                <el-button plain @click="clickButton" size="small">无装修需求</el-button>
                                <el-button plain @click="clickButton" size="small">直接挂断电话</el-button>
                            </div>

                            <el-form-item style="margin:15px 0" prop="des">
                                <el-input style="width:50%" type="textarea" :autosize="{ minRows: 5, maxRows: 4}" :placeholder="placeholder" v-model="query.des">
                                </el-input>
                                <el-button type="primary" @click="addDealFn('query')">提 交</el-button>
                            </el-form-item>
                        </div>

                    </el-form>
                    </div>
                    <el-form-item class="el-titles no-top">回访记录</el-form-item>
                    <div class="el-item-cons">
                        <template>
                            <empty :empty='!loading&&!listData.length' :loading='loading'></empty>
                            <el-table v-if="listData.length" :data="listData" border style="width: 100%">
                                <el-table-column prop="add_date" label="回访时间">
                                </el-table-column>
                                <el-table-column label="回访内容" style="overflow: hidden;">
                                    <template slot-scope="scope">
                                        <div style="ml0">{{scope.row.des}}</div>
                                        <div class="img over radius5 pr mt10 mr3" v-for='(item1,index1) in scope.row.pics' :key='index1' v-if="scope.row.pics.length" style="float:left;">
                                            <div style="width: 30px;height: 30px;">
                                                <img v-lazy="item1.full_small_url" class="full cover zero pa pointer" alt="" @click='imgBig(scope.row.pics,index1)' style="width: 30px;height: 30px;">
                                                <div class="pa full flex-box middle text-white f16 zero event-none" style='background:rgba(0,0,0,0.3);' v-if='index1==7'>共{{scope.row.pics.length}}张</div>
                                            </div>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="user_name" label="回访人">
                                </el-table-column>
                                <el-table-column prop="next_date" label="下次回访时间">
                                </el-table-column>
                            </el-table>
                        </template>
                        <div class="flex-box middle" style="margin-top:15px;" v-if="listData.length && dataDetailList.length > 5">
                            <el-button type="primary" size="small" @click="moreFn">{{moreWord}}<i :class="moreIcon" style="margin-left:8px;"></i></el-button>
                        </div>
                    </div>
                    <el-form-item class="el-titles">
                        业主信息
                    </el-form-item>
                    <div class="el-item-cons no-top">
                        <el-row :gutter="20">
                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <div class="grid-content bg-purple">
                                    <el-form style="margin:0 auto;width:85%" ref="ruleForm" label-width="100px" size="small">
                                        <el-form-item label="业主信息：">
                                            <el-input v-model="infoForm.name" placeholder="请输入业主姓名" style="width:30%;"></el-input>
                                            <el-radio v-model="infoForm.sex" :label="1">男</el-radio>
                                            <el-radio v-model="infoForm.sex" :label="2">女</el-radio>
                                        </el-form-item>
                                        <el-form-item label="手机号码：">
                                            <el-input v-model="infoForm.phone" placeholder="请输入业主手机号码" style="width:30%;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="QQ号：">
                                            <el-input v-model="infoForm.qq" placeholder="请输入QQ号码" style="width:30%;"></el-input>
                                        </el-form-item>
                                        <el-form-item label="楼盘：">
                                            <el-autocomplete class="inline-input" v-model="infoForm.community" :fetch-suggestions="querySearchAsync1" placeholder="请输入楼盘"
                                                :trigger-on-focus="false" valueKey='name' @select="handleSelect1"></el-autocomplete>
                                        </el-form-item>
                                        <el-form-item label="详细地址：">
                                            <div style="display:flex;">
                                                <city-options :province='infoForm.province_id' :city='infoForm.city_id' @syncProvince='provinceChange' @syncCity='cityChange'
                                                    style="display:inline-block;"></city-options>
                                            </div>
                                            <div>
                                                <el-input v-model="infoForm.address" placeholder="请输入详细地址" style="max-width:80%;"></el-input>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="装修户型：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.house_type" :label="v.id" v-for="v,index in house_type" :key="v.id">{{v.name}}</el-radio>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="装修类型：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.decorate_type" :label="v.id" v-for="v,index in decorate_type" :key="v.id">{{v.name}}</el-radio>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="收房/装修：">
                                            <el-date-picker v-model="infoForm.deliver_date" type="date" placeholder="选择收房时间">
                                            </el-date-picker>
                                            <el-date-picker v-model="infoForm.decorate_date" type="date" placeholder="选择装修时间">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="面积：">
                                            <el-input v-model="infoForm.specific_area" placeholder="请输入面积" style='max-width:60%'>
                                                <template slot="append">㎡</template>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="施工类型：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.cooperate_mode" :label="1">全包</el-radio>
                                                <el-radio v-model="infoForm.cooperate_mode" :label="2">半包</el-radio>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="装修原因：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.decorate_reason" :label="1">婚房</el-radio>
                                                <el-radio v-model="infoForm.decorate_reason" :label="2">自住</el-radio>
                                                <el-radio v-model="infoForm.decorate_reason" :label="3">出租</el-radio>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="装修预算：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.decorate_money" :label="1">简装</el-radio>
                                                <el-radio v-model="infoForm.decorate_money" :label="2">中档</el-radio>
                                                <el-radio v-model="infoForm.decorate_money" :label="3">高档</el-radio>
                                                <el-radio v-model="infoForm.decorate_money" :label="4">奢华</el-radio>
                                            </div>
                                            <div class="">
                                                <el-input v-model="infoForm.decorate_specific_money" placeholder="请输入装修预算" style='max-width:60%'>
                                                    <template slot="append">元</template>
                                                </el-input>
                                            </div>

                                        </el-form-item>
                                        <el-form-item label="装修风格：">
                                            <el-checkbox-group v-model="infoForm.style">
                                                <el-radio v-model="infoForm.style" v-for="v,index in data.type_list" :label="index" :key="index">{{v}}</el-radio>
                                            </el-checkbox-group>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <div class="grid-content bg-purple">
                                    <el-form style="margin:0 auto;width:85%" label-width="100px" size="small">
                                        <el-form-item label="设计时间：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.design_begin" :label="v.id" v-for="v,index in design_begin" :key="index">{{v.name}}</el-radio>
                                            </div>
                                            <el-date-picker v-model="infoForm.design_specific_begin" type="date" placeholder="选择日期">
                                            </el-date-picker>
                                        </el-form-item>
                                        <el-form-item label="年龄段：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.age_group" :label="v.id" v-for="v,index in age_group" :key="index">{{v.name}}</el-radio>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="身份职业：">
                                            <el-select v-model="infoForm.identity_career" placeholder="请选择身份职业">
                                                <el-option
                                                    v-for="item,index in data.identity_career"
                                                    :key="index"
                                                    :label="item"
                                                    :value="Number(index)">
                                                </el-option>
                                            </el-select>
                                            <el-input v-model="infoForm.identity_career_specific" placeholder="其他" style="max-width:200px;"></el-input> <!-- v-if="showWorkElse"-->
                                            <!--<div class="ml_15">
                                                <el-radio v-model="infoForm.identity_career" :label="index" v-for="v,index in identity_career" :key="index">{{v.name}}</el-radio>
                                            </div>-->

                                        </el-form-item>
                                        <el-form-item label="性格：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.person_character" :label="v.id" v-for="v,index in person_character" :key="index">{{v.name}}</el-radio>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="兴趣爱好：">
                                            <div class="ml_15">
                                                <el-radio v-model="infoForm.hobby" :label="index+1" v-for="v,index in hobby" :key="index">{{v}}</el-radio>
                                            </div>
                                            <div>
                                                <el-input v-model="infoForm.hobby_specific" placeholder="其他" style="max-width:60%;"></el-input>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="家庭情况：">
                                            <div class="ml_15">
                                                <el-checkbox-group v-model="infoForm.family_information">
                                                    <el-checkbox v-for="v,index in family_information" :label="index+1" :key="index">{{v}}</el-checkbox>
                                                </el-checkbox-group>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="子女：">
                                            <el-radio v-model="infoForm.children" :label="index" v-for="v,index in children" :key="index">{{v.name}}</el-radio>
                                            <div>
                                                <el-input v-model="infoForm.children_specific" placeholder="其他" style="max-width:60%;">
                                                    <template slot="append">个</template>
                                                </el-input>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="居住情况：">
                                            <el-radio v-model="infoForm.living_conditions" :label="index+1" v-for="v,index in living_conditions" :key="index">{{v}}</el-radio>
                                            <div>
                                                <el-input v-model="infoForm.living_conditions_specific" placeholder="其他" style="max-width:60%;">
                                                    <template slot="append">人</template>
                                                </el-input>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="特殊要求：">
                                            <el-checkbox-group v-model="infoForm.special_requirements">
                                                <el-checkbox v-for="v,index in special_requirements" :label="index+1" :key="index">{{v}}</el-checkbox>
                                            </el-checkbox-group>

                                        </el-form-item>
                                        <el-form-item label="备注：">
                                            <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 12}" placeholder="请输入备注" v-model="infoForm.description">
                                            </el-input>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </el-col>
                        </el-row>
                        <el-form class="flex-box middle-j subBtn">
                            <el-button type="primary" size="medium" @click="addForm" style="margin-right:30px;">保 存</el-button>
                        </el-form>
                    </div>
                    <el-form-item class="el-titles">用户画像
                        <span style="color:red;">（数据仅供参考，请以实际回访内容为准！）</span>
                    </el-form-item>
                    <div class="el-item-cons" v-if="data.big_data" style="padding-top: 0;">
                        <span v-if="data.big_data.bigDataAppList.vitalityStar">
                            <span>活跃度：</span>
                            <i class="el-icon-star-on color-red" v-for="i in data.big_data.bigDataAppList.vitalityStar" :key="i"></i>
                            <i class="el-icon-star-on" v-for="i in 5-data.big_data.bigDataAppList.vitalityStar" :key="i" style="color:#b5b5b5"></i>
                        </span>
                        <span>
                            <span>&nbsp;&nbsp;用户性别：</span>
                            <span v-if="data.big_data.bigDataAppList.sex == 1">男</span>
                            <span v-if="data.big_data.bigDataAppList.sex == 1">女</span>
                            <span v-else>暂无</span>
                        </span>
                        <div style="margin:10px 0;" v-if="userPortraitData.length">
                            <span>用户关注：</span>
                            <ve-bar :data="chartData" :settings="chartSettings" :colors='colors'></ve-bar>
                        </div>
                        <div style="margin:10px 0;" v-if="data.big_data.bigDataAppList.userProfile && data.big_data.bigDataAppList.userProfile.length">
                            <span>用户标签：</span>
                            <el-button type="primary" size="mini" round v-for="val in data.big_data.bigDataAppList.userProfile" :key="val.key">{{val.key}}</el-button>
                        </div>
                    </div>
                    <el-form-item class="el-titles" v-if='data.crm_show_status==1 && $.userInfo.company_id != 113723'>预约详情</el-form-item>
                    <table class="el-item-cons table-border noPadding" style="font-size:14px;width:100%;" v-if="data.apply_info&&data.crm_show_status==1&& $.userInfo.company_id != 113723">
                        <td style="width:33%;">
                            <tr>
                                <span>联系人：{{data.apply_info.name}}</span>

                            </tr>
                            <tr>
                                <span>来源：</span>
                                <i class="iconfont" v-if="data.apply_info.app_type=='ios'&&data.apply_info.resource==1" style="color:#b5b5b5">&#xe601;</i>
                                <i class="iconfont" v-if="data.apply_info.app_type=='android'&&data.apply_info.resource==1" style="color:#b5b5b5">&#xe627;</i>
                                <i class="iconfont" v-if="data.apply_info.resource==2" style="color:#b5b5b5">&#xe66b;</i>
                                <i class="iconfont" v-if="data.apply_info.resource==3" style="color:#b5b5b5">&#xe627;</i>
                                <i class="iconfont" v-if="data.apply_info.resource==5" style="color:#b5b5b5">&#xe622;</i>
                                <span v-if='data.apply_info.resource==4'>CRM</span>
                                <span v-if='data.apply_info.resource==5 || data.apply_info.resource==6'>{{data.apply_info.xcxapp}}小程序</span>
                                <span>{{data.apply_info.app_identifier}}
                                    <span v-if="data.apply_info.enter_url && data.apply_info.resource==2">
                                        <a :href="data.apply_info.enter_url" class="a-hover" target="_blank">{{data.apply_info.enter_url}}</a>
                                    </span>
                                </span>
                                <a :href="data.apply_info.share_url" target="_blank" v-if="data.apply_info.app_ico">
                                    <img :src="data.apply_info.app_ico" style="width:20px;display:block;float:right;margin-top:7px;margin-right:20px;">
                                </a>
                            </tr>
                            <tr>
                                <span>预约类型：{{data.apply_info.enter_type}}</span>
                            </tr>
                            <tr>
                                <span v-if="data.apply_info.userid">USERID：{{data.apply_info.userid}}</span>
                                <span v-else>USERID：暂无</span>
                            </tr>
                            <tr>
                                <span>小区：{{data.apply_info.community}}</span>
                            </tr>

                        </td>
                        <td style="width:33%;">
                            <tr>
                                <span>联系方式：{{data.apply_info.phone}}
                                    <span v-if="data.apply_info.phone_type || data.apply_info.location_city">({{data.apply_info.phone_type}}{{data.apply_info.location_city}})</span>
                                </span>
                                <span v-if="data.apply_info.isblack==1">【疑似诈骗】</span>
                            </tr>
                            <tr>
                                <span>预约时间：{{data.apply_info.add_date}}</span>
                            </tr>
                            <tr>
                                <span v-if="data.apply_info.src_info">预约信息：{{data.apply_info.src_info}}</span>
                                <span v-else>预约信息：暂无</span>
                            </tr>
                            <tr>
                                <span v-if="data.apply_info.ja_uuid==''">JA_UUID：暂无</span>
                                <span v-else>JA_UUID：{{data.apply_info.ja_uuid}}</span>
                            </tr>
                            <tr>
                                <span></span>
                            </tr>
                        </td>
                        <td style="width:33%;">
                            <tr>
                                <span>城市：{{data.apply_info.location}}</span>
                            </tr>
                            <tr>
                                <span>IP定位：{{data.apply_info.ip_address}}</span>
                            </tr>
                            <tr>
                                <span>预算/元：{{data.apply_info.budget}}</span>
                            </tr>
                            <tr>
                                <span>面积/㎡：{{data.apply_info.area}}</span>
                            </tr>
                            <tr>
                                <span></span>
                            </tr>
                        </td>
                    </table>
                </el-form>
            </div>
        </div>
        <el-dialog
            :title="if_valid == 10 ? '提示' : '评价'"
            :visible.sync="dialogVisible"
            width="30%">
            <span v-if="if_valid == 10">确定将客户设为有装修需求吗？</span>
            <div v-else>
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入说明信息" v-model="valid_reason"></el-input>
                <p style="margin-top: 10px;">您的反馈将有助于我们将服务做的更好。</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitDemand">{{if_valid == 10 ? '确 定' : '提 交'}}</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <transition name='slide-scale'>
            <el-carousel :autoplay='false' arrow="always" class="pf zero full bigImgs tran" v-if='imgs.show' :initial-index='imgs.now'>
                <span class="no-select pa closeImg flex-box middle" @click='closeImg'>X</span>
                <el-carousel-item v-for="(item,index) in imgs.list" :key="index">
                    <div class="flex-box full middle">
                        <img v-lazy="item.full_big_url" class="full" alt="" style="object-fit:contain;background-color:transparent!important;">
                    </div>
                </el-carousel-item>
            </el-carousel>
        </transition>
    </div>
</template>

<style scoped>
    .el-form-item {
        margin-bottom: 10px;
    }

    .el-item-cons {
        font-size: 14px;
    }

    .subBtn {
        margin-bottom: 20px;
    }

    .no-top {
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 0;
        padding-bottom: 0;
    }

    .bg-purple:first-child {
        border-right: 1px solid #e6ebf5;
    }

    .table-border {
        border-top: 1px solid #e6ebf5;
    }

    td:nth-child(2) {
        border-left: 1px solid #e6ebf5;
        border-right: 1px solid #e6ebf5;
    }

    tr {
        line-height: 35px;
        display: block;
    }

    tr span {
        margin-left: 15px;
    }

    td tr:not(:last-of-type) {
        border-bottom: 1px solid #e6ebf5;
    }

    .noPadding {
        padding: 0;
    }

</style>
<script>
    import {
        limitUpload
    } from '@/mixins/index';
    import cityOptions from '@/components/block/city';
    import bus from '../../state'
    var self, uLoading;
    export default {
        data() {
            return {
                limit:6,
                // loading: false,
                // uploadData: {
                //     module: 'store',
                //     type: 'image'
                // },
                // fileList1: [],
                // dialogVisible1: false,


                colors: ['#c23431'],
                countDownDate:'', // daojishi
                data: '',
                listData:[],// 当前显示的回访数据
                originalDataDetailList:[], // 原始回访数据
                dataDetailList: [], // 展开显示全部的数据
                moreIcon:'el-icon-arrow-down',
                time: '', // 回访的具体时间
                loading: false,
                more: false,
                moreWord:'展开',
                cutDown:'',
                imgs: {
                    list: [],
                    show: false,
                    now: 0,
                },
                imgType: true,
                query: {
                    id: '',
                    status: "",
                    degree: "0", //重要度：1-5星
                    des: '', //回访描述内容
                    next_date: '', //下次回访日期
                    hour: '-1', //下次回访时间的小时
                    minute: '0', //下次回访时间的分钟
                    deal_price: '',
                    deal_time: '',
                    pics:[]
                },
                listUrl: '',
                userPortraitData: [], // 用户画像
                sex: "1",
                placeholder: '请输入跟进内容！',
                textareaVal: '',
                province: '',
                city: '',
                // showWorkElse: false,// 控制显示影藏其他职业
                if_valid: '0', // 有无需求 1 无需求 10 有需求
                valid_reason:'',
                dialogVisible: false,
                house_type: [{
                    id: 2,
                    name: '一居室'
                }, {
                    id: 4,
                    name: '二居室'
                }, {
                    id: 7,
                    name: '三居室'
                }, {
                    id: 9,
                    name: '四居室'
                }, {
                    id: 10,
                    name: '跃层'
                }, {
                    id: 11,
                    name: '公寓'
                }, {
                    id: 12,
                    name: '小户型'
                }, {
                    id: 15,
                    name: '复式'
                }, {
                    id: 16,
                    name: '别墅'
                }, {
                    id: 51,
                    name: 'LOFT'
                }],
                decorate_type: [{
                    id: 1,
                    name: '新房/毛坯房'
                }, {
                    id: 2,
                    name: '二手房/整体翻新'
                }, {
                    id: 3,
                    name: '局部翻新'
                }, {
                    id: 4,
                    name: '其他'
                }],
                design_begin: [{
                    id: 1,
                    name: '2-3个月'
                }, {
                    id: 2,
                    name: '3-6个月'
                }, {
                    id: 3,
                    name: '6个月以上'
                }],
                age_group: [{
                    id: 1,
                    name: '≤25岁'
                }, {
                    id: 2,
                    name: '26~35岁'
                }, {
                    id: 3,
                    name: '36~45岁'
                }, {
                    id: 4,
                    name: '>45岁'
                }],
                identity_career: [{
                    id: 1,
                    name: '老师'
                }, {
                    id: 1,
                    name: '医生'
                }, {
                    id: 1,
                    name: '建筑行业'
                }, {
                    id: 1,
                    name: '销售'
                }, {
                    id: 1,
                    name: '商人'
                }],
                person_character: [{
                    id: 1,
                    name: '热情随和'
                }, {
                    id: 2,
                    name: '果断爽快'
                }, {
                    id: 3,
                    name: '命令威胁'
                }, {
                    id: 4,
                    name: '消极抵制'
                }, {
                    id: 5,
                    name: '优柔寡断'
                }, {
                    id: 6,
                    name: '自信严谨'
                }],
                hobby: [
                    '健身', '钢琴', '书法', '音乐'
                ],
                family_information: [
                    '已婚', '有车', '有宠物', '有老人', '少数民族'
                ],
                special_requirements: [
                    '重视设计', '重视环保', '重视养生保健', '贷款装修'
                ],
                children: [{
                    id: -1,
                    name: '无'
                }, {
                    id: 1,
                    name: '1个'
                }, {
                    id: 2,
                    name: '2个'
                }, {
                    id: 3,
                    name: '≥3个'
                }],
                living_conditions: ['单身', '小两口', '三口之家', '五口之家'],
                infoForm: {
                    name: '',
                    sex: '',
                    phone: '',
                    qq: '',
                    community: '', // 楼盘
                    province_id: '0',
                    city_id: '0',
                    house_type: '', // 户型
                    decorate_type: '', // 装修类型
                    deliver_date: '', // 收房时间
                    decorate_date: '', // 装修时间
                    specific_area: '', //面积
                    cooperate_mode: '', //施工类型
                    decorate_reason: '', //装修原因
                    decorate_money: '', //预算
                    check: [], //风格
                    design_begin: '', //设计时间
                    design_specific_begin: '', //设计时间
                    style: [], // 装修风格

                    age_group: '', //年龄段
                    identity_career: '', // 职业
                    identity_career_specific: '', // 职业（其他）
                    person_character: '', // 性格
                    hobby: '', // 爱好
                    hobby_specific: '', // 爱好（其他）
                    family_information: [], // 家庭情况
                    children: '', // 子女
                    children_specific: '', // 子女人数
                    living_conditions: '', //居住情况
                    living_conditions_specific: '', // 居住情况renshu
                    special_requirements: [], //特殊要求
                    special_requirements_specific: '', //特殊要求（其他）
                    description: '' // 备注
                },
                rules: {
                    // status: [
                    //     { required: true, message: '请选择状态', trigger: 'change,blur' }
                    // ],
                    des: [
                        { required: true, message: '请输入输入描述', trigger: 'blur' }
                    ],
                    deal_price:[
                        { required: true, message: '请输入成交金额', trigger: 'change,blur' }
                    ],
                    deal_time: [
                        { required: true, message: '请选择签约时间', trigger: 'blur,change' }
                    ],
                    degree: [
                        {
                            validator: (rule, value, callback) => {
                                if (value == '0') {
                                    callback(new Error('请为线索标记意向强弱！'));
                                }else {
                                    callback();
                                }
                            },
                            trigger: 'blur,change'
                        }
                    ]
                }
            }
        },
        created() {
            self = this;
            var userInfo = JSON.parse(this.$localStorage.get('userInfoM'));
            console.log("用户信息", userInfo)
            // this.source_type = userInfo.info.crm_sync_status;
            this.$route.query.resource == 1 || this.$route.query.resource == 3 ? this.listUrl = 'clue/transform/get' : this.listUrl = 'clue/appoint/get'; // = 0 东易  =1 普通
            this.getData()
            self.chartSettings = {
                metrics: ['权重'],
                dataOrder: {
                    label: '权重',
                    order: 'desc'
                }
            }
        },
        mixins: [limitUpload],
        watch: {
            if_valid (n,o) {
                this.dialogVisible = true;
            },
            time(newVal, oldVal) {
                var timeArray = newVal.split(':')
                this.$set(this.query, 'hour', parseInt(timeArray[0]));
                this.$set(this.query, 'minute', timeArray[1] === '00' ? 1 : 2);
                console.log(this.query.hour, this.query.minute)
            },
            'infoForm.valid_date'(n,o) {
                // self.getData()
            },
            'query.status' (newVal,oldVal) {
                if (this.query.status != 3) {
                    this.query.des = ''
                }
                if(newVal != oldVal && newVal != '3'){
                    this.$refs['query'].resetFields();
                }

            },
            'query.next_date'(newVal, oldVal){
                if (newVal) {
                    this.time = '10:00'
                }
            },
            'infoForm.identity_career'(newVal, oldVal) {
                // if (newVal == 13) {
                //     this.showWorkElse = true;
                // } else {
                //     this.showWorkElse = false;
                // }
                if (newVal == 0) {
                    this.infoForm.identity_career = 13
                }
            }
        },
        methods: {
            getData() {
                this.$http.get(this.listUrl, {
                        params: {
                            id: this.$route.query.apply_id,
                            resource: this.$route.query.resource
                        }
                    })
                    .then(function (res) {
                        self.userPortraitData = [];
                        console.log(res.data.data)
                        self.data = JSON.parse(JSON.stringify(res.data.data));
                        // originalDataDetailList
                        self.dataDetailList = JSON.parse(JSON.stringify(res.data.data.deal_list));
                        self.originalDataDetailList = JSON.parse(JSON.stringify(
                            res.data.data.deal_list.filter(function(v,i){
                                return i < 5
                            })
                        ))
                        self.listData = JSON.parse(JSON.stringify(self.originalDataDetailList))
                        self.infoForm = JSON.parse(JSON.stringify(res.data.data.transform_info));
                        self.countDownData = self.infoForm.valid_date;

                        clearInterval(self.cutDown)

                        if (self.infoForm.valid_date) {
                            self.cutDown = setInterval(function(){
                                self.$set(self.infoForm,'valid_date',Number(self.infoForm.valid_date) - 1);
                                if (!self.infoForm.valid_date) {
                                    clearInterval(self.cutDown)
                                }
                            },1000)
                        }
                        self.query.id = res.data.data.transform_info.id
                        if (res.data.data.transform_info.status == 3) {
                            self.query.des = res.data.data.transform_info.remark || ''
                        }
                        if (res.data.data.transform_info.status == 1) {
                            self.query.degree = res.data.data.transform_info.degree || ''
                        }
                        self.query.status = res.data.data.transform_info.status.toString() || ''

                        // 用户画像柱状图的数据
                        res.data.data.big_data.bigDataKey.forEach(function (v, i) {
                            var obj = new Object();
                            obj['类型'] = v;
                            res.data.data.big_data.bigDataValue.forEach(function (val, index) {
                                console.log(v, i)
                                if (index == i) {
                                    obj['权重'] = val
                                }
                            })
                            self.userPortraitData.push(obj);
                        })
                        self.chartData = {
                            columns: ['类型', '权重'],
                            rows: self.userPortraitData
                        }
                        bus.$emit('reloadMeun')
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            // 提交需求
            submitDemand () {
                var obj = {
                    transform_id: self.infoForm.id,
                    if_valid: self.if_valid,
                    valid_reason: self.valid_reason
                }
                this.$http.post('clue/set/valid', obj)
                    .then(function (res) {
                        if (res.data.code == '1000') {
                            obj.transform_id = '';
                            obj.if_valid = '';
                            obj.valid_reason = '';
                            self.dialogVisible = false;
                            self.getData();
                            self.$message({
                                message: '提交成功！',
                                type: 'success'
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            closeImg() {
                this.imgs.show = false;
            },
            imgBig(obj, index) {
                if (obj) {
                    this.imgs.list = obj;
                    this.imgs.show = true;
                    this.imgs.now = index;
                }
            },
            // 回访图片上传
            // beforeAvatarUploadLodingerweima(file) {
            //     this.imgType = true;
            //     const isJPG = file.name.split('.')[1] === 'jpeg';
            //     const isJPEG = file.name.split('.')[1] === 'jpg';
            //     const isPNG = file.name.split('.')[1] === 'png';
            //     const isGIF = file.name.split('.')[1] === 'gif';
            //     const isIco = file.name.split('.')[1] === 'ico';
            //     // const isLt2M = file.size / 1024 / 200 <= 1;
            //     // console.log(isJPG,isJPEG,isPNG,isGIF)

            //     if (isJPG || isJPEG || isPNG || isGIF || isIco) {} else {
            //         this.imgType = false;
            //         this.$message.error('上传图片只能是 JPG,JPEG,PNG,ico 格式!');
            //         return this.imgType;
            //     }
            //     console.log('this.fileList1.length',this.fileList1.length)
            //     if(this.fileList1.length == 6){
            //         this.imgType = false;
            //         this.$message.error('二维码最多上传6张！');
            //         return this.imgType;
            //     }
            //     if (this.imgType) {
            //         uLoading = this.$loading({
            //             background: 'rgba(255,255,255,.2)',
            //             text: '拼命上传中...'
            //         });
            //     }
            //     return this.imgType;
            // },
            // handleAvatarSuccess1(res, file) {
            //     this.uploadCloseLoding();
            //     var that = this;
            //     this.dialogVisible1 = false;
            //     var v = res.data[0];
            //     var n = that.fileList1.length - 1;
            //     if(n<0){
            //         n=0;
            //     } else {
            //         n = that.fileList1.length;
            //     }
            //     this.fileList1[n] = {
            //         url: v.preview
            //     };

            //     that.query.pics = [];
            //     this.fileList1.forEach(function(v,i){
            //         that.query.pics.push(v.url)
            //     })
            //     console.log('提交图片1-1-1',this.query.pics)


            // },
            // handleRemove1(file, fileList) {
            //     console.log(file, fileList, self.fileList1);
            //     if(this.imgType){
            //         self.query.pics = [];
            //         self.fileList1 = [];
            //         fileList.forEach(function(v,i){
            //             self.query.pics.push(v.url)
            //             self.fileList1.push({
            //                 url: v.url
            //             })
            //         })
            //         console.log('删除之后提交图片',this.query.pics)
            //         this.query.pics = JSON.stringify(this.query.pics);
            //     }

            // },
            // uploadCloseLoding() {
            //     uLoading.close();
            // },
            // 查看更多记录
            moreFn(){
                // more true(展开状态) false(收起状态)
                if (this.more) { //
                    this.more = false
                    this.moreWord = "展开"
                    this.listData = this.originalDataDetailList
                    this.moreIcon = 'el-icon-arrow-down';
                } else { // 需要展开
                    this.more = true;
                    this.moreWord = "收起"
                    this.listData = this.dataDetailList;
                    this.moreIcon = 'el-icon-arrow-up';

                }
            },
            changeDegreeFn(v) {
                this.query.degree = v
            },
            provinceChange(v) {
                this.infoForm.province_id = v;
                setTimeout(() => {
                    this.$refs.ruleForm.validateField('city_id');
                })
            },
            cityChange(v) {
                this.infoForm.city_id = v;
            },
            // 添加回访
            addDealFn(formName) {
                var _self = this;
                console.log("提交数据", this.query)
                this.query.pics = this.qrcode;
                if (this.query.status == '0') {
                    _self.$message.error('跟进状态不能为空 !');
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.$http.post('clue/deal/creat', this.query)
                                .then(function (res) {
                                    _self.query.des = '';
                                    if (res.data.code == '1000') {
                                        _self.getData()
                                        _self.query.pics = []; // 置空回访记录图片
                                        _self.fileList1 = [];
                                        bus.$emit('reloadMeun')
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        }
                    })
                }
            },
            clickButton(e) {
                console.log("点击：", e)
                this.query.des = e.target.innerText
            },
            querySearchAsync1(queryString, cb) {
                // if(this.infoForm.province && this.infoForm.city){
                var that = this;
                if (queryString) {
                    this.$http.get('common/building/search', {
                        params: {
                            name: queryString,
                        }
                    }).then(res => {
                        var d;
                        if (res.codeFlag) {
                            d = res.data.data.list;
                        }
                        cb(d);
                    })
                }
                // } else {
                //   this.$message({
                //       message: '请先选择城市',
                //       type: 'warning'
                //   });
                // }

            },
            handleSelect1(item) {
                console.log("选择楼盘", item)
                this.infoForm.province_id = item.province;
                this.infoForm.city_id = item.city;
                this.infoForm.address = item.name;
            },
            //修改保存业主信息
            addForm() {
                console.log("业主信息：", this.infoForm)
                if (this.infoForm.identity_career != 13) {
                    this.infoForm.identity_career_specific = "";
                }
                this.$http.post('clue/transform/update', this.infoForm)
                    .then(res => {
                        console.log('修改业主信息成功', res)
                        if (res.data.code == '1000') {
                            self.getData()
                        }
                    })
            },
            // 取消保存
            cancleForm() {

            },
        },
        components: {
            cityOptions
        }
    }

</script>
