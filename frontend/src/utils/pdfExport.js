import html2pdf from 'html2pdf.js';
import DOMPurify from 'dompurify';

/**
 * Decodes HTML entities like &lt;div&gt; back into actual HTML tags.
 * This ensures any escaped HTML in the content is rendered properly.
 */
const decodeHTMLEntities = (html) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

/**
 * Returns the CSS styles applied to the PDF export container.
 * These mirror the rich-text-content styles from index.css to ensure
 * the PDF output matches the editor view exactly.
 */
const getPDFStyles = () => `
  /* ── Base Typography ─────────────────────────────── */
  .pdf-export-container {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    letter-spacing: normal;
    color: #1a1a1a;
    word-break: normal;
    white-space: normal;
    overflow-wrap: break-word;
  }

  /* ── Title Section ───────────────────────────────── */
  .pdf-title {
    font-size: 28px;
    font-weight: 800;
    color: #000;
    margin-bottom: 6px;
    letter-spacing: -0.01em;
    border-bottom: 3px solid #000;
    padding-bottom: 12px;
  }

  .pdf-description {
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
    line-height: 1.5;
  }

  .pdf-stats {
    font-size: 12px;
    color: #666;
    margin-bottom: 24px;
    padding: 10px 14px;
    background: #f5f5f5;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
  }

  .pdf-stats span {
    margin-right: 18px;
    font-weight: 500;
  }

  /* ── Question Block ──────────────────────────────── */
  .pdf-question {
    margin-bottom: 28px;
    page-break-inside: avoid;
  }

  .pdf-question-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 6px;
  }

  .pdf-question-number {
    font-size: 16px;
    font-weight: 700;
    color: #000;
    flex-shrink: 0;
  }

  .pdf-question-title {
    font-size: 16px;
    font-weight: 700;
    color: #000;
  }

  .pdf-question-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .pdf-difficulty {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 12px;
    border: 1.5px solid;
  }

  .pdf-difficulty-easy {
    color: #166534;
    background: #dcfce7;
    border-color: #86efac;
  }

  .pdf-difficulty-medium {
    color: #854d0e;
    background: #fef9c3;
    border-color: #fde047;
  }

  .pdf-difficulty-hard {
    color: #991b1b;
    background: #fee2e2;
    border-color: #fca5a5;
  }

  .pdf-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 10px;
  }

  .pdf-tag {
    font-size: 10px;
    font-weight: 500;
    padding: 2px 8px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    color: #374151;
  }

  /* ── Answer Content (mirrors .rich-text-content) ── */
  .pdf-answer {
    font-size: 13px;
    line-height: 1.7;
    color: #222;
    word-break: normal;
    white-space: normal;
    overflow-wrap: break-word;
  }

  .pdf-answer h1 {
    font-size: 24px;
    font-weight: 700;
    margin: 18px 0 10px;
    color: #111;
  }

  .pdf-answer h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 16px 0 8px;
    color: #111;
  }

  .pdf-answer h3 {
    font-size: 17px;
    font-weight: 600;
    margin: 14px 0 6px;
    color: #222;
  }

  .pdf-answer h4 {
    font-size: 15px;
    font-weight: 600;
    margin: 12px 0 6px;
    color: #333;
  }

  .pdf-answer p {
    margin-bottom: 10px;
    color: #333;
    line-height: 1.7;
  }

  /* ── Lists ───────────────────────────────────────── */
  .pdf-answer ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 12px;
  }

  .pdf-answer ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-bottom: 12px;
  }

  .pdf-answer li {
    margin-bottom: 6px;
    line-height: 1.6;
    color: #333;
  }

  .pdf-answer li > ul,
  .pdf-answer li > ol {
    margin-top: 4px;
    margin-bottom: 0;
  }

  /* ── Inline Formatting ───────────────────────────── */
  .pdf-answer strong,
  .pdf-answer b {
    font-weight: 700;
    color: #111;
  }

  .pdf-answer em,
  .pdf-answer i {
    font-style: italic;
  }

  .pdf-answer u {
    text-decoration: underline;
  }

  .pdf-answer s,
  .pdf-answer strike {
    text-decoration: line-through;
  }

  /* ── Blockquote ──────────────────────────────────── */
  .pdf-answer blockquote {
    padding-left: 14px;
    border-left: 4px solid #9ca3af;
    font-style: italic;
    color: #555;
    margin: 12px 0;
  }

  /* ── Code Blocks ─────────────────────────────────── */
  .pdf-answer pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    background: #0f0f0f;
    color: #e0e0e0;
    padding: 12px;
    border-radius: 8px;
    margin: 12px 0;
    overflow-x: hidden;
    line-height: 1.5;
    page-break-inside: avoid;
  }

  .pdf-answer code {
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 12px;
    background: #f1f5f9;
    color: #0f172a;
    padding: 1px 5px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
  }

  .pdf-answer pre code {
    background: transparent;
    padding: 0;
    border: none;
    color: inherit;
  }

  /* ── Links ───────────────────────────────────────── */
  .pdf-answer a {
    color: #2563eb;
    text-decoration: underline;
  }

  /* ── Horizontal Rule ─────────────────────────────── */
  .pdf-answer hr {
    border: none;
    border-top: 1px solid #d1d5db;
    margin: 16px 0;
  }

  /* ── Tables ──────────────────────────────────────── */
  .pdf-answer table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 12px;
  }

  .pdf-answer th,
  .pdf-answer td {
    border: 1px solid #d1d5db;
    padding: 8px 10px;
    text-align: left;
  }

  .pdf-answer th {
    background: #f3f4f6;
    font-weight: 600;
  }

  /* ── Marks & Special ─────────────────────────────── */
  .pdf-answer mark {
    background: #fef08a;
    padding: 0 3px;
    border-radius: 2px;
  }

  .pdf-answer sub {
    vertical-align: sub;
    font-size: 0.75em;
  }

  .pdf-answer sup {
    vertical-align: super;
    font-size: 0.75em;
  }

  /* ── Quill-specific indent classes ───────────────── */
  .pdf-answer .ql-indent-1 { padding-left: 1.5rem; }
  .pdf-answer .ql-indent-2 { padding-left: 3rem; }
  .pdf-answer .ql-indent-3 { padding-left: 4.5rem; }
  .pdf-answer .ql-indent-4 { padding-left: 6rem; }

  /* ── Separator ───────────────────────────────────── */
  .pdf-separator {
    border: none;
    border-top: 1px solid #d1d5db;
    margin: 20px 0;
  }
`;

