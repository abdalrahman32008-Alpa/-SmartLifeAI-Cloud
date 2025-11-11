import TaskList from "@/components/dashboard/TaskList"
import MoodLogger from "@/components/dashboard/MoodLogger"
import Insights from "@/components/dashboard/Insights"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navigation Bar - Left Sidebar */}
      <nav className="w-64 bg-white border-r border-gray-200 p-6 shadow-sm">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">SmartLifeAI</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-sm text-slate-700 hover:text-slate-900 block py-2 px-3 rounded hover:bg-gray-100">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-slate-700 hover:text-slate-900 block py-2 px-3 rounded hover:bg-gray-100">
                Analytics
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-slate-700 hover:text-slate-900 block py-2 px-3 rounded hover:bg-gray-100">
                Settings
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-slate-700 hover:text-slate-900 block py-2 px-3 rounded hover:bg-gray-100">
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to your SmartLifeAI Dashboard
          </h1>
          <p className="text-slate-600 mt-2">
            Manage your smart life insights and analytics from here.
          </p>
          
          {/* MoodLogger Component */}
          <div className="mt-8">
            <MoodLogger />
          </div>

          {/* TaskList Component */}
          <div className="mt-8">
            <TaskList />
          </div>

          {/* Insights Component */}
          <div className="mt-8">
            <Insights />
          </div>
        </div>
      </main>
    </div>
  )
}
