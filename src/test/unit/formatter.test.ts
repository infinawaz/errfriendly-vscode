import * as assert from 'assert';
import { formatExplanation } from '../../formatter';
import { ErrFriendlyResponse } from '../../types';

describe('Formatter Tests', () => {
    it('should format simple error correctly', () => {
        const response: ErrFriendlyResponse = {
            error_type: "ValueError",
            short_message: "Invalid value",
            friendly_explanation: "You passed a wrong value.",
            suggested_fixes: ["Fix it", "Check inputs"],
            confidence: 0.95,
            documentation_link: null
        };

        const formatted = formatExplanation(response);
        assert.ok(formatted.includes("### 🐞 ValueError: Invalid value"));
        assert.ok(formatted.includes("You passed a wrong value."));
        assert.ok(formatted.includes("- Fix it"));
        assert.ok(formatted.includes("- Check inputs"));
        assert.ok(formatted.includes("Confidence: 95%"));
    });
});
