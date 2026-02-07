/**
 * Smart Auto-Formatter Utility
 * 
 * Automatically detects structure in plain text and converts it to formatted HTML.
 * Handles headings, lists, code blocks, and paragraph structuring.
 */

/**
 * Main auto-formatting function
 * @param {string} text - Plain text to format
 * @returns {string} - Formatted HTML
 */
export const autoFormatText = (text) => {
  if (!text || text.trim().length === 0) return '';

  // Split into lines for processing
  let lines = text.split('\n');
  
  // Process lines to detect structure
  const processedLines = lines.map((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines initially (we'll add them back as spacing)
    if (trimmedLine.length === 0) {
      return { type: 'empty', content: '' };
    }

    // Detect headings
    if (isHeading(trimmedLine, index, lines)) {
      return { type: 'h2', content: trimmedLine };
    }

    // Detect subheadings
    if (isSubheading(trimmedLine)) {
      return { type: 'h3', content: trimmedLine.replace(/:$/, '') };
    }

    // Detect code blocks (multiline)
    if (isCodeFence(trimmedLine)) {
      return { type: 'code-fence', content: trimmedLine };
    }

    // Detect bullet list items
    if (isBulletPoint(trimmedLine)) {
      return { type: 'bullet', content: trimmedLine.replace(/^[-•*→]\s*/, '') };
    }

    // Detect ordered list items
    if (isOrderedItem(trimmedLine)) {
      return { type: 'ordered', content: trimmedLine.replace(/^\d+\.\s*/, '').replace(/^(Step|step)\s+\d+[:.]\s*/i, '') };
    }

    // Detect inline code
    if (isInlineCode(trimmedLine)) {
      return { type: 'code-line', content: trimmedLine };
    }

    // Regular paragraph
    return { type: 'paragraph', content: trimmedLine };
  });

  // Convert to HTML
  return convertToHTML(processedLines);
};

/**
 * Check if line is a heading
 */
const isHeading = (line, index, allLines) => {
  // ALL CAPS (at least 3 words)
  if (line === line.toUpperCase() && line.split(' ').length >= 2 && /^[A-Z\s]+$/.test(line)) {
    return true;
  }

  // Short standalone line (3-6 words) that's not a sentence
  if (line.split(' ').length >= 2 && line.split(' ').length <= 6 && !line.endsWith('.')) {
    // Check if next line is empty or is content (not another heading)
    const nextLine = allLines[index + 1];
    if (!nextLine || nextLine.trim().length === 0 || !isHeading(nextLine.trim(), index + 1, allLines)) {
      return true;
    }
  }

  // Lines ending with colon (if short enough)
  if (line.endsWith(':') && line.length < 60 && line.split(' ').length <= 8) {
    return true;
  }

  return false;
};

/**
 * Check if line is a subheading
 */
const isSubheading = (line) => {
  // Ends with colon and medium length
  if (line.endsWith(':') && line.length < 80) {
    return true;
  }

  // Starts with common definition patterns
  const definitionPatterns = [
    /^Definition:/i,
    /^What is/i,
    /^Introduction:/i,
    /^Overview:/i,
    /^Note:/i,
    /^Important:/i,
  ];

  return definitionPatterns.some(pattern => pattern.test(line));
};

/**
 * Check if line is a bullet point
 */
const isBulletPoint = (line) => {
  return /^[-•*→]\s+/.test(line);
};

/**
 * Check if line is an ordered list item
 */
const isOrderedItem = (line) => {
  // Numeric: 1. 2. 3.
  if (/^\d+\.\s+/.test(line)) {
    return true;
  }

  // Step format: Step 1, Step 2
  if (/^(Step|step)\s+\d+[:.]\s*/i.test(line)) {
    return true;
  }

  // First, Second, Third pattern
  if (/^(First|Second|Third|Fourth|Fifth|Firstly|Secondly)[,:\s]/i.test(line)) {
    return true;
  }

  return false;
};

/**
 * Check if line is a code fence
 */
const isCodeFence = (line) => {
  return line.startsWith('```') || line.startsWith('~~~');
};

/**
 * Check if line contains inline code (indented or code-like)
 */
const isInlineCode = (line) => {
  // Heavily indented (4+ spaces or tab)
  if (/^(\s{4,}|\t)/.test(line)) {
    return true;
  }

  // Contains programming keywords and symbols
  const codePatterns = [
    /function\s+\w+\(/,
    /const\s+\w+\s*=/,
    /let\s+\w+\s*=/,
    /var\s+\w+\s*=/,
    /class\s+\w+/,
    /def\s+\w+\(/,
    /public\s+(static\s+)?void/,
    /import\s+/,
    /from\s+['"]/,
    /return\s+/,
    /{.*}.*{.*}/,  // Multiple braces
    /\w+\(.*\)\s*{/,  // Function definition
  ];

  return codePatterns.some(pattern => pattern.test(line));
};

/**
 * Convert processed lines to HTML
 */
const convertToHTML = (processedLines) => {
  const html = [];
  let inList = null; // 'bullet' or 'ordered'
  let inCodeBlock = false;
  let codeLines = [];

  const closeList = () => {
    if (inList === 'bullet') {
      html.push('</ul>');
    } else if (inList === 'ordered') {
      html.push('</ol>');
    }
    inList = null;
  };

  for (let i = 0; i < processedLines.length; i++) {
    const { type, content } = processedLines[i];

    // Handle code fences
    if (type === 'code-fence') {
      if (inCodeBlock) {
        // Closing fence
        html.push(`<pre><code>${codeLines.join('\n')}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        // Opening fence
        closeList();
        inCodeBlock = true;
      }
      continue;
    }

    // If inside code block, accumulate lines
    if (inCodeBlock) {
      codeLines.push(escapeHtml(content));
      continue;
    }

    // Handle other types
    switch (type) {
      case 'empty':
        closeList();
        // Add spacing between paragraphs
        if (html.length > 0 && !html[html.length - 1].endsWith('</ul>') && !html[html.length - 1].endsWith('</ol>')) {
          html.push('<br>');
        }
        break;

      case 'h2':
        closeList();
        html.push(`<h2>${escapeHtml(content)}</h2>`);
        break;

      case 'h3':
        closeList();
        html.push(`<h3>${escapeHtml(content)}</h3>`);
        break;

      case 'bullet':
        if (inList !== 'bullet') {
          closeList();
          html.push('<ul>');
          inList = 'bullet';
        }
        html.push(`<li>${escapeHtml(content)}</li>`);
        break;

      case 'ordered':
        if (inList !== 'ordered') {
          closeList();
          html.push('<ol>');
          inList = 'ordered';
        }
        html.push(`<li>${escapeHtml(content)}</li>`);
        break;

      case 'code-line':
        closeList();
        html.push(`<pre><code>${escapeHtml(content)}</code></pre>`);
        break;

      case 'paragraph':
        closeList();
        // Merge consecutive paragraphs
        if (i > 0 && processedLines[i - 1].type === 'paragraph') {
          // Continue same paragraph
          const lastIndex = html.length - 1;
          html[lastIndex] = html[lastIndex].replace('</p>', ` ${escapeHtml(content)}</p>`);
        } else {
          html.push(`<p>${escapeHtml(content)}</p>`);
        }
        break;
    }
  }

  // Close any open lists
  closeList();

  return html.join('');
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
 * Smart format for pasted content
 * This can be triggered on paste events
 */
export const formatPastedContent = (clipboardData) => {
  const plainText = clipboardData.getData('text/plain');
  
  // Check if HTML is available (from rich sources)
  const htmlText = clipboardData.getData('text/html');
  
  // If HTML is already well-formatted, use it
  if (htmlText && htmlText.includes('<')) {
    // Let React Quill handle rich HTML
    return null;
  }

  // Otherwise, apply smart formatting to plain text
  return autoFormatText(plainText);
};
