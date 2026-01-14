import { OKR, QUALITY_CHECKLIST_ITEMS, formatKRValue, KeyResultUnit } from '../types';

interface AIFeedbackResponse {
  success: boolean;
  feedback?: string;
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

  const checklistCriteria = QUALITY_CHECKLIST_ITEMS
    .map((item, i) => `${i + 1}. ${item.title} - ${item.question}`)
    .join('\n');

  return `You are an OKR coach helping evaluate an entire OKR tree (Global OKR + Area OKRs) for quality and alignment. Provide constructive, actionable feedback.

GLOBAL OKR:
- Objective: ${treeData.globalOKR.objective}
- Key Results:
${globalKRs}

AREA OKRs (${treeData.areaOKRs.length} total):
${areaOKRsSection}

QUALITY CHECKLIST CRITERIA:
${checklistCriteria}

Please provide feedback in the following format:

**Overall Tree Assessment**
(2-3 sentences summarizing the overall quality of this OKR tree)

**Global OKR Feedback**
- Strengths: (What's working well)
- Areas for Improvement: (Specific suggestions)

**Area OKR Highlights**
(Brief assessment of each area - focus on notable strengths or issues. If many areas, group similar feedback.)

**Alignment Analysis**
(High/Medium/Low) - How well do the Area OKRs cascade from and support the Global OKR? Are there gaps or redundancies?

**Top Recommendations**
1. (Most impactful improvement for this OKR tree)
2. (Second priority)
3. (Third priority)

Keep your response concise but comprehensive. Focus on actionable insights that will help improve OKR quality and alignment across the organization.`;
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
