package dtos

import "time"

type AnalyzeResponse struct {
	Suggestions string    `json:"suggestions"`
	Message     string    `json:"message"`
	Success     bool      `json:"success"`
	Timestamp   time.Time `json:"timestamp"`
}

type ErrorResponse struct {
	Error     string    `json:"error"`
	Success   bool      `json:"success"`
	Timestamp time.Time `json:"timestamp"`
}
