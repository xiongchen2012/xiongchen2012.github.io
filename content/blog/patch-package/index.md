---
title: 团队协作项目中优雅的修改三方库
date: "2021-05-26T14:42:32.169Z"
description: 如果第三方开源库不能满足我们实际项目的需要或者有小BUG等，修改了三方库的源码后如何优雅的与团队成员共享呢？可以使用patch-package修改依赖包内容，为依赖包创建补丁。
---

##### 背景

团队协作的项目中使用的开源第三方库在使用过程中，如果不能满足业务需求，或是使用过程中发现了该包的bug。可以向原作者提Issue，然后坐等作者修复或开发即可。这样就需要等作者重新发布新版本，在快速迭代的项目中显然不现实。所以直接修改别人的源码大概率是最佳选择。

修改别人的源码往往有这几个方式：

|                                    | 优点               | 缺点                                       |
| ---------------------------------- | ------------------ | ------------------------------------------ |
| 直接在node_modules中找到源码并修改 | 简单粗暴、快速见效 | 一旦重新安装就失效<br />不方便团队成员共享 |
| fork源码并修复，然后提PR给作者     | 团队成员都可以共享 | 等待周期很长                               |



##### 解决方案

通过patch-package生成patch文件（diff格式），通过npm script的`postinstall`在npm installp之后自动应用这些patch到三方库来达到和团队成员共享修改后第三方库的目的



##### 使用方法

- 安装

  ```shell
  # NPM
  $ npm install --save-dev patch-package
  # Yarn
  $ yarn add --dev patch-package
  ```

- 生成Patch

  在项目的node_modules中修改了依赖库的源码之后，回到项目根目录后执行：

  ```shell
  $ npx patch-package <package_name>  # NPM > 5.2
  $ yarn patch-package <package_name> # Yarn
  ```

  执行完成后，会在根目录生成`patches`目录，并在该目录中生成`<package_name>+<version>.patch`格式的文件，然后需要把补丁文件提交到代码仓库中，方便团队共享。

  > patch-package的选项：
  >
  > --use-yarn 默认会根据lockfile来决定使用npm还是yarn，如果两者都有就使用npm，可以通过这个参数启用yarn
  >
  > --exlcude <regexp> 创建补丁时，忽略匹配的路径
  >
  > --include <regexp> 创建补丁时，仅考虑匹配的路径，与exclude相反
  >
  > --patch-dir 指定存放补丁的目录

  如果你修改的是依赖的依赖，甚至是依赖的依赖的依赖等（嵌套依赖），可以用`/`分隔符分隔包名，例如：

  ```shell
  $ npx patch-package package/another-package/deep-pacakge
  ```

- 更新Patch

  和创建补丁的方法一样

- 打补丁

  在`package.json`的`scripts`中加入`postinstall`，后续执行`npm install`或`yarn`后，会自动为依赖的第三方库打上补丁。

  ```json
  {
    "scripts": {
      "postinstall": "patch-pacakge"
    }
  }
  ```

  

##### patch-package源码

[https://github.com/ds300/patch-package](https://github.com/ds300/patch-package)



