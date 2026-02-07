import { useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { FiCode } from 'react-icons/fi';
import { extractStructuredHTML, cleanExtractedHTML } from '../utils/domParser';
import api from '../utils/api';

const QuestionEditor = ({ value, onChange }) => {
  const [isCodeFormatting, setIsCodeFormatting] = useState(false);
  const [formatError, setFormatError] = useState('');
  const quillRef = useRef(null);
  const hiddenPasteRef = useRef(null);
  const isPastingRef = useRef(false);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  }), []);

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'color',
    'background',
    'link',
  ];

  /**
   * Setup paste event listener
   */
  useEffect(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const editorElement = editor.root;

    const handlePaste = (e) => {
      if (isPastingRef.current) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      isPastingRef.current = true;

      // Get clipboard data
      const clipboardData = e.clipboardData || window.clipboardData;
      if (!clipboardData) {
        isPastingRef.current = false;
        return;
      }

      // Try to get HTML first
      const htmlData = clipboardData.getData('text/html');
      const plainText = clipboardData.getData('text/plain');

      if (htmlData) {
        // Use hidden container to parse HTML
        processHTMLPaste(htmlData, editor);
      } else if (plainText) {
        // Fallback to plain text processing
        processPlainTextPaste(plainText, editor);
      }

      setTimeout(() => {
        isPastingRef.current = false;
      }, 100);
    };

    editorElement.addEventListener('paste', handlePaste, true);

    return () => {
      editorElement.removeEventListener('paste', handlePaste, true);
    };
  }, []);

  /**
   * Process HTML paste using hidden container
   */
  const processHTMLPaste = (html, editor) => {
    if (!hiddenPasteRef.current) return;

    // Clear hidden container
    hiddenPasteRef.current.innerHTML = '';

    // Insert HTML into hidden container
    hiddenPasteRef.current.innerHTML = html;

    // Extract structured HTML from DOM
    const structuredHTML = extractStructuredHTML(hiddenPasteRef.current);
    const cleanedHTML = cleanExtractedHTML(structuredHTML);

    // Insert into editor
    insertHTMLIntoEditor(cleanedHTML, editor);

    // Clear hidden container
    hiddenPasteRef.current.innerHTML = '';
  };

  /**
   * Process plain text paste
   */
  const processPlainTextPaste = (text, editor) => {
    // Apply auto-formatting to plain text
    const formattedHTML = autoFormatText(text);
    insertHTMLIntoEditor(formattedHTML, editor);
  };

  /**
   * Insert HTML into Quill editor
   */
  const insertHTMLIntoEditor = (html, editor) => {
    if (!html || !editor) return;

    // Get current selection
    const selection = editor.getSelection();
    const index = selection ? selection.index : editor.getLength();

    // Insert the HTML
    editor.clipboard.dangerouslyPasteHTML(index, html);

    // Move cursor to end of inserted content
    const newLength = editor.getLength();
    editor.setSelection(newLength, 0);
  };

  /**
   * Format only code blocks using AI
   */
  const handleCodeFormat = async () => {
    if (!value || value.trim().length === 0) return;

    setIsCodeFormatting(true);
    setFormatError('');

    try {
      // Send current HTML content to code-only formatting API
      const response = await api.post('/ai/format-code', { text: value });

      if (response.data.success) {
        const formattedHTML = response.data.data.formattedHTML;
        
        const editor = quillRef.current?.getEditor();
        if (editor) {
          editor.setText('');
          editor.clipboard.dangerouslyPasteHTML(0, formattedHTML);
          const newContent = editor.root.innerHTML;
          onChange(newContent);
        } else {
          onChange(formattedHTML);
        }
      } else {
        setFormatError(response.data.message || 'Code formatting failed');
      }
    } catch (error) {
      console.error('Code formatting error:', error);
      setFormatError(
        error.response?.data?.message || 
        'Code formatting failed. Check GEMINI_API_KEY in backend .env'
      );
    } finally {
      setIsCodeFormatting(false);
    }
  };

  return (
    <div className="question-editor">
      {/* Hidden paste container */}
      <div
        ref={hiddenPasteRef}
        contentEditable
        suppressContentEditableWarning
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      />

      <div className="flex items-center justify-between mb-2">
        <label className="text-sm text-gray-600 dark:text-gray-400">
          Rich Text Editor
        </label>
        <div className="flex items-center space-x-2">
          {/* Code Formatting Button */}
          <button
            type="button"
            onClick={handleCodeFormat}
            disabled={isCodeFormatting || !value}
            className="inline-flex items-center px-3 py-1 text-sm font-medium text-white dark:text-black bg-gray-900 dark:bg-white border-2 border-gray-900 dark:border-gray-100 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Format code blocks with proper indentation and structure"
          >
            <FiCode className={`w-4 h-4 mr-1 ${isCodeFormatting ? 'animate-pulse' : ''}`} />
            {isCodeFormatting ? 'Formatting...' : 'Code Formatting'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {formatError && (
        <div className="mb-2 p-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          ⚠️ {formatError}
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Write or paste your detailed answer here. Use Code Formatting for code blocks!"
      />

      <div className="mt-2">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          💡 <strong>Code Formatting:</strong> Formats code blocks with proper indentation, line breaks, and structure
        </p>
      </div>
    </div>
  );
};

export default QuestionEditor;
