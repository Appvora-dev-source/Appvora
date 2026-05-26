export const CV_EXTRACTION_PROMPT = `
Extract professional information from the following CV text. 
Return the data in a structured JSON format with the following keys:
- personal_info (name, email, phone, location)
- summary
- skills (as a list of strings)
- experience (list of objects with title, company, duration, description, key_achievements)
- education (list of objects with degree, institution, year)
- certifications (list of strings)
- languages (list of strings)

CV Text:
"""
{{text}}
"""
`;

export const RESUME_ADVISOR_PROMPT = `
Analyze the following extracted CV data and provide:
1. A professional score (0-100) based on completeness, clarity, and impact.
2. A list of actionable suggestions for improvement.
3. A list of potentially missing skills common for the candidate's profile.

CV Data:
{{cvData}}
`;
