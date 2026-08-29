import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient = null;

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
};

/**
 * Summarize an email
 */
export const summarizeEmail = async (subject, body) => {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an elite AI email productivity assistant. 
Summarize the following email in 2-3 clear, executive sentences. Focus strictly on key updates, decisions, and deadlines.

Subject: ${subject}
Email Body:
${body}

Provide a concise, direct summary:`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text.trim();
    } catch (err) {
      console.warn(`[AI Service] Gemini call failed (${err.message}). Falling back to NLP heuristics.`);
    }
  }

  // Smart Heuristic Fallback
  return generateHeuristicSummary(subject, body);
};

/**
 * Generate context-aware reply
 */
export const generateReply = async ({ subject, body, sender, tone = 'Professional', userNotes = '' }) => {
  const client = getGeminiClient();
  const recipientName = sender?.name || 'there';

  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an executive AI email assistant. Draft a complete, polite, and effective reply to this email.

Tone requested: ${tone} (Options: Professional, Friendly, Formal, Concise, Urgent)
Original Sender: ${sender?.name || sender?.email || 'Sender'}
Original Subject: ${subject}
Original Body:
${body}

${userNotes ? `Additional user instructions: ${userNotes}` : ''}

Rules:
1. Include a proper greeting and closing sign-off.
2. Address all questions and action items in the email.
3. Match the requested tone exactly:
   - Professional: Balanced, clear, polite, corporate-appropriate.
   - Friendly: Warm, enthusiastic, approachable, collaborative.
   - Formal: Strict executive etiquette, respectful, structured.
   - Concise: Very short (2-3 sentences max), direct to the point.
   - Urgent: Emphasizes immediate attention and rapid turnaround.
4. Output only the email text body ready to send.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn(`[AI Service] Gemini reply failed (${err.message}). Falling back to heuristic generator.`);
    }
  }

  return generateHeuristicReply({ subject, body, senderName: recipientName, tone, userNotes });
};

/**
 * Classify category and priority
 */
export const classifyEmail = async (subject, body) => {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze this email and classify its category and priority.
Categories: Work, Personal, Finance, Shopping, Education, Promotions, Spam, Important, General.
Priority: High, Medium, Low.

Email:
Subject: ${subject}
Body: ${body}

Respond ONLY in valid JSON format:
{
  "category": "Work",
  "priority": "High",
  "reason": "Brief 1-sentence reason"
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn(`[AI Service] Gemini classify failed (${err.message}). Using heuristics.`);
    }
  }

  return generateHeuristicClassification(subject, body);
};

/**
 * Extract Action Items and Deadlines
 */
export const extractActionItems = async (subject, body) => {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Extract all concrete action items, deliverables, and associated deadlines from this email.
Email Subject: ${subject}
Email Body:
${body}

Respond ONLY in valid JSON format as an array of objects:
[
  { "task": "Specific task description", "deadline": "Mentioned deadline or 'Not specified'" }
]
If there are no action items, return an empty array [].`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (err) {
      console.warn(`[AI Service] Gemini action items failed (${err.message}). Using heuristics.`);
    }
  }

  return generateHeuristicActionItems(body);
};

/**
 * Explain complex email in simple terms (ELI5)
 */
export const explainEmail = async (subject, body) => {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Explain the following email in simple, jargon-free plain English. 
Break down any technical terms, legal phrases, or ambiguous corporate language so a non-technical reader can immediately understand what is being communicated and what it means for them.

Subject: ${subject}
Body:
${body}

Provide a friendly, structured explanation:`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn(`[AI Service] Gemini explain failed (${err.message}). Using heuristics.`);
    }
  }

  return generateHeuristicExplanation(subject, body);
};

/**
 * Polish / Rewrite an email draft
 */
export const rewriteEmailDraft = async (draftText, tone = 'Professional', instruction = '') => {
  const client = getGeminiClient();
  if (client) {
    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Rewrite and polish the following email draft.
Desired Tone: ${tone}
${instruction ? `Specific Instruction: ${instruction}` : ''}

Original Draft:
${draftText}

Output only the polished email text.`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn(`[AI Service] Gemini rewrite failed. Using heuristic.`);
    }
  }

  if (tone === 'Concise') {
    return draftText.split('\n').filter(Boolean).slice(0, 3).join('\n');
  }
  return `Hi,\n\n${draftText}\n\nBest regards,\nAbhay Verma`;
};

// ----------------- NLP Heuristic Engines ----------------- //

function generateHeuristicSummary(subject, body) {
  const cleanBody = (body || '').replace(/\s+/g, ' ').trim();
  const sentences = cleanBody.split(/(?<=[.?!])\s+/).filter(s => s.length > 20);

  if (sentences.length <= 2) {
    return `${subject}: ${cleanBody.slice(0, 180)}...`;
  }

  const keySentence = sentences.find(s => 
    /urgent|deadline|need|please|meeting|review|submit|confirmed|approved|invoice|payment/i.test(s)
  ) || sentences[0];

  return `Regarding "${subject}": ${keySentence} ${sentences[1] ? sentences[1] : ''}`.trim();
}

