// 全局语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否已经有语言偏好设置
    if (!localStorage.getItem('blog-language')) {
        // 获取浏览器语言
        var userLang = navigator.language || navigator.userLanguage;
        // 如果是中文，设置为中文，否则默认为英文
        var siteLang = userLang.startsWith('zh') ? 'zh' : 'en';
        localStorage.setItem('blog-language', siteLang);
    }
    
    // 初始化语言设置 - 默认为英语
    var savedLang = localStorage.getItem('blog-language') || 'en';
    updateLanguageUI(savedLang);
    
    // 更新所有语言相关元素
    function updateLanguageUI(lang) {
        // 更新HTML语言属性
        document.documentElement.setAttribute('lang', lang);
        
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
        
        // 添加平滑过渡效果
        document.body.classList.add('language-transition');
        setTimeout(function() {
            document.body.classList.remove('language-transition');
        }, 500);
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
            
            // 显示语言切换提示
            showLanguageChangedNotification(newLang);
        });
    }
    
    // 显示语言切换提示
    function showLanguageChangedNotification(lang) {
        // 检查是否已存在通知元素
        var existingNotification = document.getElementById('language-notification');
        if (existingNotification) {
            document.body.removeChild(existingNotification);
        }
        
        // 创建通知元素
        var notification = document.createElement('div');
        notification.id = 'language-notification';
        notification.className = 'language-notification';
        notification.textContent = lang === 'zh' ? '已切换到中文' : 'Switched to English';
        
        // 添加样式
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(function() {
            notification.style.opacity = '1';
        }, 10);
        
        // 3秒后隐藏通知
        setTimeout(function() {
            notification.style.opacity = '0';
            setTimeout(function() {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // 首次访问时显示语言切换提示
    if (!localStorage.getItem('language-tip-shown')) {
        setTimeout(function() {
            var tipElement = document.createElement('div');
            tipElement.className = 'language-tip';
            tipElement.innerHTML = '<div style="padding: 15px; background-color: rgba(0,0,0,0.8); color: white; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">' +
                '<p style="margin: 0 0 10px 0; font-weight: bold;">提示 / Tip</p>' +
                '<p style="margin: 0;">您可以通过右上角的语言切换按钮切换中英文 / You can switch between Chinese and English using the language toggle in the top right corner</p>' +
                '<button id="close-tip" style="background: #4a86e8; border: none; color: white; padding: 5px 10px; margin-top: 10px; border-radius: 3px; cursor: pointer;">知道了 / Got it</button>' +
                '</div>';
            
            tipElement.style.position = 'fixed';
            tipElement.style.bottom = '20px';
            tipElement.style.right = '20px';
            tipElement.style.maxWidth = '300px';
            tipElement.style.zIndex = '9999';
            tipElement.style.fontSize = '14px';
            
            document.body.appendChild(tipElement);
            
            document.getElementById('close-tip').addEventListener('click', function() {
                document.body.removeChild(tipElement);
                localStorage.setItem('language-tip-shown', 'true');
            });
            
            // 10秒后自动关闭
            setTimeout(function() {
                if (tipElement.parentNode) {
                    document.body.removeChild(tipElement);
                    localStorage.setItem('language-tip-shown', 'true');
                }
            }, 10000);
        }, 2000);
    }
});

// 添加全局样式
document.addEventListener('DOMContentLoaded', function() {
    var style = document.createElement('style');
    style.textContent = `
        .language-transition * {
            transition: opacity 0.3s ease-in-out;
        }
        
        #language-toggle {
            display: flex;
            align-items: center;
        }
        
        #language-toggle:before {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 5px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>');
            background-size: contain;
        }
    `;
    document.head.appendChild(style);
});
