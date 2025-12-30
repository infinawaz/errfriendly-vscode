import { ErrFriendlyResponse } from './types';

export function formatExplanation(response: ErrFriendlyResponse): string {
    const fixes = response.suggested_fixes.map(fix => `- ${fix}`).join('\n');
    return `### 🐞 ${response.error_type}: ${response.short_message}
    
${response.friendly_explanation}

**Suggested Fixes:**
${fixes}

---
*Confidence: ${(response.confidence * 100).toFixed(0)}%*
`;
}
