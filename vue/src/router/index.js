import Vue from 'vue'
import Router from 'vue-router'
import Com from '@/components/block/Com'
import $ from '@/util';

Vue.use(Router)
Vue.use($)

export default new Router({
    routes: [{
            path: '/login',
            name: 'login',
            meta: {
                title: '登录'
            },
            component: () =>
                import ('@/components/login')
        }, {
            path: '/fastLogin',
            name: 'fastLogin',
            meta: {
                title: '穿透登录'
            },
            component: () =>
                import ('@/components/fastLogin')
        },
        {
            path: '/',
            name: 'hello',
            meta: {
                title: '首页'
            },
            component: Com,
            children: [{
                path: '/',
                meta: {
                    title: 'hello'
                },
                component: () =>
                    import ('@/components/hello')
            }]
        },

        //公司信息
        {
            path: '/company',
            redirect: '/company/info',
            meta: {
                title: '装修公司管理'
            },
            component: Com,
            children: [{
                path: 'info',
                meta: {
                    title: '我的网铺'
                },
                component: () =>
                    import ('@/components/company/basicInfo')
            }, {
                path: 'desc',
                meta: {
                    title: '公司简介'
                },
                component: () =>
                    import ('@/components/company/companyProfile')
            }, {
                path: 'serviceinfo',
                meta: {
                    title: '服务信息'
                },
                component: () =>
                    import ('@/components/company/serviceinfo')
            },{
                path: 'ranking',
                meta: {
                    title: '指数排行'
                },
                component: () =>
                    import ('@/components/company/ranking')
            },{
                path: 'dataform',
                meta: {
                    title: '数据看板'
                },
                component: () =>
                    import ('@/components/company/dataform')
            },{
                path: 'store/list',
                meta: {
                    title: '门店管理'
                },
                component: () =>
                    import ('@/components/company/storeList')
            }, {
                path: 'store/add',
                meta: {
                    title: '新增门店信息',
                    light: '/company/store/list'
                },
                component: () =>
                    import ('@/components/company/addStore')
            }]
        },

        //案例管理
        {
            path: '/case',
            name: 'case',
            redirect: '/case/list',
            meta: {
                title: '案例管理'
            },
            component: Com,
            children: [{
                path: 'list',
                meta: {
                    title: '案例列表'
                },
                component: () =>
                    import ('@/components/case/listCase')
            }, {
                path: 'designer/list',
                meta: {
                    title: '设计师管理'
                },
                component: () =>
                    import ('@/components/case/listDesigner')
            }, {
                path: 'designer/add',
                meta: {
                    title: '添加设计师',
                    light: '/case/designer/list'
                },
                component: () =>
                    import ('@/components/case/addDesigner')
            }, {
                path: 'add',
                meta: {
                    title: '添加案例',
                    light: '/case/list'
                },
                component: () =>
                    import ('@/components/case/editCase/addCase')
            }, {
                path: 'add_pic',
                meta: {
                    title: '编辑案例图片',
                    light: '/case/list'
                },
                component: () =>
                    import ('@/components/case/editCase/addPic')
            }, {
                path: 'add_house',
                meta: {
                    light: '/case/list',
                    title: '编辑户型图片',
                },
                component: () =>
                    import ('@/components/case/editCase/addHouse')
            }, {
                path: 'building/list',
                meta: {
                    title: '楼盘管理'
                },
                component: () =>
                    import ('@/components/case/listBuilding')
            }, {
                path: 'building/add',
                meta: {
                    title: '添加楼盘',
                    light: '/case/building/list'
                },
                component: () =>
                    import ('@/components/case/addBuilding')
            }, {
                    path: 'panorama/list',
                meta: {
                    title: '全景案例管理',
                },
                component: () =>
                    import('@/components/case/panoramicCase')
            }, {
                path: 'panorama/add',
                meta: {
                    title: '添加全景案例',
                    light: '/case/panorama/list'
                },
                component: () =>
                    import('@/components/case/addPanoramicCase')
            }]
        },

        // 网站管理
        {
            path: '/site',
            redirect: '/site/modular/list',
            meta: {
                title: '网站管理'
            },
            component: Com,
            children: [{
                path: 'modular/list',
                meta: {
                    title: '模块列表'
                },
                component: () =>
                    import ('@/components/web/moduleList')
            }, {
                path: 'modular_data_list',
                meta: {
                    title: '列表',
                    light: '/site/modular/list'
                },
                component: () =>
                    import ('@/components/web/modularDataList')
            }, {
                path: 'add_banner',
                meta: {
                    title: '添加动态模板数据',
                    light: '/site/modular/list'
                },
                component: () =>
                    import ('@/components/web/addBanner')
            }, {
                path: 'channel/list',
                meta: {
                    title: '频道列表'
                },
                component: () =>
                    import ('@/components/web/channelList')
            }, {
                path: 'channel/add_channel',
                meta: {
                    title: '添加频道',
                    light: '/site/channel/list'
                },
                component: () =>
                        import('@/components/web/addChannel')
            }, {
                    path: 'channel/customPage',
                meta: {
                    title: '自定义页面管理',
                    light: '/site/channel/customPage'
                },
                component: () =>
                    import('@/components/web/customPage')
            }, {
                    path: 'channel/customDrag',
                meta: {
                    title: '自定义页面管理',
                    light: '/site/channel/customPage'
                },
                component: () =>
                    import('@/components/web/customDrag')
            }]
        },

        // 文章管理
        {
            path: '/story',
            redirect: '/story/list',
            meta: {
                title: '文章管理'
            },
            component: Com,
            children: [{
                path: 'list',
                meta: {
                    title: '文章列表'
                },
                component: () =>
                    import ('@/components/articles/articlelList')
            }, {
                path: 'add_article',
                meta: {
                    title: '文章信息维护',
                    light: '/story/list'
                },
                component: () =>
                    import ('@/components/articles/addAritcle')
            }, {
                path: 'tag/list',
                meta: {
                    title: 'TAG列表',
                    light: '/story/tag/list'
                },
                component: () =>
                    import('@/components/articles/tagList')
            }]
        },

        // 工程管理
        {
            path: '/construction',
            redirect: '/construction/list',
            meta: {
                title: '工程管理'
            },
            component: Com,
            children: [{
                path: 'list',
                meta: {
                    title: '工程列表'
                },
                component: () =>
                    import ('@/components/project/projectList')
            }, {
                path: 'create_project',
                meta: {
                    title: '工程信息',
                    // light: '/construction/list'
                },
                component: () =>
                    import ('@/components/project/createProject')
            }, {
                path: 'edit_project',
                meta: {
                    title: '工程信息',
                    light: '/construction/list'
                },
                component: () =>
                    import ('@/components/project/editProject')
            }, {
                path: 'edit_project_process',
                meta: {
                    title: '施工信息',
                    light: '/construction/list'
                },
                component: () =>
                    import ('@/components/project/editProject')
            }, {
                path: 'add_progress',
                meta: {
                    title: '添加工程进度'
                },
                component: () =>
                    import ('@/components/project/addProgress')
            }, {
                path: 'workerman/list',
                meta: {
                    title: '工长列表'
                },
                component: () =>
                    import ('@/components/project/workmanList')
            }, {
                path: 'add_workman',
                meta: {
                    title: '编辑工长信息',
                    light: '/construction/workerman/list'
                },
                component: () =>
                    import ('@/components/project/addWorkman')
            },{
                path: 'capital_list',
                meta: {
                    title: '收支明细',
                },
                component: () =>
                    import ('@/components/project/listCapital')
            },{
                path: 'total_capital_analyse',
                meta: {
                    title: '收入分析',
                    light: '/construction/capital_list'
                },
                component: () =>
                    import ('@/components/project/totalCapitalAnalyse')
            },{
                path: 'total_capital_analyse_zc',
                meta: {
                    title: '支出分析',
                    light: '/construction/capital_list'
                },
                component: () =>
                    import ('@/components/project/totalCapitalAnalyseZc')
            },{
                path: 'capital_type_info',
                meta: {
                    title: '收支类型详情',
                    light: '/construction/capital_list'
                },
                component: () =>
                    import('@/components/project/capitalTypeInfo') //
            },{
                path: 'capital_save',
                meta: {
                    title: '记一笔',
                    light: '/construction/capital_list'
                },
                component: () =>
                    import ('@/components/project/saveCapital')
            },{
                path: 'engineer_list',
                meta: {
                    title: '工地账本',
                },
                component: () =>
                    import ('@/components/project/listEngineer')
            },{
                path: 'engineer_info',
                meta: {
                    title: '工地明细',
                    light: '/construction/engineer_list'
                },
                component: () =>
                    import ('@/components/project/infoEngineer')
            },{
                path: 'gongdi_analyse',
                meta: {
                    title: '工地收支分析',
                    light: '/construction/engineer_list'
                },
                component: () =>
                    import ('@/components/project/gongdiAnalyse')
            },{
                path: 'gongdi_analyse_zc',
                meta: {
                    title: '工地支出分析',
                    light: '/construction/engineer_list'
                },
                component: () =>
                    import ('@/components/project/gongdiAnalyseZc')
            },{
                path: 'engineer_dynamic',
                meta: {
                    title: '工地动态'
                },
                component: () =>
                    import('@/components/project/engineerDynamic') //
            }]
        },

        // 线索管理
        {
            path: '/clue',
            redirect: '/clue/list',
            meta: {
                title: '工程管理'
            },
            component: Com,
            children: [{
                    path: 'list',
                    meta: {
                        title: '新线索列表'
                    },
                    component: () =>
                        import ('@/components/clue/crmClueList')
                },
                {
                    path: 'follow/list',
                    meta: {
                        title: '新线索列表'
                    },
                    component: () =>
                        import ('@/components/clue/crmFollowList')
                },
                {
                    path: 'clueDetail',
                    meta: {
                        title: '线索跟进详情'
                    },
                    component: () =>
                        import ('@/components/clue/clueDetail')
                },
                {
                    path: 'add_clue',
                    meta: {
                        title: '添加线索',
                        light: '/clue/follow/list'
                    },
                    component: () =>
                        import ('@/components/clue/addClue')
                },
                {
                    path: 'appoint/list',
                    meta: {
                        title: '公司新线索'
                    },
                    component: () =>
                        import ('@/components/clue/crmClueList')
                },
                {
                    path: 'appoint/follow/list',
                    meta: {
                        title: '我的线索'
                    },
                    component: () =>
                        import ('@/components/clue/crmFollowList')
                }
            ]
        },

        // 栏目管理
        {
            path: '/column',
            redirect: '/column/list',
            meta: {
                title: '栏目管理'
            },
            component: Com,
            children: [{
                    path: 'list',
                    meta: {
                        title: '栏目列表'
                    },
                    component: () =>
                        import ('@/components/column/columnList')
                }
            ]
        },

        // 独立建站
        {
            path: '/independentSite',
            redirect: '/independentSite/list',
            meta: {
                title: '独立建站'
            },
            component: Com,
            children: [{
                    path: 'list',
                    meta: {
                        title: '站点管理'
                    },
                    component: () =>
                        import ('@/components/independentSite/independentSiteList')
                },{
                    path: 'page/list',
                    meta: {
                        title: '自定义列表'
                    },
                    component: () =>
                        import ('@/components/independentSite/customList')
                },{
                    path: 'page/addCustom',
                    meta: {
                        title: '添加自定义站点',
                        light: '/independentsite/page/list'
                    },
                    component: () =>
                        import ('@/components/independentSite/addCustom')
                },{
                    path: 'code/list',
                    meta: {
                        title: '第三方代码列表'
                    },
                    component: () =>
                        import ('@/components/independentSite/codeList')
                },
                {
                    path: 'code/save',
                    meta: {
                        title: '第三方代码添加',
                        light: '/independentsite/code/list'
                    },
                    component: () =>
                        import ('@/components/independentSite/saveCode')
                },{
                    path: 'link/list',
                    meta: {
                        title: '友情链接管理'
                    },
                    component: () =>
                        import ('@/components/independentSite/linkList')
                },{
                    path: 'link/save',
                    meta: {
                        title: '添加友情链接',
                        light: '/independentsite/link/list'
                    },
                    component: () =>
                        import ('@/components/independentSite/linkSave')
                },{
                    path: 'special/list',
                    meta: {
                        title: '专题管理'
                    },
                    component: () =>
                        import ('@/components/independentSite/specialList')
                },{
                    path: 'special/save',
                    meta: {
                        title: '添加专题',
                        light: '/independentsite/special/list'
                    },
                    component: () =>
                        import ('@/components/independentSite/specialSave')
                },{
                    path: 'package/list',
                    meta: {
                        title: '套餐包管理'
                    },
                    component: () =>
                        import ('@/components/independentSite/packageList')
                },{
                    path: 'package/save',
                    meta: {
                        title: '添加套餐包',
                        light: '/independentsite/package/list'
                    },
                    component: () =>
                        import ('@/components/independentSite/packageSave')
                },{
                    path: 'package/photo',
                    meta: {
                        title: '套餐包图片列表',
                        light: '/independentsite/package/list'
                    },
                    component: () =>
                        import ('@/components/independentSite/packagePhoto')
                },
                // {
                //     path: 'verifyfile/list',
                //     meta: {
                //         title: '站点验证文件'
                //     },
                //     component: () =>
                //         import ('@/components/independentSite/verifyfileList')
                // },
                {
                    path: 'verifyfile/add',
                    meta: {
                        title: 'seo'
                    },
                    component: () =>
                        import ('@/components/independentSite/addVerifyfile')
                }
            ]
        },
		// 微信授权
        {
            path:'/xcx',
            redirect: '/xcx/auth',
            meta: {
                title: '小程序授权'
            },
            component: Com,
            children:[
                {
                    path: 'auth',
                    meta: {
                        title: '微信小程序授权'
                    },
                    component: () =>
                        import ('@/components/xcx/wxAuthorization')
                }
            ]
        },
        // 供应商管理
        {
            path: '/supplier',
            redirect: '/supplier/list',
            meta: {
                title: '供应商管理'
            },
            component: Com,
            children: [
                {
                    path: 'list',
                    meta: {
                        title: '供应商列表'
                    },
                    component: () =>
                        import ('@/components/supplier/supplierList')
                },{
                    path: 'add',
                    meta: {
                        title: '添加供应商',
                        light: '/supplier/list'
                    },
                    component: () =>
                        import ('@/components/supplier/addSupplier')
                },
                {
                    path: 'channeldealerList',
                    meta: {
                        title: '渠道商列表'
                    },
                    component: () =>
                        import ('@/components/supplier/channeldealerList')
                },{
                    path: 'addChanneldealer',
                    meta: {
                        title: '添加渠道商',
                        light: '/supplier/channeldealerList'
                    },
                    component: () =>
                        import ('@/components/supplier/addChanneldealer')
                },
                {
                    path: 'supervisorList',
                    meta: {
                        title: '监理列表'
                    },
                    component: () =>
                        import ('@/components/supplier/supervisorList')
                },{
                    path: 'addSupervisor',
                    meta: {
                        title: '添加监理',
                        light: '/supplier/supervisorList'
                    },
                    component: () =>
                        import ('@/components/supplier/addSupervisor')
                },
                {
                    path: 'linkmanList',
                    meta: {
                        title: '通讯录列表'
                    },
                    component: () =>
                        import('@/components/supplier/linkmanList')
                },
                {
                    path: 'addLinkMan',
                    meta: {
                        title: '添加联系人',
                        light: '/supplier/linkmanList'
                    },
                    component: () =>
                        import('@/components/supplier/addLinkMan')
                }
            ]
        },

        // 团队管理
        {
            path: '/team',
            redirect: '/team/list',
            meta: {
                title: '团队管理'
            },
            component: Com,
            children: [{
                    path: 'list',
                    meta: {
                        title: '团队管理'
                    },
                    component: () =>
                        import ('@/components/team/list')
                },
                {
                    path: 'save',
                    meta: {
                        title: '编辑成员',
                        light: '/team/list'

                    },
                    component: () =>
                        import ('@/components/team/save')
                }]
        },

        //im
        {
            path: '/im',
            redirect: '/im/list',
            meta: {
                title: 'IM客服'
            },
            component: Com,
            children: [{
                path: 'list',
                meta: {
                    title: '客服列表'
                },
                component: () =>
                    import ('@/components/im/list')
            }]
        }
    ]
})
