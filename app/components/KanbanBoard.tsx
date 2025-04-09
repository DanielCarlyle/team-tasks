"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Task = {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority?: "low" | "medium" | "high"
}

type KanbanBoardProps = {
  tasks: Task[]
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
  const todoTasks = tasks.filter(task => task.status === "todo")
  const inProgressTasks = tasks.filter(task => task.status === "in-progress")
  const doneTasks = tasks.filter(task => task.status === "done")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 h-full">
      {/* Todo Column */}
      <div className="bg-slate-50 rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4 text-slate-900">Todo</h3>
        <div className="space-y-3">
          {todoTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="bg-slate-50 rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4 text-slate-900">In Progress</h3>
        <div className="space-y-3">
          {inProgressTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Done Column */}
      <div className="bg-slate-50 rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4 text-slate-900">Done</h3>
        <div className="space-y-3">
          {doneTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
          {task.priority && (
            <Badge 
              variant={
                task.priority === "high" 
                  ? "destructive" 
                  : task.priority === "medium" 
                    ? "default" 
                    : "secondary"
              }
              className="text-xs"
            >
              {task.priority}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 text-xs text-muted-foreground">
        {task.description}
      </CardContent>
    </Card>
  )
} 