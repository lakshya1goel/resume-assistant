package controller

import "github.com/lakshya1goel/resume-assistant/internal/api/service"

type ResumeAnalysisController struct {
	service *service.ResumeAnalysisService
}

func NewResumeAnalysisController(service *service.ResumeAnalysisService) *ResumeAnalysisController {
	return &ResumeAnalysisController{service: service}
}
