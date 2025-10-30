import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAuthFamily,
  getUserFamilies,
  updateFamily,
  deleteFamily,
} from "../lib/api";
import FamilyCard from "../components/FamilyCard";
import NoFamiliesFound from "../components/NoFamiliesFound";
import AddCard from "@/components/AddCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { data: families = {}, isLoading: loadingFamilies } = useQuery({
    queryKey: ["families"],
    queryFn: getUserFamilies,
  });

  const [familyName, setFamilyName] = useState("");
  const [open, setOpen] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await createAuthFamily({ familyName });
      if (response?.message) toast(response.message);
      else toast.success("Family added successfully!");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
      setFamilyName("");
      setOpen(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = async (id, newName) => {
    try {
      await updateFamily({ id, familyName: newName });
      toast.success("Family updated!");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update family");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFamily({ id });
      toast.success("Family deleted!");
      await queryClient.invalidateQueries({ queryKey: ["families"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete family");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Families
          </h2>
        </div>

        {loadingFamilies ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : Array.isArray(families.data) && families.data.length === 0 ? (
          <div>
            <NoFamiliesFound />
            {/* Add new family dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <form>
                <DialogTrigger>
                  <AddCard />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Family Name</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="familyName">Name</Label>
                      <Input
                        id="familyName"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAdd} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.isArray(families.data) &&
              families.data.map((family, index) => (
                <Link
                  key={family.family_id ?? index}
                  to={`/family/${family.family_id}`}
                >
                  <FamilyCard
                    key={family.family_id ?? index}
                    family={family} // pass full object (has id and family_name)
                    onEdit={(newName) => handleEdit(family.family_id, newName)}
                    onDelete={() => handleDelete(family.family_id)}
                  />
                </Link>
              ))}

            {/* Add new family dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <form>
                <DialogTrigger>
                  <AddCard />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Family Name</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="familyName">Name</Label>
                      <Input
                        id="familyName"
                        value={familyName}
                        onChange={(e) => setFamilyName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAdd} type="submit">
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
