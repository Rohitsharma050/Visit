/**
 * Advanced Paste Processing Engine
 * 
 * Intercepts paste events and intelligently processes clipboard data
 * before inserting into the editor. Preserves formatting, structure,
 * and line breaks from various sources (ChatGPT, websites, Google Docs).
 */

/**
 * Main paste handler - processes clipboard data before insertion
 * @param {ClipboardEvent} event - The paste event
 * @param {Function} insertCallback - Function to insert processed content into editor
 * @param {Object} options - Processing options
 * @returns {boolean} - Whether paste was handled
 */
export const handlePasteEvent = (event, insertCallback, options = {}) => {
  const {
    mode = 'smart', // 'smart', 'formatted', 'plain'
    preserveFormatting = true,
    autoDetectStructure = true,
  } = options;

  // Prevent default paste
  event.preventDefault();

  const clipboardData = event.clipboardData || window.clipboardData;
  if (!clipboardData) return false;

  // Extract both HTML and plain text
  const htmlContent = clipboardData.getData('text/html');
  const plainText = clipboardData.getData('text/plain');

  let processedContent;

  switch (mode) {
    case 'plain':
      // Plain text mode - insert as-is with line breaks
      processedContent = processPlainText(plainText);
      break;

    case 'formatted':
      // Formatted mode - use HTML if available, otherwise plain
      processedContent = htmlContent 
        ? cleanAndNormalizeHTML(htmlContent)
        : processPlainText(plainText);
      break;

    case 'smart':
    default:
      // Smart mode - detect best approach
      processedContent = smartProcess(htmlContent, plainText, {
        preserveFormatting,
        autoDetectStructure,
      });
      break;
  }

  // Insert processed content
  insertCallback(processedContent);
  return true;
};

/**
 * Smart processing - chooses best strategy based on content
 */
const smartProcess = (html, plainText, options) => {
  // If HTML is available and looks well-formed, use it
  if (html && isWellFormedHTML(html)) {
    return cleanAndNormalizeHTML(html);
  }

  // If plain text has clear structure markers, auto-format it
  if (plainText && hasStructureMarkers(plainText) && options.autoDetectStructure) {
    return structurePlainText(plainText);
  }

  // Otherwise, process plain text with line break restoration
  return processPlainText(plainText);
};

/**
 * Check if HTML content is well-formed and useful
 */
const isWellFormedHTML = (html) => {
  if (!html) return false;

  // Check for semantic HTML tags
  const hasSemanticTags = /<(p|h[1-6]|ul|ol|li|pre|code|blockquote|strong|em)/i.test(html);
  
  // Check if it's not just wrapper divs
  const notJustDivs = !(/^<div[^>]*>.*<\/div>$/s.test(html) && !hasSemanticTags);

  return hasSemanticTags && notJustDivs;
};

/**
 * Check if plain text has structure markers
 */