/**
 * Sanitize HTML content the same way RichTextDisplay does,
 * so the PDF matches the editor view exactly.
 */
const sanitizeContent = (html) => {
  const config = {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'ol', 'ul', 'li',
      'blockquote', 'pre', 'code',
      'a', 'span', 'div',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'sub', 'sup', 'mark'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'class', 'style', 'id'
    ],
    ALLOW_DATA_ATTR: false,
  };

  // First decode any HTML entities, then sanitize
  const decoded = decodeHTMLEntities(html || '');
  return DOMPurify.sanitize(decoded, config);
};

/**
 * Builds the full HTML document that will be rendered into the PDF.
 * This creates a clean, self-contained HTML structure with embedded CSS.
 */
const buildPDFDocument = (subject, questions) => {
  const sanitizedQuestions = questions.map((q, index) => {
    const difficultyClass = `pdf-difficulty-${(q.difficulty || 'Easy').toLowerCase()}`;
    const sanitizedAnswer = sanitizeContent(q.answer);

    const tagsHTML = (q.tags && q.tags.length > 0)
      ? `<div class="pdf-tags">${q.tags.map(t => `<span class="pdf-tag">${t}</span>`).join('')}</div>`
      : '';

    return `
      <div class="pdf-question">
        <div class="pdf-question-header">
          <span class="pdf-question-number">Q${index + 1}.</span>
          <span class="pdf-question-title">${DOMPurify.sanitize(q.title || '')}</span>
        </div>
        <div class="pdf-question-meta">
          <span class="pdf-difficulty ${difficultyClass}">${q.difficulty || 'Easy'}</span>
        </div>
        ${tagsHTML}
        <div class="pdf-answer">${sanitizedAnswer}</div>
      </div>
      ${index < questions.length - 1 ? '<hr class="pdf-separator" />' : ''}
    `;
  }).join('');

  // Stats
  const easyCount = questions.filter(q => q.difficulty === 'Easy').length;
  const mediumCount = questions.filter(q => q.difficulty === 'Medium').length;
  const hardCount = questions.filter(q => q.difficulty === 'Hard').length;

  return `
    <style>${getPDFStyles()}</style>
    <div class="pdf-export-container">
      <div class="pdf-title">${DOMPurify.sanitize(subject.title || '')}</div>
      ${subject.description ? `<div class="pdf-description">${DOMPurify.sanitize(subject.description || '')}</div>` : ''}
      <div class="pdf-stats">
        <span>Total: ${questions.length}</span>
        <span>Easy: ${easyCount}</span>
        <span>Medium: ${mediumCount}</span>
        <span>Hard: ${hardCount}</span>
      </div>
      ${sanitizedQuestions}
    </div>
  `;
};

