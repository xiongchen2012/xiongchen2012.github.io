---
title: 常用Git命令速查
date: "2021-05-14T22:34:03.284Z"
description: "常用Git命令速查"
---

#### Git的基本运作原理图

 ![image-20210516201437101](https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210516201437101.png)



#### Git配置

##### 别名

以下是我常用的git别名，就是为了输命令时少打几个字

```shell
$ git config --global alias.co checkout  # git co 
$ git config --global alias.br branch # git br
$ git config --global alias.ci commit # git ci
$ git config --global alias.st status # git st
```

##### 用户配置

```shell
$ git config --global user.name "deathdealer"
$ git config --global user.email master@deathdealer.cn
```

#### 远程仓库操作

##### 克隆

```shell
# 克隆远程仓库
git clone https://xxx.gitlab.com/xx/xx.git
# 默认情况下远程仓库被命名为origin，也可以在克隆时用-o来指定名称
git clone -o <origin_name> https://xxx.gitlab.com/xx/xx.git
```

##### 查看远程仓库

```shell
# 列出所有的远程仓库
git remote -v
# 查看具体某个仓库的信息
git remote show <origin_name>
```

##### 添加远程仓库

```shell
git remote add <origin_name> https://yyy.gitlab.cn/yy/yy.git
```

##### 删除远程仓库

```shell
git remote rm <origin_name>
```

##### 重命名

```shell
git remote rename <old_origin> <new_origin>
```

> 可以将远程仓库简单理解为远程地址的缩写



#### Branch操作

##### 列出分支

```shell
git branch # 列出本地分支
git branch -r # 列出远程分支
git branch -a # 列出所有分支，包括本地和远程
```

##### 创建分支

```shell
# 创建并切换到分支
git checkout -b <branch_name>  
git switch -c <branch_name>

# 如果要推送到远程
git push <origin> <branch_name>
git push --all <origin> # 推送所有分支
```

##### 合并分支

首先切换到目标分支

```shell
git checkout/switch <target_branch>
git merge <source_branch>
# 如果没有冲突，可以把source_branch的内容直接合并到target_branch中
git merge <origiin>/<source_branch> # 可以直接从远程分支合并
```

##### 删除分支

```shell
# 删除本地分支
git branch -d <branch_name>

# 删除远程分支
git push <origin> --delete <branch_name>
# 通过省略本地分支名的方法可以删除远程分支，详见最下方的解释
git push <origin> :<branch_name> 
```

#### Tag操作

##### 列出标签

```shell
# 列出标签
git tag -n

# 查看tag信息
git show <tagname>
```



##### 创建标签

首先，切换到需要打标签的分支上`git checkout master`，如果是基于分支的某个commit打标签，下面的命令再加一个`commit_id`就行了

```shell
# 注解标签来添加注释或签名的；轻标签是为了在本地暂时使用或一次性使用；

# 创建轻标签
git tag <tagname>  # 基于分支打标签
git tag <tagname> <commit_id> # 基于分支的某个commit打标签
# 创建注释标签
git tag -am "<commit-message>" <tagname> # 基于分支打标签
git tag -am "<commit-message>" <tagname> # 基于分支的某个commit打标签

# 如果需要推送到远程
git push <origin> <tagname>
git push origin refs/tags/<tagname>
git push <origin> --tags # 一次性推送所有tags
```



##### 删除标签

```shell
# 删除本地TAG
git tag -d <tagname>

# 删除远程TAG（下面几条都可以）
git push --delete origin tag <tagname>
git push --delete origin <tagname
git push <origin> :refs/tags/<tagname> 
git push <origin> :<tagname>
```



> git push命令可以用于删除服务器上的分支和标签，它的主要语法是：
>
> `git push <origin> <local>:<remote>`
>
> 当省略掉`<local>`本地分支名/标签名时，起到的作用就是删除`<remote>`分支/标签，也可以理解为：推送一个空的分支/标签给`<remote>`
>
> 这一点非常有用！
