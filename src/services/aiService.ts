import { OKR, QUALITY_CHECKLIST_ITEMS, formatKRValue, KeyResultUnit } from '../types';

export interface AISuggestion {
  type: 'objective' | 'keyResult';
  area?: string;  // Which area OKR (if applicable)
  krIndex?: number;  // Which key result (0-indexed)
  original: string;
  proposed: string;
  reason: string;
}

interface AIFeedbackResponse {
  success: boolean;
  feedback?: string;
  suggestion?: AISuggestion;
  error?: string;
}

interface OKRData {
  objective: string;
  area?: string;
  keyResults: { metricName: string; from: number; to: number; unit?: KeyResultUnit }[];
}

export interface TreeOKRData {
  globalOKR: {
    objective: string;
    keyResults: { metricName: string; from: number; to: number; unit?: KeyResultUnit }[];
  };
  areaOKRs: {
    area: string;
    objective: string;
    keyResults: { metricName: string; from: number; to: number; unit?: KeyResultUnit }[];
  }[];
}

function buildPrompt(okrData: OKRData, parentOKR?: OKR): string {
  const isGlobalOKR = !parentOKR;

  const okrKRs = okrData.keyResults
    .filter(kr => kr.metricName.trim())
    .map(kr => `  - ${kr.metricName}: ${formatKRValue(kr.from, kr.unit)} → ${formatKRValue(kr.to, kr.unit)}`)
    .join('\n');

  const checklistCriteria = QUALITY_CHECKLIST_ITEMS
    .map((item, i) => `${i + 1}. ${item.title} - ${item.question}`)
    .join('\n');

  if (isGlobalOKR) {
    // Prompt for Global OKRs (no parent)
    return `You are an OKR coach helping evaluate a Global OKR for quality. Provide constructive, actionable feedback.

GLOBAL OKR BEING EVALUATED:
- Objective: ${okrData.objective}
- Key Results:
${okrKRs || '  (No key results defined yet)'}

QUALITY CHECKLIST CRITERIA:
${checklistCriteria}

Please provide feedback in the following format:

**Overall Assessment**
(1-2 sentences summarizing the OKR quality)

**Strengths**
- (What's working well)

**Areas for Improvement**
- (Specific suggestions to improve the OKR)

Keep your response concise and actionable. Focus on helping the OKR author improve outcomes-based thinking rather than activity-based thinking.`;
  } else {
    // Prompt for Area OKRs (with parent)
    const parentKRs = parentOKR.keyResults
      .map(kr => `  - ${kr.metricName}: ${formatKRValue(kr.from, kr.unit)} → ${formatKRValue(kr.to, kr.unit)}`)
      .join('\n');

    return `You are an OKR coach helping evaluate an Area OKR for alignment and quality. Provide constructive, actionable feedback.

PARENT GLOBAL OKR:
- Objective: ${parentOKR.objective}
- Key Results:
${parentKRs}

AREA OKR BEING EVALUATED:
- Area: ${okrData.area || 'Unspecified'}
- Objective: ${okrData.objective}
- Key Results:
${okrKRs || '  (No key results defined yet)'}

QUALITY CHECKLIST CRITERIA:
${checklistCriteria}

Please provide feedback in the following format:

**Overall Assessment**
(1-2 sentences summarizing the OKR quality)

**Strengths**
- (What's working well)

**Areas for Improvement**
- (Specific suggestions to improve the OKR)

**Alignment with Global OKR**
(High/Medium/Low) - (Brief explanation of how well this Area OKR supports the parent Global OKR)

Keep your response concise and actionable. Focus on helping the OKR author improve outcomes-based thinking rather than activity-based thinking.`;
  }
}

