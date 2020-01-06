

在使用 Git 的过程中如果没有清晰流程和规划，每个人都提交一堆杂乱无章的 commit ，项目很快就会变得难以协调和维护，就像代码需要代码规范一样，代码管理同样需要一个清晰的流程和规范。Vincent Driessen 同学为了解决这个问题提出了一套流程 [A Successful Git Branching Model](http://nvie.com/posts/a-successful-git-branching-model/)。

## Git Flow 的分支模型

- Master 分支

生产分支，包含最近发布到生产环境的代码， 这个分支只能从其他分支合并，不能在这个分支直接修改代码

- Develop 分支

主开发分支，包含所有要发布到下一个 release 的代码，这个主要合并于其他分支，比如 Feature 分支

- Feature 分支

这个分支主要是用来开发一个新的功能，一旦开发完成，需要合并回 Develop 分支

- Release分支

当需要一个发布一个新 Release 时，基于 Develop 分支创建一个 Release 分支，完成 Release 后合并到Master和Develop分支

- Hotfix分支

当在生产环境发现新的Bug时候，我们需要创建一个Hotfix, 完成Hotfix后，我们合并回Master和Develop分支，所以Hotfix的改动会进入下一个Release

## Git Flow 如何使用

### 创建 Devlop

```undefined
git branch develop  
git push -u origin develop
```

### 开始 Feature

```csharp
# 通过develop新建feaeure分支
git checkout -b feature develop
# 或者, 推送至远程服务器:
git push -u origin feature    

# 修改md文件   
git status
git add .
git commit    
```

### 完成 Feature

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

### 开始 Release

```css
git checkout -b release-0.1.0 develop
```

### 完成 Release

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

### 开始 Hotfix

```css
git checkout -b hotfix-0.1.1 master  
```

### 完成 Hotfix

```css
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

## Git Flow工具

实际上，当你理解了上面的流程后，你完全可以不使用工具，但是实际上我们大部分人很多命令就是记不住呀，很绝望啊。别怕，总有聪明的人创造好的工具给大家使用：https://github.com/nvie/gitflow

### gitflow 安装

- 下载3个所需的文件，即getopt.exe、libint13.dll、libiconv2.dll，将文件复制到到`Git目录的bin`下面即可，这里我把三个文件打包好了，[传送门](https://pan.baidu.com/s/1pEIFy78_KKd3z83VX_OhDA )，密码：fety 
- 然后从github上clone gitflow：
   `git clone --recursive git://github.com/nvie/gitflow.git`，建议直接将gitflow clone到git的根目录
- 然后打开windows的cmd，输入以下命令：
   `C:\Program Files (x86)\Git\gitflow> contrib\msysgit-install.cmd "C:\Program Files (x86)\Git"`

> 这里安装的可能不一样，有的是Program Files (x86)，有的是Program Files，找到自己的git所在的目录即可。

### gitflow 使用

![mark](http://gongyz.oss-cn-shenzhen.aliyuncs.com/blog/20200104/142330233.png)

