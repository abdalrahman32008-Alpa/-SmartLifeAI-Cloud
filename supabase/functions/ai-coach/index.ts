import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { prompt, userToken } = await req.json()

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "No prompt provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")
    const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

    // Get user ID from auth header or token
    const authHeader = req.headers.get("Authorization")
    let userId: string | null = null

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7)
      const {
        data: { user },
      } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    let contextStr = ""

    // Fetch context if user is authenticated
    if (userId) {
      try {
        // Fetch last 5 tasks
        const { data: tasksData } = await supabase
          .from("tasks")
          .select("title, completed")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)

        // Fetch last 5 mood logs
        const { data: moodData } = await supabase
          .from("mood_logs")
          .select("mood_score, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)

        // Build context string
        let contextParts = []

        if (tasksData && tasksData.length > 0) {
          const tasksList = tasksData
            .map((t: any) => `- ${t.title} (${t.completed ? "completed" : "pending"})`)
            .join("\n")
          contextParts.push(`Recent tasks:\n${tasksList}`)
        }

        if (moodData && moodData.length > 0) {
          const moodScores = moodData.map((m: any) => m.mood_score)
          const avgMood = (moodScores.reduce((a: number, b: number) => a + b, 0) / moodScores.length).toFixed(1)
          const moodLabel =
            avgMood >= 4.5
              ? "Great"
              : avgMood >= 3.5
                ? "Good"
                : avgMood >= 2.5
                  ? "Okay"
                  : "Struggling"
          contextParts.push(`Recent mood: Average ${avgMood}/5 (${moodLabel})`)
        }

        if (contextParts.length > 0) {
          contextStr = `\n\nUser context:\n${contextParts.join("\n\n")}\n`
        }
      } catch (err) {
        console.error("Error fetching context:", err)
        // Continue without context if fetch fails
      }
    }

    // Call Gemini API
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const systemPrompt = `You are a Critical Thinking Coach. You do not give direct answers. You only ask insightful Socratic questions to help the user think deeper. Never be judgmental. Always be supportive.${contextStr}`

    const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: systemPrompt,
            },
          ],
        },
      }),
    })

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("Gemini API error:", geminiResponse.status, errorText)
      return new Response(
        JSON.stringify({
          error: "Failed to get AI response",
          details: errorText,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const geminiData = await geminiResponse.json()
    const reply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response."

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    })
  } catch (err) {
    console.error("Error:", err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    )
  }
})
