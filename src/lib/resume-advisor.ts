import openai from './ai-service';
import { RESUME_ADVISOR_PROMPT } from '../prompts';
import { ExtractedCVData } from './cv-extractor';

export interface ResumeAdvice {
  score: number;
  suggestions: string[];
  missing_skills: string[];
}

export async function getResumeImprovementSuggestions(cvData: ExtractedCVData): Promise<ResumeAdvice> {
  const prompt = RESUME_ADVISOR_PROMPT.replace('{{cvData}}', JSON.stringify(cvData, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a career coach helping users improve their resumes.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    return JSON.parse(content) as ResumeAdvice;
  } catch (error) {
    console.error('Error getting resume suggestions:', error);
    throw new Error('Failed to get resume improvement suggestions');
  }
}
