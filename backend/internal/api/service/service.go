package service

import (
	"context"
	"fmt"

	"github.com/lakshya1goel/resume-assistant/config"
	"github.com/lakshya1goel/resume-assistant/internal/ai"
)

type ResumeAnalysisService interface {
	AnalyzeResume(ctx context.Context, pdfBytes []byte, jobURL string) (string, error)
}

type resumeAnalysisService struct {
	aiClient ai.AIClient
}

func NewResumeAnalysisService() ResumeAnalysisService {
	return &resumeAnalysisService{
		aiClient: *ai.NewAIClient(config.GetAPIKey()),
	}
}

func (s *resumeAnalysisService) AnalyzeResume(ctx context.Context, pdfBytes []byte, jobURL string) (string, error) {
	suggestions, err := s.aiClient.AnalyzeResume(ctx, pdfBytes, jobURL)
	if err != nil {
		return "", fmt.Errorf("failed to analyze resume: %w", err)
	}

	return suggestions, nil
}
