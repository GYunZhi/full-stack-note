# vue-cli安装卸载

vue-cli2.x.x 版本 安装指定版本

```bash
npm install -g vue-cli@2.x.x  
```

vue-cli2.x.x 版本卸载

```bash
npm uninstall -g vue-cli
```

vue-cli2.x.x 版本基本操作

```bash
#创建新项目
vue init webpack xxx
```

vue-cli3.x.x 版本安装
3.0 级以上版本 Vue CLI 的包名称由 vue-cli 改成了 @vue/cli

```bash
npm install -g @vue/cli
```

vue-cli3.x.x 版本卸载

```bash
npm uninstall -g @vue/cli
```

vue-cli3.x.x 版本基本操作

```bash
#创建新项目
vue create xxx

# 启动图形化界面
vue ui 
```

安装vue-cli3.x.x 版本使用vue-cli2.x.x 版本创建项目

```bash
# 安装一个桥接工具
npm install -g @vue/cli-init
```

vue-cli2.x.x 版本创建项目报错解决办法用一下命令清除缓存，重新安装即可

```bash
npm cache clean --force
```

