---
layout:     post
title:      是该提升开发人员体验 - Amazon Software Builder Experience 团队
title-en:   Time to Enhance Developer Experience - Amazon Software Builder Experience Team
subtitle:   改善构建者体验，提高员工生产力和满意度
subtitle-en: Improving Builder Experience, Enhancing Employee Productivity and Satisfaction
date:       2024-11-11
author:     薛以致用
author-en:  Jason Xue
header-img: img/post-bg20200106.jpeg
catalog: true
description: 探索亚马逊如何通过ASBX团队改善开发者体验，提高生产力和满意度
description-en: Exploring how Amazon improves developer experience through the ASBX team to enhance productivity and satisfaction
tags:
    - 技术
    - 开发者体验
    - 亚马逊
tags-en:
    - Technology
    - Developer Experience
    - Amazon
---

亚马逊致力于改善构建者体验，并使用数据驱动的方法来提高员工生产力和满意度（体验）

![开发者体验]({{site.image-srv}}/img/20241111/1a398ea5e0273b9becfc148b1cbaa237.png)

早在 2022年，Business Insider 报道了一篇关于亚马逊 CEO Andy 创立了一个名为亚马逊软件构建者体验（ASBX）的新部门，以解决开发者提出的"基础性痛点"，Builder 或开发人员是很多科技大厂的核心资产和战斗力，以往我们一直在讲 DevOps 研发运维一体，亚马逊也是 DevOps 文化、机制和工具落地成功的典范公司之一，那为什么 2022年又成立这样的一个 ASBX 横向部门？亚马逊的构建者体验有哪些挑战？GenAI 又为开发者体验带来哪些新的机遇？

## 2022 内部技术生态和现状

https://www.aboutamazon.com/news/workplace/new-amazon-employee-experience-survey

2022年，ASBX 刚成立就接手了内部年度的技术调查和结果分析，并披露到 About Amazon 官网，所谓年度技术调查问卷，会发给所有的亚马逊技术员工，以了解和收集他们关于日常很多方面的各种反馈，看看 2022年的结果总结：

1.  2022年技术调查问卷亮点包括：
    
    - 员工满意度 （86%）和推荐亚马逊作为工作场所（81%）的得分很高
    - 91% 的人感到被鼓励分享想法
    - 74% 的人对在亚马逊实现职业目标充满信心
    - 85% 的人报告经理在做决定时寻求多样化的意见
    - 86% 的人说团队正在为客户做正确的事情，75% 反馈他们真正在为客户做创新
2.  需要改进的领域：
    
    - 5% 的受访者考虑在未来六个月内离开亚马逊，其中一半人将**基本工资**作为主要考虑因素
    - 22% 的开发人员报告 bug 修复经常中断他们的工作
    - 34% 的工程师每周花费 4-8 小时在非差异化工作上
    - 0-20% 的工程师时间花在非产品构建任务上
    - 30% 的工程师时间花在重复性任务上
    - 内部工具与开源工具的兼容性不足，以及观察性工具的不足
3.  ASBX 团队（成立于2022年2月）正在进行的改进包括：
    
    - 自动解决 20% 的 Blocked Software Issues，即开发团队必须等待那些紧急重要的部署完成才能执行自身的部署
    - 推出跨团队的管道效率仪表板 (Pipeline Efficiency Dashboard)
    - 改进 SIM Ticketing 的搜索功能
    - 集中处理 180万台机器的 Amazon Linux 2 的升级
    - 减少大型集群 75% 的 Apollo 部署时间

## ASBX 团队使命是什么？

https://www.businessinsider.com/amazon-builder-experience-team-uses-these-6-guiding-principles-2022-9

根据 Business Insider 的报道，**"Amazon Software Builder Experience"(ASBX)**  团队，成立初期有 400多人，目的是解决**工程师们**的不满，并培养更好的**"构建者/开发者"**文化，内部很多开发人员抱怨工作变得越来越重复和平凡，阻碍了开发人员从事更具创造性的活动；使亚马逊成为"地球上软件构建者最佳雇主"。

为了实现这样的目标，ASBX 团队制定了 **6项指导原则，**作为他们做出关键决策的核心价值观（信条）：

- 提供一致、可互操作和可扩展的工具
- 消除非差异化工作，实现自动化
- 确保工具在最糟糕的时期也能使用
- 通过指标、可行洞察和知识共享不断改进软件构建者体验
- 提供行业领先的技术和顶级专家资源，促进学习和成长
- 将亚马逊的价值观编码到技术基础中，培养包容性文化

这些原则旨在改善亚马逊工程师的工作体验，提高效率，并促进创新。

已知的工作内容包括但不仅限于：

- 开发和实施解决方案，如 Amazon Q，以提高开发人员效率
- 利用检索增强生成（RAG）技术结合亚马逊知识库，为开发人员提供快速、准确的答案
- 通过 S3 连接器将内部知识库导入 Amazon Q Business
- 对文档进行预处理和元数据丰富，以提高检索效率

## 2023年，有哪些提升？

通过 ASBX 披露的2023年技术调查的反馈，我们可以总结这一年的努力之后的结果：

