"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/app/components/ThemeToggle"
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TaskCard } from "@/app/components/TaskCard"
import { Column } from "@/app/components/Column"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

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
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [newTaskContent, setNewTaskContent] = useState("")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string
    const task = Object.values(columns).flatMap(col => col.tasks).find(t => t.id === taskId)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    const isActiveATask = active.data.current?.type === "Task"
    const isOverATask = over.data.current?.type === "Task"

    if (!isActiveATask) return

    // Dropping a task over another task
    if (isOverATask) {
      const activeColumn = Object.values(columns).find(col => 
        col.tasks.some(t => t.id === activeId)
      )
      const overColumn = Object.values(columns).find(col => 
        col.tasks.some(t => t.id === overId)
      )

      if (activeColumn && overColumn && activeColumn.id === overColumn.id) {
        const activeIndex = activeColumn.tasks.findIndex(t => t.id === activeId)
        const overIndex = overColumn.tasks.findIndex(t => t.id === overId)

        setColumns(prev => ({
          ...prev,
          [activeColumn.id]: {
            ...activeColumn,
            tasks: arrayMove(activeColumn.tasks, activeIndex, overIndex)
          }
        }))
      }
    }

    // Dropping a task over a column
    const isOverAColumn = over.data.current?.type === "Column"
    if (isOverAColumn && over.data.current?.column) {
      const activeColumn = Object.values(columns).find(col => 
        col.tasks.some(t => t.id === activeId)
      )
      const overColumn = over.data.current.column

      if (activeColumn && overColumn && activeColumn.id !== overColumn.id) {
        const activeIndex = activeColumn.tasks.findIndex(t => t.id === activeId)
        const task = activeColumn.tasks[activeIndex]

        setColumns(prev => ({
          ...prev,
          [activeColumn.id]: {
            ...activeColumn,
            tasks: activeColumn.tasks.filter(t => t.id !== activeId)
          },
          [overColumn.id]: {
            ...overColumn,
            tasks: [...overColumn.tasks, task]
          }
        }))
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
  }

  const addTask = () => {
    if (!newTaskContent.trim()) return

    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: newTaskContent
    }

    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        tasks: [newTask, ...prev.todo.tasks]
      }
    }))

    setNewTaskContent("")
  }

  const deleteTask = (taskId: string) => {
    setColumns(prev => {
      const newColumns = { ...prev }
      // Find which column contains the task
      const columnWithTask = Object.values(newColumns).find(col => 
        col.tasks.some(task => task.id === taskId)
      )
      
      if (columnWithTask) {
        newColumns[columnWithTask.id] = {
          ...columnWithTask,
          tasks: columnWithTask.tasks.filter(task => task.id !== taskId)
        }
      }
      
      return newColumns
    })
  }

  return (
    <div className="p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <ThemeToggle />
      </div>
      
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Add a new task..."
          value={newTaskContent}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTaskContent(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && addTask()}
        />
        <Button onClick={addTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="h-full">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SortableContext
              items={Object.values(columns).map(col => col.id)}
              strategy={verticalListSortingStrategy}
            >
              {Object.values(columns).map(column => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={column.tasks}
                  onDeleteTask={deleteTask}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeTask && (
              <TaskCard task={activeTask} />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
