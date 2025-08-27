package repo

type ResumeAnalysisRepo interface {
}

type resumeAnalysisRepo struct {
}

func NewResumeAnalysisRepo() ResumeAnalysisRepo {
	return &resumeAnalysisRepo{}
}