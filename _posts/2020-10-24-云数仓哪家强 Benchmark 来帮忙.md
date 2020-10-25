---
layout:     post
title:      云数仓哪家强，Benchmark 来帮忙？
subtitle:   云数据仓库系列
date:       2020-10-24
author:     薛以致用
header-img: img/post-bg20200106.jpeg
catalog: true
tags:
    - 云计算
    - 数仓
    - 云数仓
---

当客户不知道该如何选择某一款云原生数据仓库解决方案时，IT 部门总倾向于 **“比武招亲”**，利用公开的 OLAP 性能测试方法（比如 TPC-H，TPC-DS等）来评估众多选项，那数仓的性能测试能真正帮我们找到合适的数仓解决方案吗？大家网上搜索产品公开的 Benchmark 资料时，会发现每个厂家都声称自身的产品性能是最优的，而且有数据证明，可以想象数仓用户选型时候崩溃混乱的情形；

每一个测试都是在特定的上下文中得出的结论，比如**特定的数仓配置，数据规模大小，测试的任务类型**等等，很多人会受一些有倾向性的结果和宣传所影响和迷惑，**当某一家产品声称比另外一家好太多的时候，我们反而要警惕**，在上一篇《从 670亿美金市值的 Snowflake 看云数据仓库》中，我们提到的一些优秀的现代化云原生数据仓库，都朝着类似的技术方向演进，“**_列式存储，数据生产者和消费者解耦，计算存储分离，计算资源可弹性伸缩，无限扩展不用担心容量的数据湖存储，数据安全以及较少的运维工作和整体拥有成本_**”，虽然每家的产品由于架构设计，发展时间，用户规模不同，会有不同的侧重点，比如有的侧重更简单易用，有的强调深度优化，有的强调并发，有的强调广泛的生态集成等等；

因此如果一定要进行数仓的 Benchmark 测试，那么请注意：

* 把 Benchmark 看成是学习新的技术和特性的一个过程
* 拥抱详细的测试步骤和方法，可以自行动手验证背后逻辑
* 结果解读要关联到特定上下文
* 关注性能基线和统计概率结果
* 与时俱进，开发适合自身的自动化测试方法，定期收集分析数据进行参考

总之，本文对 Benchmark 的态度是，用户拥有选择的权利的同时需要拥有选择的能力，性能只是数仓一个方面，更多从自身业务特性入手，从数仓用户体验出发，从整体数据分析和机器学习平台统一性（数据湖）和多样性（满足不同用户，不同分析工具支撑）等不同维度进行平衡考量；

# 工业基准测试标准

Snowflake 的用户会发现，他们很容易从内置的 TPC-H 和 TPC-DS（10TB/100TB） 数据集开始学习、测试和体验数据分析；类似 AWS 也在 S3 存储桶提供了公开的 TPC-DS 测试数据集方便用户测试学习，覆盖了 3TB/10TB/30TB/100TB 四种不同规模，同时提供了 3TB 的 TPC-H 测试数据集，更多信息请参考[AWS Cloud DW benchmark Toolkit](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/)；后面章节里面很多测试报告也是基于这两个基准测试规范进行，尤其是 TPC-DS 更广泛被使用，那这两个标准有什么样的特征呢？

> Transaction Processing Performance Council（TPC）成立于 1988 年，是一个非营利组织。

官方的 TPC-DS 的规范，定义它是一个 “通用决策支持系统（decision support systems）” 的行业标准测试基准，TPC-DS 属于在线分析处理基准 (OLAP)，并对数据仓库（DBMS）进行建模， “专门为查询和分析而构建的事务数据副本”，广泛用于各种数据仓库产品的性能测试，SQL 兼容行测试，包含交互查询（访问 1～3个月数据），BI 报表（1年时间跨度数据查询），用户分析（跨几年数据复杂Join查询），复杂语句（ETL任务，嵌套子查询等）等等 SQL 任务；

