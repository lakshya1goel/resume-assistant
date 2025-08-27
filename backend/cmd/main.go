package main

import (
	"github.com/gin-gonic/gin"
	"github.com/lakshya1goel/resume-assistant/config"
	"github.com/lakshya1goel/resume-assistant/internal/api/controller"
	"github.com/lakshya1goel/resume-assistant/internal/api/routes"
)

func main() {
	config.LoadEnv()

	router := gin.Default()
	apiRouter := router.Group("/api")
	{
		routes.ResumeAnalysisRoutes(apiRouter, controller.NewResumeAnalysisController())
	}

	router.Run(":8084")
}
