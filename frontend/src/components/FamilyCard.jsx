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
import { Pencil, Trash2, FolderHeart, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="group relative h-48 rounded-[2.5rem] bg-base-100 border border-base-content/5 overflow-hidden shadow-xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer"
    >
      {/* Decorative background element */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />

      <div className="h-full p-8 flex flex-col justify-between relative z-10">
        <div className="flex items-start justify-between">
          <div className="p-3.5 rounded-2xl bg-primary/5 text-primary">
            <FolderHeart className="size-6" />
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl hover:bg-base-content/5 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                <Pencil className="size-4 text-base-content/40" />
              </Button>

              <DialogContent className="sm:max-w-[425px] rounded-3xl" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Edit Legacy Name</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="editName" className="text-xs font-bold uppercase tracking-widest opacity-40">Family Name</Label>
                    <Input
                      id="editName"
                      value={editName}
                      className="rounded-xl border-base-content/10 focus:ring-primary h-12"
                      onChange={(e) => {
                        e.stopPropagation();
                        setEditName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-3 mt-4">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-xl text-error hover:bg-error/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <Trash2 className="size-4 mr-2" /> Delete Record
                  </Button>
                  <div className="flex gap-2 flex-1">
                    <DialogClose asChild>
                      <Button variant="outline" className="flex-1 rounded-xl">Cancel</Button>
                    </DialogClose>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }} className="flex-1 rounded-xl shadow-lg shadow-primary/20">
                      Update
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {family.family_name}
          </h3>
          <div className="flex items-center gap-2 text-base-content/40 font-bold text-xs uppercase tracking-widest">
            <span>Open Legacy</span>
            <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyCard;
