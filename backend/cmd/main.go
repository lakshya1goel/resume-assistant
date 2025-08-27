package main

import (
	"context"
	"fmt"
	"log"

	"github.com/lakshya1goel/resume-assistant/config"
	"github.com/lakshya1goel/resume-assistant/internal/ai"
)

func main() {
	config.LoadEnv()
	apiKey := config.GetAPIKey()

	client := ai.NewAIClient(apiKey)

	improvements, err := client.SuggestResumeImprovements(context.Background(), "resume.pdf", "https://tukatuu.com/job/ai-backend-developer")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(improvements)
}
