---
layout:     post
title:      云原生：AWS Lambda 支持自定义容器镜像初体验
subtitle:   2020 reivent 盛宴时光
date:       2020-12-13
author:     薛以致用
header-img: img/post-bg20200106.jpeg
catalog: true
tags:
    - reinvent
    - 云计算大会
    - 解读
---

看完费老师 2020 在线开发者大会 reinvent 的[《在云端运行你的Tiny ML 推理》](https://virtual.awsevents.com/media/1_eqkl07k6)主题演讲，才发现自己又被推入了绝望深渊（太多令人兴奋的内容）尤其是函数计算 AWS Lambda 的发展，今年发布的一系列新特性，包括 AWS Lambda 支持自定义容器镜像，更多的资源支持，完整的开发语言和官方容器环境等等，我感觉函数计算从早期采用，逐渐走向成熟，必定会成为云原生应用的一个潮流。

这几天一直动手体验 Tiny ML 的代码（https://github.com/lianghong/reinvent2020），发现遇到最大的坑是 OpenCV 的编译，比如指定 Python3.8，C++11，去除掉一些不必要的模块等等，这方面后续会继续整理成在 AWS EC2 Amazon Linux2 环境中如何编译 OpenCV 4.5版本公布在 Github 上；

OpenCV 的正面人脸识别是费老师这个视频的第一个示例，同时是学习 AWS Lambda 的很好的教程，先看看最后的效果，基于原来的代码（最右侧是费老师的图片例子），我进一步添加了眼睛识别，基于 HAAR 特征的 Cascade 分类器对于侧脸效果一般：

![result]({{site.image-srv}}/img/20201213/1.png)

以前写 Lambda 函数最麻烦的就是调试和测试问题，利用这次新发布的对自定义容器镜像的支持，发现在本地利用容器进行测试对于熟悉云原生应用开发的同学来说，**太方便了**，见下图，常见的 Lambda 项目是需要把主程序和依赖的包放在一个文件夹，opencv 用起来很简单，但依赖不少其它库。

![OpenCV_LambdaProject]({{site.image-srv}}/img/20201213/2.png)

# 打包、部署和运行三部曲

正如费老师所演示的，通常的习惯是把 AWS Lambda 程序打成一个 ZIP 包，然后部署到 AWS 平台，再进行调用，利用费老师的脚步，大家可以非常容易提高自己的效率，但假如你的代码非常顺利执行，这个方式大家还可以接受，但通常写一段代码需要相应的测试，尤其稍微复杂的场景实现，有没有本地测试的办法？

原本的方法，是利用 AWS Toolkit + SAM CLI + 本地 Lambda Docker 模拟环境，老实说，想想头就有点大，没想到今年的 reinvent 就给了一个非常大的惊喜，直接支持自定义容器镜像！

```
$ ./zipfile.sh
$ ./deploy.sh
$ ./invoke.sh

Execution time was 3355973833 nanoseconds.
Execution time was 3355 milliseconds.
Execution time was 3.355 seconds.
{
  "statusCode": 200,
  "body": {
    "message": "Find 7 face(s),image saved to s3://jxlabs/ml/opencv/vollyballcn.jpg_rs.jpg"
  },
  "headers": {
    "Content-Type": "application/json"
  }
}
Done.
```
# Lambda 支持容器镜像

这是什么概念呢？**就是开发者可以直接把 Lambda 应用打包成容器，直接部署到 AWS Lambda 环境**。

开发者可以从哪里开始呢？简单可以直接使用官方Lambda 镜像，AWS 通过公开镜像网站 https://gallery.ecr.aws/ 提供了支持 Python, Node.js, Java, .NET, Go, Ruby 基础镜像；当然你也可以基于自身的需求定制兼容 Lambda Runtime API “黄金容器镜像”；

AWS 开源了一系列的 Runtime Interface Clients (RIC) 的实现，比如 Python 版本的实现，如何使用见文末的参考资料：

https://github.com/aws/aws-lambda-python-runtime-interface-client

同时，AWS 还开源了一个 AWS Lambda Runtime Interface Emulator，该模拟器提供了一个 HTTP/S 的代理接口，允许**用户在本地利用容器来测试 Lambda 代码**。

比如前面的 OpenCV 的例子，我们首先引用官方 Python3.8的基础镜像，定义如下大家都熟悉的 Dockerfile：

```
FROM public.ecr.aws/lambda/python:3.8

COPY ./opencv_project ${LAMBDA_TASK_ROOT}
RUN ls ${LAMBDA_TASK_ROOT}

CMD [ "app.lambda_handler" ]
```

本地构建该容器镜像，并在一个 Terminal 中启动该镜像，这个案例中，需要提供两个 Lambda 环境变量，在 docker run 命令中直接设定 S3 的桶名和对象键值：

```
$ docker build -t lopencv .

$ docker images
REPOSITORY                     TAG                 IMAGE ID            CREATED             SIZE
lopencv                        latest              24f55d9e6f7e        7 seconds ago       712MB
public.ecr.aws/lambda/python   3.8                 80e51cc8a434        3 days ago          594MB

$ docker run -p 9000:8080 -e "BUCKET_NAME=jxlabs" -e "S3_KEY=ml/opencv/vollyballcn.jpg" lopencv 
time="2020-12-13T13:18:55.011" level=info msg="exec '/var/runtime/bootstrap' (cwd=/var/task, handler=)"

```

接下来就可以进行 Lambda 函数的本地测试了，通过 CURL 命令传入所需要的事件 JSON 数据（本案例不需要，演示用）：

```
$ curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'

{"statusCode": 200, "body": {"message": "Find 7 face(s),image saved to s3://jxlabs/ml/opencv/vollyballcn.jpg_rs.jpg"}, "headers": {"Content-Type": "application/json"}}

```

**完美！！！**

# 总结

DevOps 中的开发者特别讨厌 Ops 中所涉及复杂的 PaaS 环境，比如 K8S，平时我们为了演示一个弹性伸缩，花了很多时间在构建平台、网络、访问以及安全等方面，而无服务器的兴起，把这些复杂工作（运行时）交给平台，而开发者更能聚焦业务代码本身，AWS Lambda 函数计算是无服务器生态的领路者，打通和容器云原生技术的融合，为企业在采用无服务器计算的道路上又清除了一个障碍。

# 参考资料

* [New for AWS Lambda – Container Image Support](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/)
* [费老师-在云端运行你的Tiny ML 推理](https://virtual.awsevents.com/media/1_eqkl07k6)
* [费老师-在云端运行你的Tiny ML 推理（代码）](https://github.com/lianghong/reinvent2020)
* [Jump-starting your serverless development environment](https://aws.amazon.com/blogs/compute/jump-starting-your-serverless-development-environment/)
* [python-lambda-local](https://pypi.org/project/python-lambda-local/)


# 申明

_本站点所有文章，仅代表个人想法，不代表任何公司立场，所有数据都来自公开资料_

*转载请注明出处*


