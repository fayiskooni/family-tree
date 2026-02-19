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
import { motion } from "framer-motion";

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
      whileHover={{ y: -4 }}
      className="group relative h-52 cursor-pointer overflow-hidden rounded-[1.8rem] border border-[#b6a77f]/40 bg-[#fffcf5]/85 shadow-[0_22px_50px_-30px_rgba(20,58,45,0.55)] transition-all duration-500"
    >
      <div className="absolute inset-0 bg-[linear-gradient(150deg,rgba(31,69,55,0.07),transparent_42%,rgba(190,163,104,0.13))]" />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#c3a766]/22 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div className="rounded-2xl border border-[#b6a77f]/45 bg-[#f3ebda]/90 p-3 text-primary">
            <FolderHeart className="size-6" />
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Dialog open={open} onOpenChange={setOpen}>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-xl text-[#3a5a4b]/70 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#ece1cb]"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen(true);
                }}
              >
                <Pencil className="size-4" />
              </Button>

              <DialogContent
                className="sm:max-w-[425px]"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogHeader>
                  <DialogTitle>Edit Family Name</DialogTitle>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="editName">Family Name</Label>
                    <Input
                      id="editName"
                      value={editName}
                      className="h-11"
                      onChange={(e) => {
                        e.stopPropagation();
                        setEditName(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-2 flex-col gap-3 sm:flex-row">
                  <Button
                    variant="ghost"
                    className="flex-1 text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <Trash2 className="mr-2 size-4" /> Delete
                  </Button>
                  <div className="flex flex-1 gap-2">
                    <DialogClose asChild>
                      <Button variant="outline" className="flex-1">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave();
                      }}
                      className="flex-1"
                    >
                      Update
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div>
          <h3 className="line-clamp-1 text-3xl font-bold tracking-wide text-[#224938] transition-colors group-hover:text-primary">
            {family.family_name}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4a6156]/80">
            <span>Open Legacy</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyCard;
