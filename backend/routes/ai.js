import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/models', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ success: false, message: 'No API key' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return res.status(400).json({
        success: false,
        error: error.error?.message || 'Failed to list models'
      });
    }

    const data = await response.json();
    const models = data.models?.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    ).map(m => ({
      name: m.name.replace('models/', ''),
      displayName: m.displayName,
      description: m.description?.substring(0, 100)
    })) || [];

    res.json({ success: true, models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/ai/format
 * @desc    Format text using AI (Google Gemini - FREE)
 * @access  Private
 */
router.post('/format', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for formatting'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY not configured. Get free key from: https://aistudio.google.com/app/apikey'
      });
    }

    // Get available models first
    const availableModel = await getAvailableModel(apiKey);
    if (!availableModel) {
      return res.status(500).json({
        success: false,
        message: 'No Gemini models available. Check your API key or visit /api/ai/test for diagnostics.'
      });
    }

    console.log(`Using model: ${availableModel}`);
    
    // Format using the available model
    const formattedHTML = await formatWithModel(text, apiKey, availableModel);

    res.status(200).json({
      success: true,
      data: {
        formattedHTML,
        model: availableModel,
        originalLength: text.length,
        formattedLength: formattedHTML.length
      }
    });

  } catch (error) {
    console.error('AI formatting error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to format text with AI'
    });
  }
});

/**
 * @route   POST /api/ai/format-code
 * @desc    Format ONLY code snippets in content (preserves all other formatting)
 * @access  Private
 */
router.post('/format-code', protect, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for code formatting'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY not configured. Get free key from: https://aistudio.google.com/app/apikey'
      });
    }

    const availableModel = await getAvailableModel(apiKey);
    if (!availableModel) {
      return res.status(500).json({
        success: false,
        message: 'No Gemini models available.'
      });
    }

    console.log(`Using model for code formatting: ${availableModel}`);
    
    const formattedHTML = await formatCodeOnly(text, apiKey, availableModel);

    res.status(200).json({
      success: true,
      data: {
        formattedHTML,
        model: availableModel,
        mode: 'code-only'
      }
    });

  } catch (error) {
    console.error('Code formatting error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to format code'
    });
  }
});

/**
 * Get first available model that supports generateContent
 */
async function getAvailableModel(apiKey) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    const model = data.models?.find(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );

    return model ? model.name.replace('models/', '') : null;
  } catch {
    return null;
  }
}

/**
 * Format text using specific Gemini model
 */
async function formatWithModel(text, apiKey, model) {
  const prompt = `You are an expert study notes formatter. Your ONLY job is to FORMAT the provided notes into structured HTML.

=== ⚠️ CRITICAL: CONTENT PRESERVATION RULES ⚠️ ===
This is a FORMATTING task, NOT a summarization task.
You MUST follow these rules STRICTLY:

❌ DO NOT remove any text
❌ DO NOT summarize content  
❌ DO NOT shorten explanations
❌ DO NOT merge bullet points into paragraphs
❌ DO NOT rewrite or rephrase sentences
❌ DO NOT skip any lines or sections
❌ DO NOT compress long content

✅ PRESERVE every single word exactly as provided
✅ PRESERVE all bullet points as separate list items
✅ PRESERVE all code exactly (every line, every space)
✅ PRESERVE long explanations in full
✅ ONLY add HTML formatting tags around existing content

If content is long, keep it long. If there are 50 bullet points, output 50 list items.

=== OUTPUT RULES ===
1. Output ONLY valid HTML. No markdown, no explanations, no backticks.
2. Do NOT include \`\`\`html or \`\`\` anywhere.
3. Start directly with an HTML tag.

=== HEADING STRUCTURE ===
- Main titles/topics → <h1 style="color: #1a56db; border-bottom: 2px solid #1a56db; padding-bottom: 8px; margin-top: 24px; margin-bottom: 16px;">Title</h1>
- Section titles → <h2 style="color: #1e40af; margin-top: 20px; margin-bottom: 12px;">Section</h2>
- Subtopics → <h3 style="color: #374151; margin-top: 16px; margin-bottom: 8px;">Subtopic</h3>

=== LIST FORMATTING (PRESERVE ALL ITEMS) ===
Every bullet point MUST become a separate <li> element. NEVER merge items.

Bullet lists:
<ul style="list-style-type: disc; padding-left: 24px; margin: 12px 0;">
  <li style="margin-bottom: 8px;">First item (keep full text)</li>
  <li style="margin-bottom: 8px;">Second item (keep full text)</li>
  <li style="margin-bottom: 8px;">Third item (keep full text)</li>
</ul>

Numbered lists:
<ol style="list-style-type: decimal; padding-left: 24px; margin: 12px 0;">
  <li style="margin-bottom: 8px;">Step one (keep full text)</li>
  <li style="margin-bottom: 8px;">Step two (keep full text)</li>
</ol>

=== COMPARISON / DIFFERENCE TABLES ===
When you see topics like "difference between", "vs", "comparison", "MongoDB vs SQL", "BSON vs JSON", "Embedded vs Referenced", convert to tables.

REQUIRED table structure:
<table style="width: 100%; border-collapse: collapse; margin: 16px 0; border: 2px solid #374151;">
  <thead>
    <tr style="background-color: #1f2937; color: #ffffff;">
      <th style="border: 1px solid #4b5563; padding: 12px 16px; text-align: left; font-weight: 600;">Aspect</th>
      <th style="border: 1px solid #4b5563; padding: 12px 16px; text-align: left; font-weight: 600;">Option A</th>
      <th style="border: 1px solid #4b5563; padding: 12px 16px; text-align: left; font-weight: 600;">Option B</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #f9fafb;">
      <td style="border: 1px solid #d1d5db; padding: 12px 16px; vertical-align: top;">Feature 1</td>
      <td style="border: 1px solid #d1d5db; padding: 12px 16px; vertical-align: top;">Value A (preserve full text)</td>
      <td style="border: 1px solid #d1d5db; padding: 12px 16px; vertical-align: top;">Value B (preserve full text)</td>
    </tr>
    <tr style="background-color: #ffffff;">
      <td style="border: 1px solid #d1d5db; padding: 12px 16px; vertical-align: top;">Feature 2</td>
      <td style="border: 1px solid #d1d5db; padding: 12px 16px; vertical-align: top;">Value A</td>
      <td style="border: 1px solid #d1d5db; padding: 12px 16px; vertical-align: top;">Value B</td>
    </tr>
  </tbody>
</table>

Table rules:
- Alternate row backgrounds (#f9fafb and #ffffff)
- Dark header row
- Visible borders on all cells
- Adequate padding
- Keep ALL cell content - do not shorten

=== TEXT STYLING (Apply without removing content) ===
- Important keywords → <strong>keyword</strong>
- Definitions → <em>definition text</em>
- Critical exam terms → <mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 2px;">critical term</mark>
- Key concepts → <span style="color: #059669; font-weight: 500;">concept</span>
- Warnings → <span style="color: #dc2626; font-weight: 500;">⚠️ warning</span>

=== CODE BLOCK FORMATTING (PRESERVE EXACTLY) ===
Keep ALL code lines. Do NOT remove or compress.

<pre style="background-color: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; white-space: pre;"><code>// Keep every line exactly as provided
// Preserve all indentation
// Do not compress or remove any code</code></pre>

Inline code: <code style="background-color: #f3f4f6; color: #1f2937; padding: 2px 6px; border-radius: 4px; font-family: 'Consolas', monospace; font-size: 0.9em;">command</code>

=== PARAGRAPHS ===
<p style="margin-bottom: 16px; line-height: 1.75;">Full paragraph text - keep every word</p>

=== FINAL REMINDER ===
Your output will be compared to input. If ANY content is missing, you have FAILED.
Count of bullet points in = count of <li> tags out.
Length of explanations in = length of explanations out.
PRESERVE EVERYTHING. FORMAT ONLY.

Text to format:
"""
${text}
"""

Formatted HTML output:`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const html = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return cleanAIResponse(html);
}

