package controller

import (
	"io"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/lakshya1goel/resume-assistant/internal/api/dtos"
	"github.com/lakshya1goel/resume-assistant/internal/api/service"
)

type ResumeAnalysisController struct {
	service service.ResumeAnalysisService
}

func NewResumeAnalysisController() *ResumeAnalysisController {
	return &ResumeAnalysisController{
		service: service.NewResumeAnalysisService(),
	}
}

func (c *ResumeAnalysisController) AnalyzeResume(ctx *gin.Context) {
	file, header, err := ctx.Request.FormFile("resume")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Error:     "Resume PDF file is required",
			Success:   false,
			Timestamp: time.Now(),
		})
		return
	}
	defer file.Close()

	contentType := header.Header.Get("Content-Type")
	if contentType != "application/pdf" {
		ctx.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Error:     "Only PDF files are allowed",
			Success:   false,
			Timestamp: time.Now(),
		})
		return
	}

	if header.Size > 10*1024*1024 {
		ctx.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Error:     "File size must be less than 10MB",
			Success:   false,
			Timestamp: time.Now(),
		})
		return
	}

	pdfBytes, err := io.ReadAll(file)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
			Error:     "Failed to read PDF file",
			Success:   false,
			Timestamp: time.Now(),
		})
		return
	}

	jobURL := ctx.PostForm("job_url")
	if jobURL == "" {
		ctx.JSON(http.StatusBadRequest, dtos.ErrorResponse{
			Error:     "Job description URL is required",
			Success:   false,
			Timestamp: time.Now(),
		})
		return
	}

	suggestions, err := c.service.AnalyzeResume(ctx, pdfBytes, jobURL)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, dtos.ErrorResponse{
			Error:     err.Error(),
			Success:   false,
			Timestamp: time.Now(),
		})
		return
	}

	ctx.JSON(http.StatusOK, dtos.AnalyzeResponse{
		Suggestions: suggestions,
		Message:     "Resume analyzed successfully",
		Success:     true,
		Timestamp:   time.Now(),
	})
}