const hasStructureMarkers = (text) => {
  if (!text) return false;

  const markers = [
    /^\s*[-•*→]\s+/m,           // Bullet points
    /^\s*\d+\.\s+/m,            // Numbered lists
    /^[A-Z\s]{10,}$/m,          // ALL CAPS headings
    /^.{1,60}:$/m,              // Lines ending with colon
    /```/,                       // Code fences
    /^\s{4,}/m,                 // Indented code
  ];

  return markers.some(marker => marker.test(text));
};

/**
 * Clean and normalize HTML from clipboard
 */
const cleanAndNormalizeHTML = (html) => {
  // Create a temporary DOM element to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove unwanted elements
  removeUnwantedElements(temp);

  // Clean attributes (remove styles, classes, etc.)
  cleanAttributes(temp);

  // Normalize structure
  normalizeStructure(temp);

  return temp.innerHTML;
};

/**
 * Remove unwanted HTML elements
 */
const removeUnwantedElements = (element) => {
  const unwantedTags = ['script', 'style', 'iframe', 'object', 'embed', 'meta', 'link'];
  
  unwantedTags.forEach(tag => {
    const elements = element.querySelectorAll(tag);
    elements.forEach(el => el.remove());
  });

  // Remove comments
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_COMMENT,
    null,
    false
  );

  const comments = [];
  while (walker.nextNode()) {
    comments.push(walker.currentNode);
  }
  comments.forEach(comment => comment.remove());
};

/**
 * Clean HTML attributes - keep only semantic ones
 */
const cleanAttributes = (element) => {
  const allowedAttributes = {
    'a': ['href', 'title'],
    'img': ['src', 'alt'],
    'code': ['class'], // For language classes
  };

  const allElements = element.querySelectorAll('*');
  allElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    const allowed = allowedAttributes[tagName] || [];

    // Get all attributes
    const attributes = Array.from(el.attributes);
    
    attributes.forEach(attr => {
      if (!allowed.includes(attr.name)) {
        el.removeAttribute(attr.name);
      }
    });
  });
};

/**
 * Normalize HTML structure
 */
const normalizeStructure = (element) => {
  // Convert <div> to <p> if it contains text
  const divs = element.querySelectorAll('div');
  divs.forEach(div => {
    if (div.textContent.trim() && !div.querySelector('p, h1, h2, h3, h4, h5, h6, ul, ol, pre')) {
      const p = document.createElement('p');
      p.innerHTML = div.innerHTML;
      div.replaceWith(p);
    }
  });

  // Convert <span> to appropriate tags
  const spans = element.querySelectorAll('span');
  spans.forEach(span => {
    // If span has no semantic meaning, unwrap it
    if (!span.querySelector('*')) {
      const textNode = document.createTextNode(span.textContent);
      span.replaceWith(textNode);
    }
  });

  // Normalize whitespace in text nodes
  normalizeWhitespace(element);

  // Merge consecutive <br> into paragraph breaks
  mergeBrTags(element);
};

/**
 * Normalize whitespace in text nodes
 */
const normalizeWhitespace = (element) => {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
    // Replace multiple spaces with single space
    node.textContent = node.textContent.replace(/\s+/g, ' ');
  });
};

/**
 * Merge consecutive <br> tags into paragraph breaks
 */
const mergeBrTags = (element) => {
  const brs = element.querySelectorAll('br');
  let consecutiveCount = 0;
  let firstBr = null;

  brs.forEach((br, index) => {
    const nextSibling = br.nextSibling;
    
    if (nextSibling && nextSibling.nodeName === 'BR') {
      if (consecutiveCount === 0) {
        firstBr = br;
      }
      consecutiveCount++;
    } else {
      if (consecutiveCount > 0) {
        // Replace multiple <br> with paragraph break
        const p = document.createElement('p');
        firstBr.replaceWith(p);
        
        // Remove remaining brs
        for (let i = 0; i < consecutiveCount; i++) {
          const next = p.nextSibling;
          if (next && next.nodeName === 'BR') {
            next.remove();
          }
        }
      }
      consecutiveCount = 0;
      firstBr = null;
    }
  });
};

/**
 * Process plain text with line break restoration
 */
const processPlainText = (text) => {
  if (!text) return '';

  // Split into lines
  const lines = text.split('\n');

  const processedLines = [];
  let currentParagraph = [];

  lines.forEach(line => {
    const trimmed = line.trim();

    // Empty line = paragraph break
    if (trimmed.length === 0) {
      if (currentParagraph.length > 0) {
        processedLines.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(trimmed);
    }
  });

  // Add remaining paragraph
  if (currentParagraph.length > 0) {
    processedLines.push(`<p>${escapeHtml(currentParagraph.join(' '))}</p>`);
  }

  return processedLines.join('\n');
};

/**
 * Structure plain text with intelligent formatting
 */
const structurePlainText = (text) => {
  if (!text) return '';

  const lines = text.split('\n');
  const html = [];
  let inList = null;
  let inCodeBlock = false;
  let codeLines = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line
    if (trimmed.length === 0) {
      if (inList) {
        html.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = null;
      }
      if (!inCodeBlock) {
        html.push('<br>');
      }
      return;
    }

    // Code fence
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        if (inList) {
          html.push(inList === 'ul' ? '</ul>' : '</ol>');
          inList = null;
        }
        inCodeBlock = true;
      }
      return;
    }

    // Inside code block
    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Bullet point
    if (/^\s*[-•*→]\s+/.test(trimmed)) {
      if (inList !== 'ul') {
        if (inList) html.push('</ol>');
        html.push('<ul>');
        inList = 'ul';
      }
      html.push(`<li>${escapeHtml(trimmed.replace(/^\s*[-•*→]\s+/, ''))}</li>`);
      return;
    }

    // Numbered list
    if (/^\s*\d+\.\s+/.test(trimmed)) {
      if (inList !== 'ol') {
        if (inList) html.push('</ul>');
        html.push('<ol>');
        inList = 'ol';
      }
      html.push(`<li>${escapeHtml(trimmed.replace(/^\s*\d+\.\s+/, ''))}</li>`);
      return;
    }

    // Heading (ALL CAPS)
    if (trimmed === trimmed.toUpperCase() && /^[A-Z\s]{5,}$/.test(trimmed)) {
      if (inList) {
        html.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = null;
      }
      html.push(`<h2>${escapeHtml(trimmed)}</h2>`);
      return;
    }

    // Subheading (ends with colon)
    if (trimmed.endsWith(':') && trimmed.length < 60) {
      if (inList) {
        html.push(inList === 'ul' ? '</ul>' : '</ol>');
        inList = null;
      }
      html.push(`<h3>${escapeHtml(trimmed.slice(0, -1))}</h3>`);
      return;
    }

    // Regular paragraph
    if (inList) {
      html.push(inList === 'ul' ? '</ul>' : '</ol>');
      inList = null;
    }
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  });

  // Close any open lists
  if (inList) {
    html.push(inList === 'ul' ? '</ul>' : '</ol>');
  }

  return html.join('\n');
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
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Get paste mode label
 */
export const getPasteModeLabel = (mode) => {
  const labels = {
    'smart': 'Smart Paste',
    'formatted': 'Keep Formatting',
    'plain': 'Plain Text',
  };
  return labels[mode] || 'Smart Paste';
};
