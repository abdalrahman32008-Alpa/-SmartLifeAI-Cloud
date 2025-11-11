import { useState, useEffect } from "react"
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
  const [completedTasks, setCompletedTasks] = useState<{
    id: string
    title: string
  }[]>([])
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useEffect(() => {
    fetchCompletedTasks()
  }, [])

  const fetchCompletedTasks = async () => {
    try {
      setError("")
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setCompletedTasks([])
        return
      }

      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("id, title")
        .eq("user_id", user.id)
        .eq("completed", true)
        .order("created_at", { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setCompletedTasks(data || [])
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch completed tasks")
    }
  }

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

      // Insert mood log to Supabase, including related_task_id if selected
      const payload: any = {
        mood_score: moodScore,
        user_id: user.id,
      }

      if (selectedTaskId) payload.related_task_id = selectedTaskId

      const { error: insertError } = await supabase.from("mood_logs").insert([
        payload,
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
          {/* Select dropdown for recently completed tasks */}
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Link to a recently completed task? (Optional)</label>
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={selectedTaskId ?? ""}
              onChange={(e) => setSelectedTaskId(e.target.value || null)}
            >
              <option value="">-- No task --</option>
              {completedTasks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
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
