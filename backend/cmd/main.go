package main

import (
	"os"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/lakshya1goel/resume-assistant/config"
	"github.com/lakshya1goel/resume-assistant/internal/api/controller"
	"github.com/lakshya1goel/resume-assistant/internal/api/routes"
)

func main() {
	config.LoadEnv()

	router := gin.Default()

	allowedOriginsEnv := os.Getenv("ALLOWED_ORIGINS")
	var allowedOrigins []string

	if allowedOriginsEnv != "" {
		allowedOrigins = strings.Split(allowedOriginsEnv, ",")
	}
	corsConfig := cors.Config{
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}

	corsConfig.AllowOrigins = allowedOrigins
	router.Use(cors.New(corsConfig))

	apiRouter := router.Group("/api")
	{
		routes.ResumeAnalysisRoutes(apiRouter, controller.NewResumeAnalysisController())
	}

	router.Run(":8084")
}
