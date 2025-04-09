"use client"

import { useState, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, UserCircle, Edit2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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

interface TaskCardProps {
  task: Task
  onDelete?: (taskId: string) => void
  onAssigneeChange?: (taskId: string, assigneeName: string) => void
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void
}

const team = [
  { name: "John Doe", image: "/avatars/john.png" },
  { name: "Jane Smith", image: "/avatars/jane.png" },
  { name: "Alex Johnson", image: "/avatars/alex.png" },
  { name: "Sam Wilson", image: "/avatars/sam.png" },
]

function EditButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-6 w-6 -mt-1 -mr-1 pointer-events-auto z-10"
      onClick={onClick}
    >
      <Edit2 className="h-3 w-3" />
    </Button>
  );
}

export function TaskCard({ task, onDelete, onAssigneeChange, onTaskUpdate }: TaskCardProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [currentAssignee, setCurrentAssignee] = useState(task.assignee)
  const [editedTitle, setEditedTitle] = useState(task.title || task.content)
  const [editedDescription, setEditedDescription] = useState(task.description || task.content)
  
  // Update local state when task prop changes
  useEffect(() => {
    setCurrentAssignee(task.assignee)
    setEditedTitle(task.title || task.content)
    setEditedDescription(task.description || task.content)
  }, [task])
  
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
  }
  
  const handleAssigneeChange = (value: string) => {
    // Find the selected team member
    const selectedMember = team.find(member => member.name === value)
    
    // Update local state
    setCurrentAssignee(selectedMember)
    
    // Call the parent component's handler
    if (onAssigneeChange) {
      onAssigneeChange(task.id, value)
    }
    setAssignDialogOpen(false)
  }
  
  const handleSaveTaskEdits = () => {
    if (onTaskUpdate) {
      onTaskUpdate(task.id, {
        title: editedTitle,
        description: editedDescription
      })
    }
    setEditDialogOpen(false)
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-2 cursor-grab active:cursor-grabbing bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow relative"
    >
      <div 
        className="absolute top-2 right-2 z-10" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 bg-white dark:bg-gray-700 shadow-sm pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Edit button clicked");
            setEditDialogOpen(true);
          }}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      </div>
      
      <CardHeader className="p-3 pb-1" {...attributes} {...listeners}>
        <CardTitle className="text-sm font-medium pr-5">{task.title || task.content}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-3 pt-1 pb-1">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description || task.content}
        </p>
      </CardContent>
      
      <CardFooter className="p-3 pt-1 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {currentAssignee ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={currentAssignee.image} alt={currentAssignee.name} />
                <AvatarFallback>{currentAssignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{currentAssignee.name}</span>
            </div>
          ) : (
            <span className="text-xs italic text-muted-foreground flex items-center gap-1">
              <UserCircle className="h-3 w-3" />
              Unassigned
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                Assign
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Assign Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select
                    onValueChange={handleAssigneeChange}
                    defaultValue={task.assignee?.name}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select an assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {team.map((member) => (
                        <SelectItem key={member.name} value={member.name}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.image} alt={member.name} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {onDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardFooter>
      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent 
          className="sm:max-w-[425px]" 
          onPointerDownOutside={(e) => {
            // Prevent closing when clicking outside
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter task title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTaskEdits}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 