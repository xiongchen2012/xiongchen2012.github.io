---
title: 常用Git命令速查
date: "2021-05-14T22:34:03.284Z"
description: "常用Git命令速查"
---

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

##### 删除分支

```shell
git push <origin> --delete <branch_name>
git push <origin> :<branch_name> # 通过省略本地分支名的方法可以删除远程分支，详见下方解释
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

