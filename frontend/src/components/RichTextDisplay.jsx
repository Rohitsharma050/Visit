import DOMPurify from 'dompurify';

/**
 * RichTextDisplay Component
 * 
 * Safely renders HTML content using DOMPurify to prevent XSS attacks.
 * Maintains the black/white theme styling with prose classes.
 * 
 * @param {Object} props
 * @param {string} props.content - HTML content to render
 * @param {string} props.className - Additional CSS classes
 */
const RichTextDisplay = ({ content, className = '' }) => {
  // Configure DOMPurify to allow safe HTML elements
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
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  };

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize(content || '', config);

  return (
    <div 
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default RichTextDisplay;
