const OpenAI = require('openai');

let openai;
try {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} catch (e) {
  console.warn('⚠️  OpenAI not configured. AI features will use fallback data.');
}

/**
 * Generate a dynamic life scenario using GPT-4o-mini
 */
const generateScenario = async ({ currentStage, userProfile, previousDecisions, currentScores, scenarioCount }) => {
  if (!openai) return null;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are PathWeaver's Story Engine — a creative AI generating realistic life scenarios for an interactive life simulator.

RULES:
1. Generate a scenario for the "${currentStage}" life stage
2. Tailor to user's interests: ${userProfile?.interests?.join(', ') || 'general'}
3. Reference previous decisions for continuity when relevant
4. Each scenario must have EXACTLY 3-4 choices with meaningful tradeoffs
5. Score effects must be integers from -10 to +10
6. No choice should be obviously "best" — each has pros and cons
7. Make scenarios vivid, engaging, and age-appropriate

Return ONLY valid JSON:
{
  "title": "short scenario title",
  "text": "2-3 sentence vivid scenario description",
  "stage": "current stage name",
  "choices": [
    {
      "id": "c1",
      "text": "choice description",
      "effects": { "career": 0, "health": 0, "finance": 0, "relationships": 0, "happiness": 0, "knowledge": 0 },
      "consequence": "2-3 sentence consequence narration"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Generate scenario #${scenarioCount || 1} for the ${currentStage} stage.

User: ${userProfile?.name || 'Player'}, age ${userProfile?.age || 20}, interests: ${userProfile?.interests?.join(', ') || 'various'}

Previous decisions: ${previousDecisions?.length > 0
  ? previousDecisions.slice(-3).map(d => `[${d.stage}] ${d.choiceText}`).join('; ')
  : 'None yet'}

Current scores: Career=${currentScores?.career || 50}, Health=${currentScores?.health || 50}, Finance=${currentScores?.finance || 50}, Relationships=${currentScores?.relationships || 50}, Happiness=${currentScores?.happiness || 50}`
        }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    const content = response.choices[0]?.message?.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI scenario generation error:', error.message);
    return null;
  }
};

/**
 * Generate consequence narration for a choice
 */
const generateConsequence = async ({ choiceText, scenarioTitle, stage, effects, userName }) => {
  if (!openai) return null;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a narrative writer for PathWeaver, a life simulator. Write vivid, emotionally engaging consequence descriptions. Keep it to 2-3 sentences. Reference the user by name.'
        },
        {
          role: 'user',
          content: `User "${userName || 'the player'}" chose: "${choiceText}" in scenario: "${scenarioTitle}" during the ${stage} stage.
Score effects: ${JSON.stringify(effects)}

Write a vivid consequence narration.`
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI consequence error:', error.message);
    return null;
  }
};

/**
 * Generate personalized feedback after journey completion
 */
const generateFeedback = async ({ startingStage, decisions, scores, exploredStages, userName }) => {
  if (!openai) return null;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a thoughtful life coach for PathWeaver, a life simulator. Generate warm, insightful, encouraging personalized feedback. Write 4-5 paragraphs.'
        },
        {
          role: 'user',
          content: `Generate personalized life analysis for ${userName || 'the player'}:

- Starting stage: ${startingStage}
- Stages explored: ${exploredStages?.join(', ') || 'unknown'}
- Total decisions: ${decisions?.length || 0}
- Key decisions: ${decisions?.slice(0, 5).map(d => `[${d.stage}] ${d.choiceText}`).join('; ') || 'None'}
- Final scores: Career=${scores?.career}%, Health=${scores?.health}%, Finance=${scores?.finance}%, Relationships=${scores?.relationships}%, Happiness=${scores?.happiness}%

Include:
1. Acknowledge their unique journey
2. Highlight strengths with specific decision references
3. Identify growth areas with empathy
4. Note the most impactful decision
5. End with encouragement to try again`
        }
      ],
      temperature: 0.7,
      max_tokens: 600
    });

    return response.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('OpenAI feedback error:', error.message);
    return null;
  }
};

module.exports = { generateScenario, generateConsequence, generateFeedback };
