import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { HousePlus, Pencil, Trash2 } from "lucide-react";

const FamilyCard = ({ family, onEdit, onDelete }) => {
  // family is now the full object: { id, family_name, ... }
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState(family?.family_name ?? "");

  useEffect(() => {
    setEditName(family?.family_name ?? "");
  }, [family]);

  const handleSave = async () => {
    if (editName.trim() === "") {
      toast.error("Family name cannot be empty");
      return;
    }
    // call parent with the new name only; parent uses the family's id it already has
    await onEdit(editName);
    setOpen(false);
  };

  const handleDelete = async () => {
    // call parent without id; parent will delete using bound id
    await onDelete();
    setOpen(false);
  };

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center relative group">
      {/* Card content */}
      <div className="card-body p-4 flex items-center justify-center">
        <h3 className="font-semibold truncate">{family.family_name}</h3>
      </div>

      {/* Hover Edit Icon */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" variant="ghost">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Family</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="editName">Name</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FamilyCard;
