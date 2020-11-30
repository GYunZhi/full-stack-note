

# 团队开发中的 Git 最佳实践

## 分支管理

Git 的一大特点就是可以创建很多分支并行开发，在使用 Git 的过程中如果没有清晰流程和规划，每个人都随意的创建分支，项目很快就会变得难以协调和维护，Vincent Driessen 同学为了解决这个问题提出了一套叫 **Git Flow** 的分支模型 [A Successful Git Branching Model](http://nvie.com/posts/a-successful-git-branching-model/)。

### Git Flow 分支命名

- master：生产分支，包含最近发布到生产环境的代码， 这个分支只能从其他分支合并，不能在这个分支直接修改代码。

- develop：开发分支，包含所有要发布到下一个 release 的代码，这个主要合并于其他分支，比如 feature 分支。

- feature：功能分支，这个分支主要是用来开发一个新的功能，一旦开发完成，需要合并回 develop 分支。
- release：预生产分支，当需要一个发布一个新 release 时，基于 develop 分支创建一个 release 分支，完成 release 后合并到master和develop分支。

- hotfix：补丁分支，生产环境发现新的Bug时候，我们需要创建一个hotfix, 完成hotfix后，我们合并回master和develop分支，所以hotfix的改动会进入下一个release。

### Git Flow 工作流程

#### 创建 devlop

```bash
git branch develop  
git push -u origin develop
```

#### 开始 feature

```bash
# 通过develop新建feaeure分支
git checkout -b feature develop

# 或者, 推送至远程服务器:
git push -u origin feature    

# 修改md文件   
git status
git add .
git commit    
```

#### 完成 feature

```bash
git pull origin develop
git checkout develop 

#--no-ff：不使用fast-forward方式合并，保留分支的commit历史
#--squash：使用squash方式合并，把多次分支commit历史压缩为一次
git merge --no-ff feature
git push origin develop

git branch -d some-feature

# 如果需要删除远程feature分支:
git push origin --delete feature   
```

#### 开始 release

```bash
git checkout -b release-0.1.0 develop
```

#### 完成 release

```bash
git checkout master
git merge --no-ff release-0.1.0
git push

git checkout develop
git merge --no-ff release-0.1.0
git push


git branch -d release-0.1.0
git push origin --delete release-0.1.0   

# 合并master/devlop分支之后，打上tag 
git tag -a v0.1.0 master
git push --tags
```

#### 开始 hotfix

```bash
git checkout -b hotfix-0.1.1 master  
```

#### 完成 hotfix

```bash
git checkout master
git merge --no-ff hotfix-0.1.1
git push


git checkout develop
git merge --no-ff hotfix-0.1.1
git push

git branch -d hotfix-0.1.1
git push origin --delete  hotfix-0.1.1 


git tag -a v0.1.1 master
git push --tags
```

### Git Flow 工具(选用)

实际上，当你理解了上面的流程后，你完全可以不使用工具，但是实际上我们大部分人很多命令就是记不住呀，很绝望啊。别怕，总有聪明的人创造好的工具给大家使用：https://github.com/nvie/gitflow

#### 安装

- 下载3个所需的文件，即getopt.exe、libint13.dll、libiconv2.dll，将文件复制到到`Git目录的bin`下面即可，这里我把三个文件打包好了，[传送门](https://pan.baidu.com/s/1pEIFy78_KKd3z83VX_OhDA )，密码：fety 
- 然后从github上clone gitflow：
   `git clone --recursive git://github.com/nvie/gitflow.git`，建议直接将gitflow clone到git的根目录
- 然后打开windows的cmd，输入以下命令：
   `C:\Program Files (x86)\Git\gitflow> contrib\msysgit-install.cmd "C:\Program Files (x86)\Git"`

> 这里安装的可能不一样，有的是Program Files (x86)，有的是Program Files，找到自己的git所在的目录即可。

#### 使用

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20200104/142330233.png)

## 提交规范

整个团队的提交规范应该统一，如果每个人都提交一堆杂乱无章的 commit，那么项目同样也会难以协调和维护，推荐使用当前较为主流的 [AngularJS 的 commit 规范](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)。

每次提交，Commit message 都包括三个部分：Header，Body 和 Footer

```
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略

### Header

Header部分只有一行，包括三个字段：type（必需）、scope（可选）和subject（必需）

#### type

用来标识 commit 的类型，总共有以下 7 个标识：

- feat：新功能（feature）
- fix：修补 bug
- docs：文档发生修改 (documentation)
- style：不影响代码运行的更改（空格，格式，缺少分号等）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：添加或修改测试用例
- chore：除上述之外的修改

#### scope

用来标识改动所影响的范围，视项目而定

#### subject

改动的简短描述，不超过 50 字符长度

### Body

本次 commit 的详细描述

### Footer

主要用于两种情况：

- 重大的不兼容改动: 用于给出改动说明及解决方案。
- 关联 issues: 用于关闭相应 issues