- 建人员反映平均花费在非关键任务上的时间减少了 15%
- 由于未通过测试而导致的平均阻塞时间减少了 10%
- Pipeline 操作员干预次数 (一种衡量您需要手动解决部署 Pipeline 阻塞的指标) 下降了 30%以上
- 公司范围内的 sev2 工单减少超过 20%

ASBX团队引入了新的基准工具，帮助管理者更有效地分析数据。今年，他们进一步改进了这些工具，使其对所有人可用，并引入了新的基准评分系统，以便进行更相关的团队比较。

## 生成式 AI 浪潮汹涌而来

![GenAI浪潮]({{site.image-srv}}/img/20241111/053a1ed993cf35b4f0d4907382b6bfae.png)

GenAI 辅助开发目前可以确定的一个拥有广泛前景的场景，包括 Microsoft Copilot，Amazon Q Developer，Gemini Code Assist 几个大厂和很多初创公司比如 Cursor AI，都在聚焦如何改善开发者体验；以下表格对比了 Q Developer 和 CoPilot 的差异，从差异也可以看到不同产品的聚焦方向；

| 领域/用例 | Amazon Q Developer | GitHub CoPilot |
| --- | --- | --- |
| 定价  | 免费层次无时间限制 Q Professional 每用户每月 19 美元 | GitHub CoPilot Business (每用户每月 19 美元) 可能缺乏功能开发和安全扫描 |
| 端到端功能开发和 SDLC | 内置,为所有软件开发角色提供整个 SDLC 的价值，不仅限于编码人员，根据高级描述生成可投入生产的代码 | 不适用 (私有技术预览) |
| 代码转换 | 是的 (免费层次和专业层次)；使用 Q Agent for Code Transformation (Java 可用，.Net 已宣布)。 | 不适用 |
| 安全扫描 | ✅ 原生包含 Java、JavaScript、Python 等 ✅ 可定制安全扫描 | ❌ 不包含 - 需要 GitHub 高级安全性 |
| AWS 服务知识和集成 | ✅ 与 AWS 平台深度集成,汲取亚马逊 17 年 AWS 最佳实践 - 建立在 Bedrock 之上 ✅ 指导选择正确的 AWS 服务、进行最佳配置以及排除服务相关问题 | ❌ 未原生包含 AWS 特定专业知识 |
| 对话能力 | ✅ 自然语言交互、回答架构问题、起草支持案例、支持解释 | ❌ 未原生包含,可能需要 CoPilot for Azure |

https://dev.to/aws-builders/how-amazon-q-stands-out-a-comparison-with-microsoft-copilot-and-google-gemini-1bj

Q Developer 有个独特的**代码转换**能力，可以帮助团队利用 LLM 大模型自动化升级 Java 应用和 .Net （.NET Framework 到跨平台 .NET 的升级，即将推出），ASBX 也是内部利用 Q Developer 构建自动化工具帮助团队升级到 Java 17，传统方法需要 50工程师人天，利用 Q Developer 升级一个 Java 项目只需要几个小时，在6个月时间内，ASBX 团队的工具帮助升级了超过 50% 的生产 Java 系统，亚马逊开发人员在直接交付了 79%自动生成的代码审查结果（Code Review），无需任何额外更改，该升级帮助公司提升效能相当于节约了 $2.6亿美金的成本，详情见 Andy 的 发布的信息：

https://www.linkedin.com/posts/andy-jassy-8b1615_one-of-the-most-tedious-but-critical-tasks-activity-7232374162185461760-AdSz/?utm_source%3Dshare%26utm_medium%3Dmember_ios

除了亚马逊自己，另外一个可查的代码转换公开案例是拉丁美洲的技术公司 Novacomp，"*使用 Amazon Q Developer，Novacomp仅用 50分钟就升级了一个包含 10,000 多行 Java 代码的项目，而预计需要3周时间。该公司还简化了开发人员的日常任务,平均减少了 60% 的技术债务,并帮助客户显著改善了安全状况并节省了相关成本。*"

你相信大语言模型可以大规模融入 SDLC 每个环节吗？我想大概还是需要更多先行者给大家更多信心和展示，不过个人而言，我觉得未来已来，我们要学习新的工具，习惯大语言模型在 SDLC 的每个环节的辅助、提效和体验改善。

想了解更多大语言模型在代码开发中的应用，可以参考2024年为 KDD 所做的一个调研报告 《Reasoning and planning with large language models in code development (survey for KDD 2024 tutorial)》

![LLM在代码开发中的应用]({{site.image-srv}}/img/20241111/7bc60d42553f5a537d82907e37c2f18a.png)

---

参考资料：
- https://careers.wct-fct.com/companies/amazon-3-60ad394d-c673-4474-9694-344b0cae748f/jobs/41486418-software-development-engineer-amazon-software-builder-experience-asbx
- https://gradle.com/blog/advice-for-andy-jassy-addressing-amazons-mammoth-developer-experience-challenge/
- https://www.aboutamazon.com/news/workplace/amazons-annual-tech-survey-results-now-available
