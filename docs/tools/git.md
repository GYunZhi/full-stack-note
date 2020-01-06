Git 当下最流行的版本管理工具，结合自己工作中的实际应用做了以下梳理，如果您在使用中还有其它问题欢迎评论留言。

## 基础命令

* ``` git init ``` 初始化本地仓库
* ``` git add -A . ``` 来一次添加所有改变的文件
* ``` git add -A ``` 表示添加所有内容  
* ``` git add . ``` 表示添加新文件和编辑过的文件不包括删除的文件  
* ``` git add -u ``` 表示添加编辑或者删除的文件，不包括新添加的文件  
* ``` git commit -m '版本信息' ``` 提交的版本信息描述
* ``` git status ``` 查看状态  
* ``` git push -u origin master ``` 推送到远程仓库看
* ``` git pull ``` 拉取远程仓库代码到本地
* ```git branch -av``` 查看每个分支的最新提交记录
* ```git branch -vv``` 查看每个分支属于哪个远程仓库
* ```git reset --hard a3f40baadd5fea57b1b40f23f9a54a644eebd52e``` 代码回归到某个提交记录

## 分支操作

*  ``` git branch -a ```	查看本地都有哪些分支
* ``` git branch dev```    新建分支
* ``` git branch ```    查看当前分支 
*  ``` git checkout dev ```    切换分支
*  ```git branch -d dev```   删除本地分支
*  ```git push origin :dev```   同步删除远程分支
*  `git push origin --delete  dev` 直接删除远程分支

## 标签操作

- `git tag <tagname>`	新建轻量级标签

- `git tag  -n`	列出标签 ，-n 显示出每个版本号对应的附加说明

- `git push <tagname>`	推送标签

- `git push  --tags`	一次推送所有本地新增的标签上去，可以使用 `--tags` 选项

- `git tag -d <tagname>`    删除本地标签

- `git push origin --delete  <tagname>`	删除远程标签

- `git ls-remote`	查看远程分支和tag

- `git tag newTag oldTag`	修改标签名称

## 远程仓库地址变更

* 方法1，先删后加:
  * ``` git remote rm origin ``` 先删除
  * ``` git remote add origin 仓库地址 ``` 链接到到远程git仓库
* 方法2，修改命令:
  * ```git remote set-url origin 仓库地址```

## 关联多个远程库

先添加第一个仓库：

```bash
git remote add origin https://gitee.com/zkzong/mongodb.git
```

再添加第二个仓库：

```bash
git remote set-url --add origin https://github.com/zkzong/mongodb.git
```

然后使用下面命令提交：

```bash
git push origin --all
```

## 撤销 git commit 的内容

- `git log`	找到之前提交的git commit的id,找到想要撤销的id

- `git reset –hard id` 	完成撤销,同时将代码恢复到前一commit_id 对应的版本

- `git reset id`	完成Commit命令的撤销，但是不对代码修改进行撤销

## 制覆盖本地代码

```bash
 git reset --hard origin/master
```

## 设置默认编辑器为vim

```bash
git config --global core.editor vim
```