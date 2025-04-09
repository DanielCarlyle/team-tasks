import { KanbanBoard } from "@/app/components/KanbanBoard"

const demoTasks = [
  {
    id: "1",
    title: "Research competitors",
    description: "Look into what similar products are doing",
    status: "todo",
    priority: "low",
  },
  {
    id: "2",
    title: "Design landing page",
    description: "Create wireframes for homepage",
    status: "todo",
    priority: "medium",
  },
  {
    id: "3",
    title: "Set up analytics",
    description: "Implement tracking for key user actions",
    status: "in-progress",
    priority: "high",
  },
  {
    id: "4",
    title: "Optimize loading speed",
    description: "Improve initial page load performance",
    status: "in-progress",
    priority: "medium",
  },
  {
    id: "5",
    title: "Fix signup form bug",
    description: "Users unable to submit the form on Safari",
    status: "done",
    priority: "high",
  },
]

export default function KanbanPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Team Tasks</h1>
      <KanbanBoard tasks={demoTasks} />
    </div>
  )
} 