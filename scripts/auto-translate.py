#!/usr/bin/env python3
"""
自动翻译脚本 - 使用 Amazon Translate 为博客文章生成英文翻译
Auto-translation script - Generate English translations for blog posts using Amazon Translate
"""

import os
import re
import yaml
import boto3
import argparse
import markdown
from bs4 import BeautifulSoup
from pathlib import Path

def extract_front_matter(content):
    """Extract front matter from markdown content"""
    pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        front_matter = yaml.safe_load(match.group(1))
        content_without_front_matter = content[match.end():]
        return front_matter, content_without_front_matter
    return {}, content

def translate_text(text, source_lang='zh', target_lang='en'):
    """Translate text using Amazon Translate"""
    if not text or text.strip() == '':
        return ''
        
    translate = boto3.client('translate')
    try:
        response = translate.translate_text(
            Text=text,
            SourceLanguageCode=source_lang,
            TargetLanguageCode=target_lang
        )
        return response['TranslatedText']
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def translate_markdown(content, source_lang='zh', target_lang='en'):
    """Translate markdown content while preserving formatting"""
    # Convert markdown to HTML
    html = markdown.markdown(content)
    
    # Parse HTML
    soup = BeautifulSoup(html, 'html.parser')
    
    # Translate each text node
    for element in soup.find_all(text=True):
        if element.parent.name not in ['code', 'pre']:  # Skip code blocks
            translated_text = translate_text(element.string, source_lang, target_lang)
            element.replace_with(translated_text)
    
    # Convert back to markdown-like format
    # This is a simplified approach; for a complete solution, use a HTML-to-markdown converter
    translated_html = str(soup)
    
    # Basic HTML to markdown conversion for common elements
    translated_html = re.sub(r'<h1>(.*?)</h1>', r'# \1', translated_html)
    translated_html = re.sub(r'<h2>(.*?)</h2>', r'## \1', translated_html)
    translated_html = re.sub(r'<h3>(.*?)</h3>', r'### \1', translated_html)
    translated_html = re.sub(r'<p>(.*?)</p>', r'\1\n\n', translated_html)
    translated_html = re.sub(r'<strong>(.*?)</strong>', r'**\1**', translated_html)
    translated_html = re.sub(r'<em>(.*?)</em>', r'*\1*', translated_html)
    translated_html = re.sub(r'<code>(.*?)</code>', r'`\1`', translated_html)
    translated_html = re.sub(r'<a href="(.*?)">(.*?)</a>', r'[\2](\1)', translated_html)
    
    return translated_html

def process_post(post_path, translations_file, overwrite=False):
    """Process a single post and add its translation to the translations file"""
    print(f"Processing {post_path}...")
    
    # Read post content
    with open(post_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract front matter and content
    front_matter, post_content = extract_front_matter(content)
    
    # Skip if already has English title and we're not overwriting
    if 'title-en' in front_matter and not overwrite:
        print(f"Skipping {post_path} - already has English title")
        return
    
    # Get post ID (filename without extension)
    post_id = os.path.basename(post_path).replace('.md', '')
    
    # Load existing translations
    translations = {}
    if os.path.exists(translations_file):
        with open(translations_file, 'r', encoding='utf-8') as f:
            translations = yaml.safe_load(f) or {}
    
    # Skip if translation exists and we're not overwriting
    if post_id in translations and not overwrite:
        print(f"Skipping {post_id} - translation already exists")
        return
    
    # Translate title, subtitle, and description
    title_en = translate_text(front_matter.get('title', ''))
    subtitle_en = translate_text(front_matter.get('subtitle', ''))
    description_en = translate_text(front_matter.get('description', ''))
    
    # Translate content
    content_en = translate_markdown(post_content)
    
    # Create or update translation entry
    translations[post_id] = {
        'title': title_en,
        'subtitle': subtitle_en,
        'description': description_en,
        'content': content_en
    }
    
    # Save translations
    with open(translations_file, 'w', encoding='utf-8') as f:
        yaml.dump(translations, f, allow_unicode=True, default_flow_style=False)
    
    print(f"Added translation for {post_id}")

def main():
    parser = argparse.ArgumentParser(description='Auto-translate blog posts')
    parser.add_argument('--posts', default='_posts', help='Path to posts directory')
    parser.add_argument('--translations', default='_data/translations.yml', help='Path to translations file')
    parser.add_argument('--post', help='Process a specific post (relative to posts directory)')
    parser.add_argument('--overwrite', action='store_true', help='Overwrite existing translations')
    args = parser.parse_args()
    
    posts_dir = args.posts
    translations_file = args.translations
    
    # Ensure translations directory exists
    os.makedirs(os.path.dirname(translations_file), exist_ok=True)
    
    if args.post:
        # Process a single post
        post_path = os.path.join(posts_dir, args.post)
        if os.path.exists(post_path):
            process_post(post_path, translations_file, args.overwrite)
        else:
            print(f"Post not found: {post_path}")
    else:
        # Process all posts
        for post_file in os.listdir(posts_dir):
            if post_file.endswith('.md'):
                post_path = os.path.join(posts_dir, post_file)
                process_post(post_path, translations_file, args.overwrite)

if __name__ == '__main__':
    main()