function generateHeuristicReply({ subject, body, senderName, tone, userNotes }) {
  const name = senderName && senderName !== 'Sender' ? senderName.split(' ')[0] : 'there';
  const cleanSubj = (subject || '').replace(/^(Re:\s*|Fwd:\s*)+/i, '');

  let greetings = `Hi ${name},`;
  let signoff = `Best regards,\nAbhay Verma`;

  if (tone === 'Formal') {
    greetings = `Dear ${senderName || 'Sir/Madam'},`;
    signoff = `Sincerely,\nAbhay Verma\nLead Engineer`;
  } else if (tone === 'Friendly') {
    greetings = `Hey ${name}! 😊`;
    signoff = `Cheers,\nAbhay`;
  } else if (tone === 'Concise') {
    greetings = `Hi ${name},`;
    signoff = `Thanks,\nAbhay`;
  } else if (tone === 'Urgent') {
    greetings = `Hi ${name} - Action confirmed:`;
    signoff = `Best,\nAbhay`;
  }

  let coreBody = '';
  if (tone === 'Concise') {
    coreBody = `Received with thanks regarding "${cleanSubj}". I have reviewed the details and will proceed as requested.`;
  } else if (tone === 'Friendly') {
    coreBody = `Thanks so much for reaching out with this update! Everything looks super solid on my end regarding ${cleanSubj}. I'll get back to you shortly with any additional notes.`;
  } else if (tone === 'Formal') {
    coreBody = `Thank you for your correspondence concerning "${cleanSubj}". I have thoroughly reviewed the documentation and will ensure all action items are completed in accordance with the outlined timeline.`;
  } else if (tone === 'Urgent') {
    coreBody = `Acknowledged. I am prioritizing this immediately and will have the deliverables completed and sent over as soon as possible.`;
  } else {
    // Professional
    coreBody = `Thank you for sharing the update on "${cleanSubj}". I have reviewed the information and agree with the proposed steps. I will follow up with the completed items by the requested timeline.`;
  }

  if (userNotes) {
    coreBody += `\n\nNote: ${userNotes}`;
  }

  return `${greetings}\n\n${coreBody}\n\n${signoff}`;
}

function generateHeuristicClassification(subject, body) {
  const content = `${subject} ${body}`.toLowerCase();
  
  let category = 'General';
  let priority = 'Medium';
  let reason = 'Standard correspondence';

  if (/invoice|payment|payout|\$|receipt|bill|subscription|stripe|bank/i.test(content)) {
    category = 'Finance';
    priority = /urgent|unpaid|due/i.test(content) ? 'High' : 'Medium';
    reason = 'Contains financial/payment transaction details';
  } else if (/urgent|asap|critical|board meeting|milestone|security audit/i.test(content)) {
    category = 'Work';
    priority = 'High';
    reason = 'Urgent work deadlines or critical milestone review';
  } else if (/keynote|speaker|symposium|course|stanford|learn|webinar/i.test(content)) {
    category = 'Education';
    priority = 'High';
    reason = 'Educational conference or learning opportunity';
  } else if (/sale|discount|off|deal|coupon|promotions/i.test(content)) {
    category = 'Promotions';
    priority = 'Low';
    reason = 'Promotional marketing offer';
  } else if (/flight|hotel|vacation|trip|family|dinner/i.test(content)) {
    category = 'Personal';
    priority = 'Low';
    reason = 'Personal itinerary or non-urgent updates';
  } else if (/project|figma|pr |pull request|deploy|api|github/i.test(content)) {
    category = 'Work';
    priority = 'Medium';
    reason = 'Technical or design work collaboration';
  }

  return { category, priority, reason };
}

function generateHeuristicActionItems(body) {
  const items = [];
  const lines = (body || '').split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    const numberedMatch = trimmed.match(/^\d+[\.\)]\s*(.*)/);
    const bulletMatch = trimmed.match(/^[-*•]\s*(.*)/);
    const deadlineMatch = trimmed.match(/(?:by|before|on|at|due)\s+([A-Za-z]+(?:\s+\d{1,2}(?:st|nd|rd|th)?)?(?:\s+at\s+\d{1,2}(?::\d{2})?\s*(?:AM|PM)?)?)/i);

    if (numberedMatch) {
      items.push({
        task: numberedMatch[1],
        deadline: deadlineMatch ? deadlineMatch[0] : 'See email context'
      });
    } else if (bulletMatch && /submit|review|confirm|schedule|upload|complete|send/i.test(trimmed)) {
      items.push({
        task: bulletMatch[1],
        deadline: deadlineMatch ? deadlineMatch[0] : 'Specified in thread'
      });
    }
  }

  return items;
}

function generateHeuristicExplanation(subject, body) {
  return `### Plain English Breakdown for "${subject}"

**What this email is really saying:**
The sender is communicating an important status update and outlining specific steps they need from you.

**Key Points in Simple Terms:**
- **Context:** An update regarding ongoing projects or services.
- **Why it matters:** It keeps operations on track and ensures all stakeholders are aligned.
- **What you need to do:** Review the requested action items, verify any upcoming deadlines, and reply if any clarification is needed.

**No complex jargon required!**`;
}
