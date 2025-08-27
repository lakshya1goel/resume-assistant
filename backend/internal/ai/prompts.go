package ai

import (
	"context"
	"io"
	"os"

	"google.golang.org/genai"
)

func (a *AIClient) SuggestResumeImprovements(ctx context.Context, resumeFilePath, jobURL string) (string, error) {
	file, err := os.Open(resumeFilePath)
	if err != nil {
		return "", err
	}
	defer file.Close()

	pdfBytes, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	prompt := a.prompt(jobURL)

	parts := []*genai.Part{
		{
			InlineData: &genai.Blob{
				MIMEType: "application/pdf",
				Data:     pdfBytes,
			},
		},
		genai.NewPartFromText(prompt),
	}

	contents := []*genai.Content{
		genai.NewContentFromParts(parts, genai.RoleUser),
	}

	result, err := a.Client.Models.GenerateContent(
		ctx,
		"gemini-2.5-flash",
		contents,
		nil,
	)
	if err != nil {
		return "", err
	}

	return result.Text(), nil
}

func (a *AIClient) prompt(jobURL string) string {
	prompt := `
		You are a career coach. 

		First, open the job posting URL and extract the relevant job description, requirements, and responsibilities from the job posting. Then analyze the uploaded resume PDF and suggest improvements to make it better aligned with the extracted job description.

		Job Posting Link:
		` + jobURL + `

		Please:
		1. Extract the key job requirements, responsibilities, and skills from the job posting do not show the job posting in the output
		2. Analyze the uploaded resume PDF 
		3. Suggest specific improvements to better align the resume with the job requirements
		4. Output your suggestions in bullet points only
		5. Focus on actionable recommendations
		6. Do not add any other text in the output like here is the analysis, here is the job description, etc.
		`

	return prompt
}