export async function getAIFeedback(
  okrData: OKRData,
  parentOKR?: OKR
): Promise<AIFeedbackResponse> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.'
    };
  }

  const prompt = buildPrompt(okrData, parentOKR);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `API request failed: ${errorData.error?.message || response.statusText}`
      };
    }

    const data = await response.json();
    const feedback = data.content?.[0]?.text;

    if (!feedback) {
      return {
        success: false,
        error: 'No feedback received from AI'
      };
    }

    return {
      success: true,
      feedback
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function buildTreePrompt(treeData: TreeOKRData): string {
  const formatKRList = (krs: { metricName: string; from: number; to: number; unit?: KeyResultUnit }[]) => {
    if (krs.length === 0) return '  (No key results defined)';
    return krs
      .filter(kr => kr.metricName.trim())
      .map(kr => `  - ${kr.metricName}: ${formatKRValue(kr.from, kr.unit)} → ${formatKRValue(kr.to, kr.unit)}`)
      .join('\n');
  };

  const globalKRs = formatKRList(treeData.globalOKR.keyResults);

  const areaOKRsSection = treeData.areaOKRs.length === 0
    ? '(No Area OKRs defined yet)'
    : treeData.areaOKRs.map(areaOkr => `
**${areaOkr.area}**
- Objective: ${areaOkr.objective}
- Key Results:
${formatKRList(areaOkr.keyResults)}`).join('\n');

  return `You are an OKR coach. Evaluate this OKR tree and provide CONCISE feedback plus ONE specific improvement suggestion.

GLOBAL OKR:
- Objective: ${treeData.globalOKR.objective}
- Key Results:
${globalKRs}

AREA OKRs (${treeData.areaOKRs.length} total):
${areaOKRsSection}

Respond with ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "feedback": {
    "assessment": "1-2 sentence overall assessment",
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"],
    "alignment": "High/Medium/Low - brief explanation"
  },
  "suggestion": {
    "type": "objective" or "keyResult",
    "area": "area name if Area OKR, or null if Global OKR",
    "krIndex": key result index (0-based) if type is keyResult, or null,
    "original": "the current text that should be changed",
    "proposed": "the improved version",
    "reason": "brief reason for this change"
  }
}

IMPORTANT:
- Pick ONE specific, impactful change for the suggestion
- The suggestion should improve measurability, clarity, or alignment
- Keep feedback brief - max 2 items per array
- Return ONLY the JSON, nothing else`;
}

export async function getTreeAIFeedback(
  treeData: TreeOKRData
): Promise<AIFeedbackResponse> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'Anthropic API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file.'
    };
  }

  const prompt = buildTreePrompt(treeData);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: `API request failed: ${errorData.error?.message || response.statusText}`
      };
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text;

    if (!rawText) {
      return {
        success: false,
        error: 'No feedback received from AI'
      };
    }

    // Parse the JSON response
    try {
      const parsed = JSON.parse(rawText);

      // Format feedback as readable text
      const feedbackText = formatParsedFeedback(parsed.feedback);

      // Extract suggestion
      const suggestion: AISuggestion | undefined = parsed.suggestion ? {
        type: parsed.suggestion.type,
        area: parsed.suggestion.area || undefined,
        krIndex: parsed.suggestion.krIndex ?? undefined,
        original: parsed.suggestion.original,
        proposed: parsed.suggestion.proposed,
        reason: parsed.suggestion.reason
      } : undefined;

      return {
        success: true,
        feedback: feedbackText,
        suggestion
      };
    } catch {
      // If JSON parsing fails, return raw text as feedback
      return {
        success: true,
        feedback: rawText
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

function formatParsedFeedback(feedback: {
  assessment: string;
  strengths: string[];
  improvements: string[];
  alignment: string;
}): string {
  let text = `**Overall Assessment**\n${feedback.assessment}\n\n`;

  if (feedback.strengths?.length > 0) {
    text += `**Strengths**\n${feedback.strengths.map(s => `- ${s}`).join('\n')}\n\n`;
  }

  if (feedback.improvements?.length > 0) {
    text += `**Areas for Improvement**\n${feedback.improvements.map(i => `- ${i}`).join('\n')}\n\n`;
  }

  if (feedback.alignment) {
    text += `**Alignment**\n${feedback.alignment}`;
  }

  return text;
}
