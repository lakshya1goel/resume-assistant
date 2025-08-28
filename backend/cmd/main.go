package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/lakshya1goel/resume-assistant/config"
	"github.com/lakshya1goel/resume-assistant/internal/api/controller"
	"github.com/lakshya1goel/resume-assistant/internal/api/routes"
)

func main() {
	config.LoadEnv()

	router := gin.Default()

	// Configure CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	apiRouter := router.Group("/api")
	{
		routes.ResumeAnalysisRoutes(apiRouter, controller.NewResumeAnalysisController())
	}

	router.Run(":8084")
}
