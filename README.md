#webpack spa 脚手架结构目录

```
├── README.md                           // 项目简介
├── app                                 // 开发目录
│   ├── font                            // 字体库
│   ├── images                          // 图片库
│   ├── js                              // 开发目录
│   │    ├── components                 // 封装vue组件
│   │    ├── stores                     // vuex
│   │    ├── utils                      // 封装JS逻辑
│   │    ├── app.vue                    // vue根页面模板
│   │    ├── entry.js                   // vue根入口
│   │    └── router.js                  // vue路由
│   ├── style                           // 样式文件
│   │     └── basic                     // scss默认文件
│   │          ├── defalut.scss         // 默认样式
│   │          ├── mixins.scss          // 混合宏
│   │          ├── normalize.scss       // 清理浏览器默认样式
│   │          └── variables.scss       // 初始化变量
│   ├── dev.html                        // 开发html模板
│   ├── index.html                      // 正式html模板
├── build                               // 打包项目配置
│   ├── sever.js                        // node服务
│   ├── webpack.base.conf.js            // webpack默认配置
│   ├── webpack.dev.conf.js             // webpack开发配置
│   ├── webpack.prod.conf.js            // webpack打包配置
│   └── webpack.dll.config.js           // 抽出公共打包配置
├── .babelrc                            // es6编译es5配置文件
├── .editorconfig                       // esLint代码规范检查
├── .eslintrc                           // js代码检查规则
├── .prettierrc                         // 代码格式化规则
├── ip.js                               // 获取本地ip地址
├── package.json                        // js插件库版本，项目配置文件
├── postcss.config.js                   // postcss配置文件
└── upload.js                           // 项目自动上传oss脚本
```

##项目运行

```
npm start
```

##抽取项目公共组件

```
npm run permanent
```

##项目打包

```
npm run build
```

##获取本地 ip

```
npm run ip
```

##清理 dist 文件

```
npm run clean
```

##路由传参方式

#post;

```
this.$router.push({
    name: 'test',
    params: { orderId: 123 }
});

//接收
this.$route.params.orderId
```

#get

```
this.$router.push({
    path: 'test',
    query: { orderId: ['123', '12312'] }
});

//接收
this.$route.query.orderId

```