/**
 * Clean AI response
 */
function cleanAIResponse(html) {
  html = html.replace(/```html?\n?/gi, '');
  html = html.replace(/```\n?/gi, '');
  html = html.trim();
  
  if (!html.startsWith('<')) {
    html = `<p>${html}</p>`;
  }

  return html;
}

/**
 * Format ONLY code snippets in content - leaves everything else untouched
 */
async function formatCodeOnly(text, apiKey, model) {
  const prompt = `You are a CODE FORMATTER. Your ONLY task is to format code snippets within the provided content.

=== ⚠️ CRITICAL SCOPE RESTRICTION ⚠️ ===
This is a CODE-ONLY formatting task.

FORMAT these elements:
✅ Code blocks
✅ Programming snippets  
✅ Database queries (MongoDB, SQL, etc.)
✅ Command line snippets
✅ JSON/JavaScript/Python/etc. code

DO NOT TOUCH these elements:
❌ Headings (h1, h2, h3, etc.)
❌ Bullet points and lists
❌ Paragraph text
❌ Tables
❌ Bold / Italic / Underline text
❌ Highlighted text
❌ Colors and styling
❌ Any non-code content

=== CODE FORMATTING RULES ===
1. Add proper indentation (2 spaces per level)
2. Add line breaks between logical sections
3. Format nested objects/arrays on multiple lines
4. Never compress code into a single line
5. Preserve query pipelines with proper structure
6. Detect language automatically (JS, JSON, Bash, MongoDB, SQL, Python, etc.)

=== CODE BLOCK STRUCTURE ===
Wrap all formatted code in:
<pre style="background-color: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; white-space: pre;"><code>
// Formatted code here
</code></pre>

=== EXAMPLE TRANSFORMATION ===

BEFORE (compressed code):
db.users.aggregate([{$match:{age:{$gt:25}}},{$group:{_id:"$city",count:{$sum:1}}}])

AFTER (properly formatted):
<pre style="background-color: #1f2937; color: #e5e7eb; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 16px 0; font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; line-height: 1.6; white-space: pre;"><code>db.users.aggregate([
  {
    $match: {
      age: { $gt: 25 }
    }
  },
  {
    $group: {
      _id: "$city",
      count: { $sum: 1 }
    }
  }
]);</code></pre>

=== CONTENT PROTECTION ===
Return the FULL original content.
Only code blocks should be modified.
All other content must remain EXACTLY as provided.
Do NOT summarize. Do NOT rewrite. Do NOT remove text.

=== OUTPUT RULES ===
1. Output ONLY valid HTML
2. No markdown, no explanations
3. Do NOT include \`\`\`html or \`\`\` markers
4. Start directly with the content

Content to process:
"""
${text}
"""

Processed content with formatted code:`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `API error: ${response.status}`);
  }

  const data = await response.json();
  const html = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return cleanAIResponse(html);
}

export default router;

