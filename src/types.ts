export interface ErrFriendlyResponse {
    error_type: string;
    short_message: string;
    friendly_explanation: string;
    suggested_fixes: string[];
    confidence: number;
    documentation_link: string | null;
}
