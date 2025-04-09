"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/app/components/ThemeToggle"

interface Task {
  id: string
  content: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface Columns {
  [key: string]: Column
}

export default function Home() {
  const [columns, setColumns] = useState<Columns>({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [{id: "task-1", content: "Sample task"}]
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: []
    },
    done: {
      id: "done",
      title: "Done",
      tasks: []
    }
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <ThemeToggle />
      </div>
      <div className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(columns).map(column => (
            <div key={column.id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <h2 className="font-semibold mb-4">{column.title}</h2>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <div key={task.id} className="bg-white dark:bg-gray-700 p-3 rounded shadow">
                    {task.content}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
