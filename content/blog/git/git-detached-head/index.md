---
title: 常用Git命令速查（3）- HEAD游离
date: "2021-05-27T13:50:03.284Z"
description: "详解HEAD为什么会处于游离状态，有什么用，如何脱离游离状态"
---

#### 什么是HEAD

HEAD可以理解为一个指针，HEAD指针通常会指向一个分支（或者说指向一个分支指针），可以通过`cat .git/HEAD`查看当前的指向

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210527192214805.png" alt="image-20210527192214805" style="zoom:50%;" />

下图很好的表示了`HEAD`的指向

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210527192313864.png" alt="image-20210527192313864" style="zoom:50%;" />



##### 游离HEAD

如果用使用命令 `git checkout <branch_name>` 切换分支，HEAD 就会移动到指定的分支上。但是也可以用`git checkout <commit_id>`将HEAD指向某个具体的Commit，此时HEAD指针就会处于名为一种`detached`（游离）状态，这时HEAD不再指向分支而是某次提交。命令行会提示：`You are in ‘detached HEAD’ state.`

 <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210528163917798.png" alt="image-20210528163917798" style="zoom:50%;" />



##### 游离HEAD使用场景

从上文的返回信息中就能知道游离HEAD的使用场景，如下：

```shell
$ git checkout 56e0e92a973344edad0eb7883daca0577c99dadf
Note: switching to '56e0e92a973344edad0eb7883daca0577c99dadf'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:

  git switch -c <new-branch-name>

Or undo this operation with:

  git switch -

Turn off this advice by setting config variable advice.detachedHead to false
```

从上述返回信息我们可以得知，我们当前检出了`56e0e92a973344edad0eb7883daca0577c99dadf`这个提交，现在我们处于分离头的状态，git建议我们，在分离头的状态下，我们可以随便看看，可以按照我们的想法，对当前目录中的文件进行一些实验性的修改，并且将这些实验性的修改创建成一些提交（其实这些提交会组成一条匿名分支），如果你最后后悔了，觉得实验不成功，修改后的结果并不是你想要的，那么我们可以在不影响任何其他分支和提交的情况下，丢弃这些实验性的提交（丢弃这条匿名分支），如果你觉得这些实验性的提交让你很满意，那么你就可以创建一个新的分支（其实是给这个匿名分支一个固定的名字），来永久性的保存这些提交。



##### 游离HEAD的后续处理

- 丢弃这个匿名分支

  处于游离HEAD时，直接checkout到其它分支，就可以丢弃掉你在匿名分支上的所有改动。

- 保留这个匿名分支

  有两种方法可以永久保存匿名分支的提交

  ```shell
  # 创建一个新的分支以便来保存这些在分离头状态下创建的提交（HEAD会切换到新创建的分支）
  $ git checkout -b <new_branch_name>
  # 从指定提交创建新分支（HEAD不会切换到新创建的分支）
  $ git branch <new_branch_name> <commit_id>
  ```

  