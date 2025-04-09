"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AddTaskProps {
  onAddTask: (task: {
    title: string
    description: string
    assignee?: {
      name: string
      image?: string
    }
  }) => void
}

const team = [
  { name: "John Doe", image: "/avatars/john.png" },
  { name: "Jane Smith", image: "/avatars/jane.png" },
  { name: "Alex Johnson", image: "/avatars/alex.png" },
  { name: "Sam Wilson", image: "/avatars/sam.png" },
]

export function AddTask({ onAddTask }: AddTaskProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState<string | undefined>(undefined)

  const handleSubmit = () => {
    if (!title.trim()) return
    
    const selectedMember = assignee 
      ? team.find(member => member.name === assignee) 
      : undefined
    
    onAddTask({
      title,
      description,
      assignee: selectedMember,
    })
    
    // Reset form
    setTitle("")
    setDescription("")
    setAssignee(undefined)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex gap-1 items-center justify-center">
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="assignee">Assignee (Optional)</Label>
            <Select
              value={assignee}
              onValueChange={setAssignee}
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
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 