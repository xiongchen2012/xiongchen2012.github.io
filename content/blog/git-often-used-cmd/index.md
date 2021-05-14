---
title: 常用Git命令速查
date: "2021-05-14T22:34:03.284Z"
description: "常用Git命令速查"
---

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
```



##### 删除标签

```shell
# 删除本地TAG
git tag -d <tagname>

# 删除远程TAG（两条都可以）
git push --delete origin tag <tagname>
git push --delete origin <tagname
```





