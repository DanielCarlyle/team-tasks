"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Task {
  id: string
  content: string
}

interface TaskCardProps {
  task: Task
  onDelete?: (taskId: string) => void
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(task.id)
    }
    console.log("Delete clicked for task:", task.id)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-3 mb-2 cursor-grab active:cursor-grabbing bg-white dark:bg-gray-700"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1" {...attributes} {...listeners}>
          {task.content}
        </div>
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-2 shrink-0"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
} 