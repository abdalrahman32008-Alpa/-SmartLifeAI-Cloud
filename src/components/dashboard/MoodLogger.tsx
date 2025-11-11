import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

interface MoodOption {
  emoji: string
  label: string
  score: number
}

const moodOptions: MoodOption[] = [
  { emoji: "😊", label: "Great", score: 5 },
  { emoji: "🙂", label: "Good", score: 4 },
  { emoji: "😐", label: "Okay", score: 3 },
  { emoji: "😕", label: "Bad", score: 2 },
  { emoji: "😟", label: "Awful", score: 1 },
]

export default function MoodLogger() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [lastMood, setLastMood] = useState<number | null>(null)

  const handleMoodSelect = async (moodScore: number) => {
    try {
      setLoading(true)
      setError("")

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("User not authenticated")
        return
      }

      // Insert mood log to Supabase
      const { error: insertError } = await supabase.from("mood_logs").insert([
        {
          mood_score: moodScore,
          user_id: user.id,
        },
      ])

      if (insertError) {
        setError(insertError.message)
      } else {
        setLastMood(moodScore)
        // Clear success message after 2 seconds
        setTimeout(() => setLastMood(null), 2000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to log mood")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>How are you feeling right now?</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {lastMood && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            ✅ Mood logged successfully!
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {moodOptions.map((mood) => (
            <Button
              key={mood.score}
              onClick={() => handleMoodSelect(mood.score)}
              disabled={loading}
              variant={lastMood === mood.score ? "default" : "outline"}
              className="flex flex-col items-center gap-1 h-auto py-4 px-6"
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium">{mood.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
