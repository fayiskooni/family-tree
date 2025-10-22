import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

const FamilyCard = ({ family, onEdit, onDelete }) => {
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
    await onEdit(editName);
    setOpen(false);
  };

  const handleDelete = async () => {
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
          {/* Replace DialogTrigger with a normal button that stops propagation */}
          <Button
            size="icon"
            variant="ghost"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(true);
            }}
            aria-label="Edit family"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
            <div onClick={(e) => e.stopPropagation()}>
              <DialogHeader>
                <DialogTitle>Edit Family Name</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={(e) => {
                      e.stopPropagation();
                      setEditName(e.target.value);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-between gap-2">
                <div className="flex gap-2 justify-start">
                  <Button 
                    variant="destructive" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
                <div className="flex gap-2 justify-end">
                  <DialogClose asChild>
                    <Button variant="outline" onClick={(e) => e.stopPropagation()}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                  }}>
                    Save
                  </Button>
                </div>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default FamilyCard;
