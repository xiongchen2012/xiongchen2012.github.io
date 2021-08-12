---
title: 常用Git命令速查（4）- Rebase
date: "2021-05-30T09:30:03.284Z"
description: "在Git中整合来自不同分支的修改主要有两种方法：merge 以及 rebase。 本文介绍什么是“变基”，怎样“变基”，并将展示该操作的惊艳之处，以及指出在何种情况下你应避免使用它。"
---

#### 什么是Rebase(变基)

在 Git 中整合来自不同分支的修改主要有两种方法：`merge` 以及 `rebase` , git rebase 和 git merge 作用基本是相同的，二者的一个重要的区别是历史提交本版的区别。git rebase可以使分支看起来像是没有经历过合并一样。

- rebase

     <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210609203440812.png" alt="image-20210609203440812" style="zoom:45%;" />

- merge

     <img src="https://obs-1d2f.oss-cn-hangzhou.aliyuncs.com/images/image-20210609203516904.png" alt="image-20210609203516904" style="zoom:35%;" />



##### 使用 `rebase` 和 `merge` 的基本原则：
1. 下游分支更新上游分支内容的时候使用 `rebase`

2. 上游分支合并下游分支内容的时候使用 `merge`

例如现有上游分支 master，基于 master 分支拉出来一个开发分支 dev，在 dev 上开发了一段时间后要把 master 分支提交的新内容更新到 dev 分支，此时切换到 dev 分支，使用 `git rebase master`

等 dev 分支开发完成了之后，要合并到上游分支 master 上的时候，切换到 master 分支，使用 `git merge dev`



#### Rebase使用场景一：合并提交记录

每次功能迭代开发，最终对多个 commit 进行合并处理，例如，合并最近的 n 次提交纪录，执行：

```shell
$ git rebase -i HEAD~n
```

这时候，会自动进入 `vi` 编辑模式：

```shell
pick cacc52da add: qrcode
pick f072ef48 update: indexeddb hack
pick 4e84901a feat: add indexedDB floder
pick 8f33126c feat: add test2.js

# Rebase 5f2452b2..8f33126c onto 5f2452b2 (4 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
```

把前面的pick改成squash就可以合并记录，注意：

> 不要合并先前提交的东西，也就是已经提交远程分支的纪录。

后续可以用`rebase --abort`放弃变基，`rebase --edit-todo`重新进入编辑模式，`rebase --continue`解变基冲突后继续



#### Rebase 使用场景二：分支合并

主要用于从上游分支合并代码到当前分支，比如从`master`拉来的个人开发分支`feature`，但是另外的同事对master进行了hotfix，此时你刚好急需把hotfix的代码拉到自己的特性分支上。如果用merge是没有问题的，不过会产生一条`merge commit`，污染特性分支的commit log，这时候可以用rebase来进行合并。

```shell
$ git rebase master
```

一面一条命令会依次：

1. `git` 会把 `feature` 分支里面的每个 `commit`都先取消掉；
2. 把上面的操作临时保存成 `patch` 文件，存在 `.git/rebase` 目录里；
3. 从`master`把最新代码更新到 `feature` 分支上；
4. 把上面保存的 `patch` 文件应用到 `feature1` 分支上；

这样过后，最新代码也有了，commit记录也是完美继承过来，不会产生`merge commit`



#### Rebase的风险

呃，奇妙的变基也并非完美无缺，要用它得遵守一条准则：

> **如果提交存在于你的仓库之外，而别人可能基于这些提交进行开发，那么不要执行变基。**

换句话说：除非你可以肯定该需要变基的分支只有你自己使用，否则请谨慎操作。

再换句话说：只要你的分支上需要 `rebase` 的所有 `commits` 历史还没有被 `push` 过，就可以安全地使用 `git-rebase`来操作
