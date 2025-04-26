// 全局语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言设置 - 默认为英语
    var savedLang = localStorage.getItem('blog-language') || 'en';
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
        
        // 触发语言变更事件，供其他脚本使用
        var event = new CustomEvent('languageChanged', {
            detail: {
                language: lang
            }
        });
        window.dispatchEvent(event);
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
            var currentLang = localStorage.getItem('blog-language') || 'en';
            var newLang = currentLang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('blog-language', newLang);
            updateLanguageUI(newLang);
        });
    }
});
