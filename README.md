# 《全栈学习记录》

> 本文档时是作者从事前端开发以来的学习历程，旨在记录和整理自己的学习过的知识，同时也希望把学习的一些经验总结分享给大家，如果本文能为您提供帮助，请给予 Star ！

**如何支持：**
- 点击右上角Star :star: 给予关注
- 分享给您身边更多的小伙伴

> **作者：** Mr.Gong，前端全栈工程师，[个人博客](https://gongyz.cn)。

## 技术栈目录

* [`JavaScript`](/javascript/closure.md)
* [`Node.js`](/node/base.md)
* [`React Native`](/react-native/sign-package.md)
* [`DevOps`](/docker/base.md)
* [`DataBase`](/database/mongodb.md)

## 转载分享

建立本开源项目的初衷是基于个人学习与工作中对前端相关技术栈的总结记录，在这里也希望能帮助一些在学习前端过程中遇到问题的小伙伴，如果您需要转载本仓库的一些文章到自己的博客，请按照以下格式注明出处，谢谢合作。

```
作者：Mr.Gong
链接：http://gongyz.gitee.io/full-stack-note
来源：Nodejs.js技术栈
```

## 参与贡献

1. 如果您对本项目有任何建议或发现文中内容有误的，欢迎提交 issues 进行指正。
2. 对于文中我没有涉及到知识点，欢迎提交 PR。
3. 如果您有文章推荐请以 markdown 格式到邮箱 `qzfweb@gmail.com`，[中文技术文档的写作规范指南](https://github.com/ruanyf/document-style-guide)。

## Git 提交规范

使用当前较为主流的 [AngularJS 的 commit 规范](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)

每次提交，Commit message 都包括三个部分: Header，Body 和 Footer

```bash
# 注意在英文输入法下输入冒号和空格
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略

### Header

Header部分只有一行，包括三个字段: type（必需）、scope（可选）和subject（必需）

#### type

用来标识 commit 的类型，总共有以下 7 个标识: 

- feat: 新功能（feature）
- fix: 修补 bug
- docs: 文档发生修改 (documentation)
- style: 不影响代码运行的更改（空格，格式，缺少分号等）
- refactor: 重构（即不是新增功能，也不是修改bug的代码变动）
- test: 添加或修改测试用例
- build: 主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交 
- revert: 回滚某个更早之前的提交 
- chore: 除上述之外的修改
- merge: 分支合并 Merge branch ? of ? 

#### scope

用来标识改动所影响的范围，视项目而定

#### subject

改动的简短描述，不超过 50 字符长度

### Body

本次 commit 的详细描述

### Footer

主要用于两种情况: 

- 重大的不兼容改动: 用于给出改动说明及解决方案。
- 关联 issues: 用于关闭相应 issues