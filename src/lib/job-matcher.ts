export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let mA = 0;
  let mB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }

  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);

  if (mA === 0 || mB === 0) {
    return 0;
  }

  return dotProduct / (mA * mB);
}

export function calculateMatchScore(
  userSkills: string[],
  jobDescription: string,
  userEmbedding: number[],
  jobEmbedding: number[]
): number {
  const semanticScore = cosineSimilarity(userEmbedding, jobEmbedding);

  // Keyword match boost
  const lowerCaseDesc = jobDescription.toLowerCase();
  const matchedSkills = userSkills.filter(skill => 
    lowerCaseDesc.includes(skill.toLowerCase())
  );
  
  const keywordScore = userSkills.length > 0 
    ? matchedSkills.length / userSkills.length 
    : 0;

  // Weighted average: 70% semantic, 30% keyword
  return (semanticScore * 0.7) + (keywordScore * 0.3);
}
