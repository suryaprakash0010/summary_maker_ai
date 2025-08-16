import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

const SUMMARY_TEMPLATES = {
  standard: {
    name: "Standard Meeting",
    prompt: `Analyze this meeting transcript and create a comprehensive summary with the following structure:

**Key Discussion Points:**
- Main topics discussed
- Important insights shared

**Decisions Made:**
- Clear decisions reached
- Rationale behind decisions

**Action Items:**
- Specific tasks assigned
- Responsible parties
- Deadlines mentioned

**Next Steps:**
- Follow-up actions required
- Future meeting plans

Format the response with clear bullet points and maintain a professional tone.`
  },
  executive: {
    name: "Executive Summary",
    prompt: `Create an executive-level summary focusing on:

**Strategic Outcomes:**
- High-level decisions made
- Business impact and implications

**Key Stakeholder Commitments:**
- Leadership decisions
- Resource allocations
- Strategic direction changes

**Critical Action Items:**
- Priority initiatives
- Executive-level follow-ups
- Timeline for major deliverables

Keep the summary concise and focused on strategic value and business impact.`
  },
  technical: {
    name: "Technical Meeting",
    prompt: `Summarize this technical meeting with focus on:

**Technical Decisions:**
- Architecture choices made
- Technology selections
- Implementation approaches

**Development Items:**
- Code reviews discussed
- Technical debt identified
- Performance considerations

**Action Items:**
- Development tasks assigned
- Technical research needed
- Code changes required

**Blockers & Dependencies:**
- Technical challenges identified
- External dependencies
- Resource requirements

Use technical terminology appropriately and focus on implementation details.`
  }
};

export async function POST(request) {
  try {
    const { transcript, prompt: customPrompt, summaryType } = await request.json();

    if (!transcript || !transcript.trim()) {
      return Response.json({ error: "Transcript is required" }, { status: 400 });
    }

    // Select the appropriate prompt
    let finalPrompt = customPrompt;
    let templateName = "Custom";

    if (summaryType && summaryType !== "custom" && SUMMARY_TEMPLATES[summaryType]) {
      finalPrompt = SUMMARY_TEMPLATES[summaryType].prompt;
      templateName = SUMMARY_TEMPLATES[summaryType].name;
    }

    const systemPrompt = `You are an expert meeting summarizer. Your task is to analyze meeting transcripts and create clear, actionable summaries.

Guidelines:
- Be concise but comprehensive
- Focus on actionable items and decisions
- Use bullet points for clarity
- Maintain professional tone
- Highlight important deadlines and commitments
- If information is unclear, note it as "needs clarification"`;

    const response = await generateText({
      model: groq("llama3-70b-8192"),
      system: systemPrompt,
      prompt: `${finalPrompt}\n\nMeeting Transcript:\n${transcript}`,
      maxTokens: 1000,
      temperature: 0.3
    });

    const summary = response.text;

    // Calculate word count
    const wordCount = summary
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    return Response.json({
      summary,
      wordCount,
      summaryType: templateName,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Summarization error:", error);
    return Response.json(
      { error: "Failed to generate summary. Please try again." },
      { status: 500 }
    );
  }
}
