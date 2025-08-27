package service

import "github.com/lakshya1goel/resume-assistant/internal/api/repo"

type ResumeAnalysisService interface {
}

type resumeAnalysisService struct {
	repo *repo.ResumeAnalysisRepo
}

func NewResumeAnalysisService(repo *repo.ResumeAnalysisRepo) ResumeAnalysisService {
	return &resumeAnalysisService{repo: repo}
}
