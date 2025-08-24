package ai

import (
	"context"
	"fmt"

	"google.golang.org/genai"
)

type AIClient struct {
	Client *genai.Client
}

func NewAIClient(apiKey string) *AIClient {
	ctx := context.Background()

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		fmt.Println(err)
	}

	return &AIClient{Client: client}
}
