import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

interface Task {
  id: string
  title: string
  completed: boolean
  user_id: string
  created_at: string
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Read: Fetch tasks from Supabase on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
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

      // Fetch tasks ordered by created_at
      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setTasks(data || [])
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  // Create: Add new task
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      setError("Task title cannot be empty")
      return
    }

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

      // Insert new task
      const { error: insertError } = await supabase.from("tasks").insert([
        {
          title: newTaskTitle,
          user_id: user.id,
          completed: false,
        },
      ])

      if (insertError) {
        setError(insertError.message)
      } else {
        setNewTaskTitle("")
        // Refresh task list
        await fetchTasks()
      }
    } catch (err: any) {
      setError(err.message || "Failed to add task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Input section */}
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddTask()
              }
            }}
          />
          <Button onClick={handleAddTask} disabled={loading}>
            {loading ? "Adding..." : "Add Task"}
          </Button>
        </div>

        {/* Display section */}
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-slate-500 text-sm">No tasks yet. Create one to get started!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  disabled
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
                <span
                  className={`flex-1 ${
                    task.completed ? "line-through text-slate-400" : "text-slate-900"
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
