export interface AnalyzeResponse {
    suggestions: string;
    message: string;
    success: boolean;
    timestamp: string;
}

export interface ErrorResponse {
    error: string;
    success: boolean;
    timestamp: string;
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    }

    async analyzeResume(file: File, jobUrl: string): Promise<AnalyzeResponse> {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('job_url', jobUrl);

        const response = await fetch(`${this.baseUrl}/api/resume-analysis/`, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error((data as ErrorResponse).error || 'An error occurred');
        }

        return data as AnalyzeResponse;
    }

    validateFile(file: File): string | null {
        if (file.type !== 'application/pdf') {
            return 'Please select a PDF file';
        }
        if (file.size > 10 * 1024 * 1024) {
            return 'File size must be less than 10MB';
        }
        return null;
    }
}

export const apiService = new ApiService(); 