/**
 * Exports the subject and its questions as a high-quality PDF.
 * 
 * Uses html2pdf.js to render actual HTML DOM into the PDF,
 * preserving all formatting exactly as it appears in the editor.
 * 
 * VISIBILITY STRATEGY (no flash + no blank page):
 *   - We use opacity:0 (NOT display:none) on the wrapper so the
 *     container keeps its layout/dimensions (html2canvas needs this)
 *     but is completely invisible to the user.
 *   - html2canvas internally clones the document before rendering.
 *     We use its onclone callback to set opacity:1 on the CLONE only.
 *   - Result: user sees nothing, html2canvas captures full content.
 */
export const exportSubjectToPDF = (subject, questions) => {
  // Create a container and render content into it
  const container = document.createElement('div');
  container.id = 'pdf-export-root';
  container.innerHTML = buildPDFDocument(subject, questions);

  // Wrapper: fixed in viewport so html2canvas can reach it,
  // but opacity:0 so the user never sees the content flash.
  // Unlike display:none, opacity:0 keeps the element in layout
  // so html2canvas can read its dimensions.
  const wrapper = document.createElement('div');
  wrapper.id = 'pdf-export-wrapper';
  wrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 800px;
    height: 100vh;
    overflow: hidden;
    z-index: -9999;
    pointer-events: none;
    opacity: 0;
  `;

  // Container needs a concrete pixel width for proper rendering
  container.style.cssText = `
    width: 794px;
    background: #fff;
    color: #000;
    padding: 0;
    margin: 0;
  `;

  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  const fileName = `${(subject.title || 'export').replace(/[^a-z0-9]/gi, '_')}_questions.pdf`;

  // html2pdf options for high-quality rendering
  const options = {
    margin: [10, 12, 10, 12], // top, left, bottom, right in mm
    filename: fileName,
    image: {
      type: 'jpeg',
      quality: 0.98
    },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794, // Match container width (A4 at 96dpi ≈ 794px)
      backgroundColor: '#ffffff',
      // onclone runs on the CLONED document that html2canvas creates
      // internally. We restore opacity:1 on the clone so it renders
      // properly, while the original wrapper stays opacity:0.
      onclone: (clonedDoc) => {
        const clonedWrapper = clonedDoc.getElementById('pdf-export-wrapper');
        if (clonedWrapper) {
          clonedWrapper.style.opacity = '1';
          clonedWrapper.style.overflow = 'visible';
          clonedWrapper.style.height = 'auto';
        }
      }
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy']
    }
  };

  // Small delay to allow the browser to layout the container before capture
  setTimeout(() => {
    html2pdf()
      .set(options)
      .from(container)
      .save()
      .then(() => {
        document.body.removeChild(wrapper);
      })
      .catch((err) => {
        console.error('PDF export failed:', err);
        if (document.body.contains(wrapper)) {
          document.body.removeChild(wrapper);
        }
      });
  }, 100);
};