TPC-DS 对零售商场景进行建模，假定一个虚构零售商通过三个不同的渠道进行销售：店铺销售、目录销售（促销单，购物杂志）以及在线销售，对应有10+ 维度表比如 Customer，Store，Item 等模拟一个零售商实践场景，如下图所示，围绕店铺销售和店铺退货两个事实表建模的实体关系图：

![TPC-DS Entity Relationship Schema]({{site.image-srv}}/img/20201024/1.png)

TPC-H 相对于 TPC-DS 有不少差别，比如， TPC-H 是符合第三范式的表结构，8 张表，最多16列，外键只有 9 个；而 TPC-DS 是适合数仓的一种雪花数据模型，拥有 24张表，一张表最多有34列，外键有 104 个；

TPC-DS 数据集中，STORE_SALES 事实表在整体 30TB 规模情况，大约有 860+ 亿行，100 TB整体规模下，拥有超 2800 亿行数据，因此，不同的客户可以根据自身的情况，首先判断那种规模的数据集最接近自身业务需求；根据 Snowflake 2017年的一篇 Blog[《TPC-DS AT 100TB AND 10TB SCALE NOW AVAILABLE IN SNOWFLAKE’S SAMPLES》](https://www.snowflake.com/blog/tpc-ds-now-available-snowflake-samples/)，对于不同规模 TPC-DS 数据集，跑完全部的 99个查询需要的时间，10TB 规模，Snowflake 2X-Large VW 需要 2个小时左右，100TB 规模，跑完 99个查询在 3X-Large VW 上需要 7个小时左右；

TPC-DS 提供了 **99 个** Benchmark SQL 语句，涵盖 _Cross Join，Full outer join，Inner and left join，Low level，Middle level，Multiple join using the same table，Union and intersect，Where condition，Window function，Custom_ 几个类别；其中 “Low Level”是指少于 3个 Join以及简单的 Where 条件查询；“Middle Level” 是指超过 2个Join，并在 Where 和 Group By 中包含多个条件；

# 眼花缭乱的测试报告

好奇在网上收集了一些 基于 TPC-DS 的云原生数据仓库测试报告，大体分为几类：

- 供应商自身或赞助的 TPC-DS 测试说明
    * 目前云原生数仓的厂商（AWS Redshift， GCP BigQuery，Azure SQL Data Warehouse，Snowflake Elastic Data Warehouse）都没有提交标准的 TPC-DS 测试报告，但 **AWS/Snowflake 提供客户快速上手进行 TPC-DS 测试的能力**
    * 每个供应商都有赞助自身有利的解读和宣传的倾向，区别在于是否足够客观和提供详细的测试过程、方法和用户自行验证的能力
- 第三方**独立**合作伙伴测试报告
    * 相对客观，有详细的测试上下文和过程介绍，用户可以学习参考整个报告
    * 有公开测试方法，用户愿意，随时可以按照公开的测试过程进行验证
- 学术机构的研究
    * 主要聚焦在大数据分析产品和解决方案选型过程的相关挑战分解和可选的方法，以及每种测试方法适合的具体场景和局限
    * 对于期望自研或定制大数据 Benchmark 的客户，可以广泛阅读和参考


### GigaOm 测试报告（2019）

GigaOm 2019年发布了一个基于 TPC—DS 规范生成 30TB 数据集，针对 Azure SQL DW/GCP BigQuery/Snowflake/AWS Redshift 四家平台一个测试结果，而结果非常令人惊讶，如下图所示，从 TPC-DS 的 99个查询语句累积执行时间（ Q1, Q1+Q2, ...... ，Q1+Q2+...Q99.）来看，GCP BigQuery 远远落后其它三家，Azure SQL DW 总体执行时间最优，Redshift，Snowflake 和 Azure SQL DW 累积执行时间变化曲线类似，为什么 BigQuery 有这么大的差异呢？

![GigaOm 测试报告-执行时间]({{site.image-srv}}/img/20201024/2.png)

**_首先，大家要关注测试的数据集和环境前提；_**

30TB 的数据集如何产生的？数据表 Schema 如何定义？GigaOm 测试的 103个 SQL 查询语句到底是什么？这些内容 GigaOm 并没有公开；虽然 TPC 提供了标准的 tpcds 工具包，供用户生成基本的主外键约束的表结构，包括生成标准查询 SQL 语句以及一组经批准的“变体”；而数据表 Schema 和 数据内容对于测试结果的影响是非常重要的；

对于测试环境配置，根据公开资料可以了解到：

* **Azure SQL DW** ：DW15000c（30个计算节点，9000GB内存），**$183.86/小时**
* **Snowflake**： 3XL VW，64 节点，$3/小时/Credit，也就是 **$192/小时 (企业版)**
* **AWS Redshift**: dc2.8xlarge(30个节点，960 vcpu, 7320GB 内存，76.8TB SSD)，$4.8/小时/节点，也就是 **$144/小时**
* **GCP BigQuery**：按小时计费的 FlatRate 价格，**$55/小时**，以 $4/小时/100 Slots来换算的话，总计 1375 Slots

以数据仓库每小时费用来看（我们假定还需要收取存储费用的 Snowflake/BigQuery这部分在测试阶段 30TB 成本可以忽略）GCP 只采用 55美金每小时的费用的 Slots （计算能力）相对于其它三家哪怕最低的 144美金/小时的 Redshift 来说也不算公平的一个对照测试；

**_其次，对于测试结果解读，多方面指标有助于我们更好的理解结果；_**

单个查询的单次执行时间，多次执行后的查询时间（Mean，Medium，Geomean等等），99个查询中是否有某些执行时间毛刺会影响总体累积查询时间结果呢？类似也可以计算平均值，中位数以及 Geomean值来获取对于结果数据更多的洞察；还是基于GigaOm 的数据，我们来看如下两个统计图：

![GigaOm 测试报告-其它Metrics]({{site.image-srv}}/img/20201024/3.png)

总执行时间（或平均查询执行时间）可能会产生误导，特别是对于可能因混合短期运行和长时间运行的查询而有所偏斜的工作负载，TPC-DS 就是这种情况，其中约 10% 的查询占总执行时间的 50% 左右。在这种情况下，更需要扩展到更多的衡量指标来进一步理解；

上图中，对于执行时间，考察均值，中位数以及 Geomean值的偏差，可以看出，Redshift 和 Snowflake的均值要远远大于其中位数或Geomean值，分别是 4倍或2倍，说明这两者的总执行时间，受到其中某些执行时间比较长的查询的影响较大；另外，Redshift 和 SQL DW 的中位数以及 Geomean 值比较接近；

对于响应时间，我们通常使用 50%, 75%, 90%, 95% 和 99% 响应时间点来了解响应时间分布情况，如上图，GigaOm 的数据表明，Redshift 和 SQL DW 在短查询（50%百分位）性能上相对比其它两家有明显优势；

### Fivetran 测试报告（2018&2020）

相对于 GigaOm测试，Fivetran 测试提供了完整的测试过程和脚本，涵盖数据生成，测试 SQL语句集，因此客户可以定制自身的测试环境，自行验证和实验；

代码请访问：https://github.com/fivetran/benchmark

TPC-DS 测试数据集和环境前提, 只摘取针对 **1TB 数据集**的测试情况（相对 GigaOm 的 30TB 要小很多）：

* **Azure SQL DW** ：
    - 2018年测试环境：DW1500c（3个计算节点，900GB内存），**$18.12/小时**
    - 2020年测试环境：没有新增测试
* **Snowflake**： 
    - 2018和2020年测试环境相同：Large VW，8 节点，$2/小时/Credit，也就是 **$16/小时**
* **AWS Redshift**: 
    - 2018年测试环境：dc2.8xlarge（4个节点，128 vcpu，976GB内存，10.24TB SSD），$4.8/小时/节点，也就是 **$19.2/小时**
    - 2020年测试环境：ra3.4xlarge (5个节点，60 vcpu，480GB内存)，$3.26/小时/节点，**$16.3/小时**
* **GCP BigQuery**：
    - 2018年测试环境：按需 Ondemand
    - 2020年测试环境：FlatRate价格， 600 slots，**$16.44/小时**

Fivetran 的测试结果，是在没有任何特定优化的情况下，比如 Redshift的 DISTKEY 和 SORTKEY 优化等得出的结论，**执行时间是每条 SQL 语句只执行一次的情况下的结果**；

> 现代数仓 SQL执行通常分为编译和执行两个阶段，在 Fivetran 2018年测试结果中，显示 Redshift 的编译时间要比其它解决方案相对要长，换句话说，第二次同样的 SQL 执行速度非常快；1TB TPC-DS 数据集下，99条语句测试语句，首次执行时间的Geomean 值是 20.3秒，第二次执行就减少到 6.3秒；

那我们再统计下这两次测试的一个结果（Geomean值以及性价比值）：

|        |   2020结果 - Geomean耗费时间（秒）   |   2020结果 - Geomean时间消耗的成本（美分） |  2018结果 - Geomean耗费时间（秒）  |   2018结果 - 成本（假设集群空闲时间百分比）（美分）  | 
|   ---- |   ------------------------------- |   ------------------------------------ | ------------------------------  |   -------------------  | 
|   Snowflake    |   8.21   |   7.29  |   10.74 |   0.265  | 
|   Redshift    |   (ra3)8.24   |   (ra3)7.46  |   (dc2)21.5 |   (dc2)0.637  | 
|   Azure    |   N/A   |   N/A  |   10.13 |   0.284  | 
|   BigQuery    |   11.18（Flat-rate）   |   10.21（Flat-rate）  |   14.32（按需） |   0.305（按需）  |

从 99查询测试结果的 Geomean值来看，Redshift 计算存储分离的架构 RA3体系比传统的 dc2节点有很大的性能提升 _（没有任何优化的前提下）_；在 1TB 数据集下，Fivetran 的数据可以看出，从2018年到2020年，大家都在计算存储分离架构的前提下，Snowflake，Redshift以及 BigQuery 在默认配置下，都拥有不错的性能表现，Snowflake 和 Redshift表现接近，比 BigQuery Flat-rate 模式略胜一筹；

### REDUX Redshift DC2 和 RA3 测试对比

从前面的分析报告中，我们很容易受到影响，就是计算存储分离的架构就比传统的MPP架构有优势，真实情况真的如此吗？我们借用 REDUX 设计的一个实验数据来验证下我们的想法；

通常 TPC-DS 的报告建议在标准的数据表（DDL）的前提下进行，AWS 官方提供了针对 Redshift 优化的 TPC-DS 数据表 DDL参考，类似 GigaOm 的 30TB 数据集的前提下，设计一个 DC2 和 RA3 的集群并且对比 GigaOm2019 测试数据（Schema 非优化情况下），可以先看下结论：

|    Redshift对照实验    |   GigaOm2019+非优化Schema   |   DC2+优化Schema |  RA3+优化Schema  | 
|   ------------------ |   ------------------------- |   ------------- |  -------------   |
|   集群配置            |   30个节点，dc2.8xlarge       |  30个节点，dc2.8xlarge  |   16个节点，ra3.16xlarge | 
|   TPC-DS 数据 Schema |   未知，估计未优化              |   AWS公开的优化后DDL    |   AWS公开的优化后DDL |
|   99查询总执行时间     |       7143秒                 |       1233秒           |   1269秒          | 

从以上数据，可以看出（1）同样的配置情况下，30个节点的 dc2.8xlarge，仅仅采用优化后的 Schema，执行时间提高了 5.79倍；而优化后的 Schema 前提下，30个节点的 dc2.8x 集群，总资源 960 vcpu, 7320GB 内存，76.8TB SSD存储，按需 **$144/小时**，几乎一致性能的16个节点的 ra3.16x集群 768 vcpu，6144GB内存，按需 **$208.64/小时**，如果RA3 超大灵活的托管存储能力不是客户必须的，选择 dc2 方案，直接有 **30% 左右**的性价比提升；

# 尽信“报告”不如无“报告”

自己动手做一个实验对照，体验整个大数据分析 Benchmark的整个过程，我们才不至于被各种断章取义的疯传的结论所困惑；读一些学术论文可进一步可以拓展我们视野，大数据分析系统不仅仅包含基于 DBMS的数据仓库，也有 Haddoop生态的工具集，NoSQL 数据库，以及 NewSQL 关系数据库，Benchmark 的工具除了 TPC-DS，还有 BigDataBenchmark，Hibench，Performance benchmark，LinkBench 等等；所有的 Benchmark 产生测试数据本身就是一个很大的挑战，因为大数据要具备大规模，数据产生高速度，多样性，质量差别大等特征，越接近我们自身业务特性的测试数据，对于我们的借鉴意义最大，否则不建议花大量时间做 Benchmark 测试，不如聚焦用好某一两款云原生数据分析解决方案。

# 总结

利用 Benchmark 帮助云数仓进行排序选择，对于很多企业尤其是技术部门有非常大的吸引力，而掌握哪怕是基于 TPC-DS 的 Benchmark 方法，包括结果解读都不是一件简单的事情，各大云原生数仓玩家，几乎都未提交正式基于标准的 TPC-DS 测试结果，更多的是提供大家详细的测试方法，帮助客户利用现有的数据集进行探索和学习，第三方报告中或市场宣传中出现的任何“夸张”的数据或结论都值得我们思考和深度探究；

# 参考资料

大数据 Benchmark 学术研究：
* [On Big Data Benchmarking - by Rui Han and 2 Xiaoyi Lu](https://arxiv.org/pdf/1402.5194.pdf)
* https://amplab.cs.berkeley.edu/benchmark/

第三方独立测试报告：
* [2020 Cloud Data Warehouse Benchmark: Redshift, Snowflake, Presto and BigQuery](https://fivetran.com/blog/warehouse-benchmark)
* [8K Miles - Big Data Solution Benchmark](https://8kmiles.com/insights/white-papers/big-data-solution-benchmark/)
* [At Scale Benchmarks](https://www.atscale.com/benchmarks/)
* [Grid Dynamics - Which Enterprise Data Warehouse performs better for your workloads? - Jun 30, 2020](https://blog.griddynamics.com/edw-performance-comparison/)
* [Part 2. A visual, whole-workload approach to benchmarking](http://rethinkio.com/a-picture-is-worth-1000-words/)


原厂或赞助的测试方法或报告：
* [GigaOm - Cloud Data Warehouse Performance Testing,2019.04](https://gigaom.com/report/cloud-data-warehouse-performance-testing/)
* [Redefine data analytics with Modern Data Warehouse on Azure - by Azure Data Director - John Macintyre,2018.09](https://azure.microsoft.com/ja-jp/blog/redefine-data-analytics-with-modern-data-warehouse-on-azure/)

* [TPC-DS AT 100TB AND 10TB SCALE NOW AVAILABLE IN SNOWFLAKE’S SAMPLES](https://www.snowflake.com/blog/tpc-ds-now-available-snowflake-samples/)

* [AWS Cloud DW benchmark Toolkit](https://github.com/awslabs/amazon-redshift-utils/tree/master/src/CloudDataWarehouseBenchmark/)
* [Performance matters: Amazon Redshift is now up to 3.5x faster for real-world workloads](https://aws.amazon.com/blogs/big-data/performance-matters-amazon-redshift-is-now-up-to-3-5x-faster-for-real-world-workloads/)
* [Fact or Fiction: Google BigQuery Outperforms Amazon Redshift as an Enterprise Data Warehouse?](https://aws.amazon.com/blogs/big-data/fact-or-fiction-google-big-query-outperforms-amazon-redshift-as-an-enterprise-data-warehouse/)
* [Improved speed and scalability in Amazon Redshift](https://aws.amazon.com/blogs/big-data/improved-speed-and-scalability-in-amazon-redshift/)

其它参考资料：
* [A Summary of TPC-DS](https://medium.com/hyrise/a-summary-of-tpc-ds-9fb5e7339a35)

# 申明

_本站点所有文章，仅代表个人想法，不代表任何公司立场，所有数据都来自公开资料，如有不妥的图片或内容请公众号“联系作者”_

*转载请注明出处*


