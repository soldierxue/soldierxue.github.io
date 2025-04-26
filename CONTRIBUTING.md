# 贡献指南 | Contributing Guide

感谢您对本博客的关注和支持！如果您想要为博客内容贡献翻译或改进，请参考以下指南。

Thank you for your interest in contributing to this blog! If you'd like to contribute translations or improvements to the blog content, please refer to the following guidelines.

## 翻译贡献 | Translation Contributions

### 方法一：直接在文章中添加双语支持 | Method 1: Add Bilingual Support Directly in Articles

对于新文章或重要文章，您可以直接在文章的前置元数据中添加英文版本：

For new or important articles, you can add English versions directly in the article's front matter:

```yaml
---
layout:     post
title:      "中文标题"
title-en:   "English Title"
subtitle:   "中文副标题"
subtitle-en: "English Subtitle"
date:       YYYY-MM-DD
author:     薛以致用
author-en:  Jason Xue
header-img: img/xxx.jpg
catalog: true
description: "中文描述"
description-en: "English description"
tags:
    - 标签1
    - 标签2
tags-en:
    - Tag1
    - Tag2
---

<!-- 中文内容 | Chinese Content -->
这里是中文内容...

<!-- 英文内容 | English Content -->
<div class="en post-container" style="display:none;">
This is English content...
</div>
```

### 方法二：使用 _data/translations.yml 添加翻译 | Method 2: Add Translations Using _data/translations.yml

对于现有的大量文章，您可以在 `_data/translations.yml` 中添加翻译：

For existing articles, you can add translations in `_data/translations.yml`:

```yaml
"YYYY-MM-DD-文章文件名":
  title: "English Title"
  subtitle: "English Subtitle"
  description: "English Description"
  content: |
    English content in Markdown format...
    
    ## Heading
    
    Paragraph text...
```

## 翻译风格指南 | Translation Style Guide

1. **保持一致性** | **Maintain Consistency**：确保术语翻译的一致性，特别是技术术语。
   Ensure consistency in terminology translations, especially for technical terms.

2. **保留原意** | **Preserve Original Meaning**：翻译应准确传达原文的意思，而不是逐字翻译。
   Translations should accurately convey the meaning of the original text, rather than being word-for-word.

3. **适应目标语言** | **Adapt to Target Language**：翻译应符合目标语言的习惯表达方式。
   Translations should conform to the idiomatic expressions of the target language.

4. **技术术语处理** | **Handling Technical Terms**：对于技术术语，如果没有广泛接受的翻译，可以保留英文原文。
   For technical terms, if there is no widely accepted translation, you can keep the original English term.

5. **格式保持** | **Maintain Formatting**：保持原文的格式，包括标题层级、列表、代码块等。
   Maintain the original formatting, including heading levels, lists, code blocks, etc.

## 提交翻译 | Submitting Translations

1. Fork 本仓库 | Fork this repository
2. 创建您的特性分支 | Create your feature branch: `git checkout -b translation-feature`
3. 提交您的更改 | Commit your changes: `git commit -am 'Add translations for article X'`
4. 推送到分支 | Push to the branch: `git push origin translation-feature`
5. 提交 Pull Request | Submit a pull request

## 翻译质量检查 | Translation Quality Check

所有翻译贡献将经过以下质量检查：

All translation contributions will undergo the following quality checks:

1. 语法和拼写检查 | Grammar and spelling check
2. 技术术语准确性检查 | Technical terminology accuracy check
3. 格式和标记检查 | Format and markup check
4. 与原文意思的一致性检查 | Consistency check with the original meaning

## 问题和讨论 | Issues and Discussions

如果您有任何问题或建议，请在 GitHub Issues 中提出。

If you have any questions or suggestions, please raise them in GitHub Issues.

感谢您的贡献！

Thank you for your contributions!
