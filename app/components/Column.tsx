"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskCard } from "./TaskCard"
import { Card } from "@/components/ui/card"
import { AddTask } from "./AddTask"

interface Task {
  id: string
  content: string
  title: string
  description: string
  assignee?: {
    name: string
    image?: string
  }
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface ColumnProps {
  column: Column
  tasks: Task[]
  onDeleteTask?: (taskId: string) => void
  onAddTask?: (columnId: string, task: Task) => void
  onAssigneeChange?: (taskId: string, assigneeName: string) => void
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
}

export function Column({ 
  column, 
  tasks, 
  onDeleteTask, 
  onAddTask, 
  onAssigneeChange, 
  onTaskUpdate 
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column
    }
  })

  return (
    <Card className="p-4 bg-gray-100 dark:bg-gray-800">
      <h2 className="font-semibold mb-4">{column.title}</h2>
      <div ref={setNodeRef} className="space-y-2">
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={onDeleteTask}
              onAssigneeChange={onAssigneeChange}
              onTaskUpdate={onTaskUpdate}
            />
          ))}
        </SortableContext>
      </div>
      <div className="mt-4">
        <AddTask onAddTask={(taskData) => {
          if (onAddTask) {
            const newTask = {
              id: crypto.randomUUID(),
              content: taskData.title,
              title: taskData.title,
              description: taskData.description,
              assignee: taskData.assignee
            }
            onAddTask(column.id, newTask)
          }
        }} />
      </div>
    </Card>
  )
} 