/**
 * Hidden HTML Paste Capture System
 * 
 * Uses a hidden contentEditable div to capture pasted content with full HTML structure,
 * then extracts and cleans the DOM nodes to preserve formatting that would otherwise be lost.
 */

/**
 * Parse DOM nodes from pasted content and convert to clean HTML
 * @param {HTMLElement} container - The container with pasted content
 * @returns {string} - Clean HTML string
 */
export const extractStructuredHTML = (container) => {
  const result = [];
  
  // Process all child nodes
  Array.from(container.childNodes).forEach(node => {
    const html = processNode(node);
    if (html) result.push(html);
  });

  return result.join('\n');
};

/**
 * Process individual DOM node
 */
const processNode = (node) => {
  // Text node
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent.trim();
    return text ? `<p>${escapeHtml(text)}</p>` : '';
  }

  // Element node
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tagName = node.tagName.toLowerCase();
    
    switch (tagName) {
      case 'p':
      case 'div':
        return processParagraph(node);
      
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return processHeading(node, tagName);
      
      case 'ul':
        return processUnorderedList(node);
      
      case 'ol':
        return processOrderedList(node);
      
      case 'li':
        return processListItem(node);
      
      case 'pre':
        return processCodeBlock(node);
      
      case 'code':
        return processInlineCode(node);
      
      case 'blockquote':
        return processBlockquote(node);
      
      case 'br':
        return '<br>';
      
      case 'strong':
      case 'b':
        return `<strong>${getTextContent(node)}</strong>`;
      
      case 'em':
      case 'i':
        return `<em>${getTextContent(node)}</em>`;
      
      case 'u':
        return `<u>${getTextContent(node)}</u>`;
      
      case 'a':
        return processLink(node);
      
      case 'span':
        // Unwrap spans, just get content
        return processChildren(node);
      
      default:
        // For unknown elements, try to extract children
        return processChildren(node);
    }
  }

  return '';
};

/**
 * Process paragraph element
 */
const processParagraph = (node) => {
  const content = getInnerHTML(node);
  if (!content.trim()) return '';
  
  // Check if it's actually a heading (short text, no periods)
  const text = node.textContent.trim();
  if (text.length < 60 && !text.endsWith('.') && !text.includes('\n')) {
    // Might be a heading
    if (text === text.toUpperCase() && text.split(' ').length >= 2) {
      return `<h2>${content}</h2>`;
    }
    if (text.endsWith(':')) {
      return `<h3>${content.slice(0, -1)}</h3>`;
    }
  }
  
  return `<p>${content}</p>`;
};

/**
 * Process heading element
 */
const processHeading = (node, tagName) => {
  const content = getInnerHTML(node);
  if (!content.trim()) return '';
  
  // Normalize to h2 or h3
  const level = tagName === 'h1' ? 'h2' : tagName;
  return `<${level}>${content}</${level}>`;
};

/**
 * Process unordered list
 */
const processUnorderedList = (node) => {
  const items = [];
  
  Array.from(node.children).forEach(child => {
    if (child.tagName.toLowerCase() === 'li') {
      const content = getInnerHTML(child);
      if (content.trim()) {
        items.push(`<li>${content}</li>`);
      }
    }
  });
  
  if (items.length === 0) return '';
  return `<ul>\n${items.join('\n')}\n</ul>`;
};

/**
 * Process ordered list
 */
const processOrderedList = (node) => {
  const items = [];
  
  Array.from(node.children).forEach(child => {
    if (child.tagName.toLowerCase() === 'li') {
      const content = getInnerHTML(child);
      if (content.trim()) {
        items.push(`<li>${content}</li>`);
      }
    }
  });
  
  if (items.length === 0) return '';
  return `<ol>\n${items.join('\n')}\n</ol>`;
};

/**
 * Process list item
 */
const processListItem = (node) => {
  const content = getInnerHTML(node);
  if (!content.trim()) return '';
  return `<li>${content}</li>`;
};

/**
 * Process code block
 */
const processCodeBlock = (node) => {
  // Get code content
  const codeNode = node.querySelector('code');
  const content = codeNode ? codeNode.textContent : node.textContent;
  
  if (!content.trim()) return '';
  return `<pre><code>${escapeHtml(content)}</code></pre>`;
};

/**
 * Process inline code
 */
const processInlineCode = (node) => {
  const content = node.textContent.trim();
  if (!content) return '';
  
  // If parent is pre, skip (already handled)
  if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
    return '';
  }
  
  return `<code>${escapeHtml(content)}</code>`;
};

/**
 * Process blockquote
 */
const processBlockquote = (node) => {
  const content = getInnerHTML(node);
  if (!content.trim()) return '';
  return `<blockquote>${content}</blockquote>`;
};

/**
 * Process link
 */
const processLink = (node) => {
  const href = node.getAttribute('href') || '#';
  const content = getTextContent(node);
  if (!content.trim()) return '';
  return `<a href="${escapeHtml(href)}">${escapeHtml(content)}</a>`;
};

/**
 * Get inner HTML of node, processing children
 */
const getInnerHTML = (node) => {
  const parts = [];
  
  Array.from(node.childNodes).forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent.trim();
      if (text) parts.push(escapeHtml(text));
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tagName = child.tagName.toLowerCase();
      
      if (tagName === 'br') {
        parts.push('<br>');
      } else if (tagName === 'strong' || tagName === 'b') {
        parts.push(`<strong>${getTextContent(child)}</strong>`);
      } else if (tagName === 'em' || tagName === 'i') {
        parts.push(`<em>${getTextContent(child)}</em>`);
      } else if (tagName === 'u') {
        parts.push(`<u>${getTextContent(child)}</u>`);
      } else if (tagName === 'code') {
        parts.push(`<code>${escapeHtml(child.textContent)}</code>`);
      } else if (tagName === 'a') {
        const href = child.getAttribute('href') || '#';
        parts.push(`<a href="${escapeHtml(href)}">${escapeHtml(getTextContent(child))}</a>`);
      } else {
        // For other elements, just get text
        const text = getTextContent(child);
        if (text.trim()) parts.push(escapeHtml(text));
      }
    }
  });
  
  return parts.join(' ');
};

/**
 * Process children of a node
 */
const processChildren = (node) => {
  const results = [];
  
  Array.from(node.childNodes).forEach(child => {
    const html = processNode(child);
    if (html) results.push(html);
  });
  
  return results.join('\n');
};

/**
 * Get text content of a node
 */
const getTextContent = (node) => {
  return node.textContent || '';
};

/**
 * Escape HTML special characters
 */
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, m => map[m]);
};

/**
 * Clean and normalize the extracted HTML
 */
export const cleanExtractedHTML = (html) => {
  if (!html) return '';
  
  // Remove empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  
  // Remove multiple consecutive br tags
  html = html.replace(/(<br\s*\/?>){3,}/g, '<br><br>');
  
  // Normalize whitespace
  html = html.replace(/\s+/g, ' ');
  
  // Remove leading/trailing whitespace from tags
  html = html.replace(/>\s+</g, '><');
  
  return html.trim();
};
