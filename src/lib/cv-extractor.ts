import openai from './ai-service';
import { CV_EXTRACTION_PROMPT } from '../prompts';

export interface ExtractedCVData {
  personal_info: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  summary?: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
    key_achievements: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
  languages: string[];
}

export async function extractStructuredDataFromCV(text: string): Promise<ExtractedCVData> {
  const prompt = CV_EXTRACTION_PROMPT.replace('{{text}}', text);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a professional HR assistant specializing in CV analysis.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    return JSON.parse(content) as ExtractedCVData;
  } catch (error) {
    console.error('Error in structured data extraction:', error);
    throw new Error('Failed to extract data from CV using AI');
  }
}
