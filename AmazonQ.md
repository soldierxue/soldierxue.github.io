# Jekyll 项目中英文支持增强方案

## 当前状况分析

当前项目已经具备基本的中英文支持功能，但存在一些不一致和不完整的地方。主要包括：

1. 配置文件中已定义了导航菜单的中英文翻译
2. 页面模板支持标题和描述的中英文切换
3. 导航栏有语言切换功能
4. "关于"页面有完整的中英文版本
5. 但博客文章缺乏系统性的双语支持

## 增强方案

### 1. 统一前置元数据格式

为所有页面和文章统一使用相同的前置元数据格式：

```yaml
---
layout: post/page
title: "中文标题"      # 默认标题（中文）
title-en: "English Title"  # 英文标题
subtitle: "中文副标题"    # 默认副标题（中文）
subtitle-en: "English Subtitle"  # 英文副标题
description: "中文描述"   # 默认描述（中文）
description-en: "English description"  # 英文描述
date: YYYY-MM-DD
author: 薛以致用
author-en: Jason Xue
header-img: img/xxx.jpg
catalog: true
tags:
    - 标签1
    - 标签2
tags-en:
    - Tag1
    - Tag2
---
```

### 2. 修改页面模板

修改 `_layouts/page.html` 和 `_layouts/post.html` 文件，确保它们一致地处理双语标题和描述：

```html
<h1 data-title-zh="{{ page.title }}" data-title-en="{{ page.title-en | default: page.title }}">
    <span class="lang-content" data-lang="zh">{{ page.title }}</span>
    <span class="lang-content" data-lang="en" style="display:none;">{{ page.title-en | default: page.title }}</span>
</h1>

<span class="subheading" data-desc-zh="{{ page.description }}" data-desc-en="{{ page.description-en | default: page.description }}">
    <span class="lang-content" data-lang="zh">{{ page.description }}</span>
    <span class="lang-content" data-lang="en" style="display:none;">{{ page.description-en | default: page.description }}</span>
</span>
```

### 3. 全局语言切换机制

创建一个全局的语言切换JavaScript文件 `js/language-switcher.js`：

```javascript
// 全局语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言设置
    var savedLang = localStorage.getItem('blog-language') || 'zh';
    updateLanguageUI(savedLang);
    
    // 更新所有语言相关元素
    function updateLanguageUI(lang) {
        // 更新导航菜单
        var langItems = document.querySelectorAll('.lang-item');
        langItems.forEach(function(item) {
            if (lang === 'en') {
                item.textContent = item.getAttribute('data-lang-en');
            } else {
                item.textContent = item.getAttribute('data-lang-zh');
            }
        });
        
        // 更新页面标题和描述
        var langContents = document.querySelectorAll('.lang-content');
        langContents.forEach(function(item) {
            if (item.getAttribute('data-lang') === lang) {
                item.style.display = 'inline';
            } else {
                item.style.display = 'none';
            }
        });
        
        // 更新语言切换按钮文本
        var langToggle = document.getElementById('current-lang');
        if (langToggle) {
            langToggle.textContent = lang === 'zh' ? '中文' : 'English';
        }
        
        // 更新博客文章内容（如果有）
        var zhContent = document.querySelector('.zh.post-container');
        var enContent = document.querySelector('.en.post-container');
        if (zhContent && enContent) {
            if (lang === 'en') {
                zhContent.style.display = 'none';
                enContent.style.display = 'block';
            } else {
                zhContent.style.display = 'block';
                enContent.style.display = 'none';
            }
        }
        
        // 更新标签
        updateTags(lang);
    }
    
    // 更新标签显示
    function updateTags(lang) {
        var tags = document.querySelectorAll('.tag-item');
        tags.forEach(function(tag) {
            var zhTag = tag.getAttribute('data-tag-zh');
            var enTag = tag.getAttribute('data-tag-en') || zhTag;
            tag.textContent = lang === 'en' ? enTag : zhTag;
        });
    }
    
    // 语言切换事件
    var langToggleBtn = document.getElementById('language-toggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', function() {
            var currentLang = localStorage.getItem('blog-language') || 'zh';
            var newLang = currentLang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('blog-language', newLang);
            updateLanguageUI(newLang);
        });
    }
});
```

### 4. 博客文章双语支持模板

为博客文章创建一个双语支持的模板：

```html
<!-- 中文版本 -->
<div class="zh post-container">
    <!-- 中文内容 -->
    <p>这是中文内容...</p>
</div>

<!-- 英文版本 -->
<div class="en post-container" style="display:none;">
    <!-- 英文内容 -->
    <p>This is English content...</p>
</div>
```

### 5. 标签系统双语支持

修改标签页面 `tags.html`，支持标签的双语显示：

```html
{% for tag in site.tags %}
<a class="tag-item" href="#{{ tag[0] }}" title="{{ tag[0] }}" rel="{{ tag[1].size }}" 
   data-tag-zh="{{ tag[0] }}" data-tag-en="{{ site.tag_translations[tag[0]] | default: tag[0] }}">
    {{ tag[0] }}
</a>
{% endfor %}
```

在 `_config.yml` 中添加标签翻译映射：

```yaml
# 标签翻译
tag_translations:
  云计算: "Cloud Computing"
  架构设计: "Architecture Design"
  微服务: "Microservices"
  数据分析: "Data Analytics"
  # 添加更多标签翻译...
```

### 6. 首页和其他页面统一

确保首页 `index.html` 和其他页面使用一致的前置元数据格式：

```yaml
---
layout: page
title: "薛以致用"
title-en: "Jason Xue's Blog"
description: "避免空谈，成为构建者、创业者和创造者"
description-en: "Avoid empty talk, become a builder, an entrepreneur, and a creator."
---
```

## 实施步骤

1. 统一所有页面的前置元数据格式
2. 修改页面模板以一致处理双语内容
3. 创建全局语言切换JavaScript文件
4. 为现有博客文章添加英文版本（或至少添加英文标题和描述）
5. 实现标签系统的双语支持
6. 测试所有页面在中英文切换下的显示效果

## 效果预期

实施以上方案后，网站将具备完整的双语支持功能：

1. 用户可以通过导航栏的语言切换按钮在中英文之间切换
2. 所有页面标题、描述、内容都会根据当前语言设置显示相应版本
3. 博客文章可以有完整的中英文版本
4. 标签系统支持中英文显示
5. 语言偏好会被保存，用户下次访问时自动应用

这样的双语支持将大大提升国际用户的访问体验，同时保持对中文用户的友好支持。
