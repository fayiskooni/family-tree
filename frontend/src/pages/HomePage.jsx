import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { createAuthFamily, getUserFamilies } from "../lib/api";

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

const HomePage = () => {
  const queryClient = useQueryClient();

  const { data: families = [], isLoading: loadingFamilies } = useQuery({
    queryKey: ["families"],
    queryFn: getUserFamilies,
  });

  const [familyName, setFamilyName] = useState("");
  const [open, setOpen] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await createAuthFamily({ familyName });
      if (response?.message) {
        toast(response.message);
        console.log(response?.message);
      } else {
        toast.success("Family added successfully!");
      }
      await queryClient.invalidateQueries({ queryKey: ["families"] });
      setFamilyName("");
      setOpen(false);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message|| "Something went wrong!";
      toast.error(errorMessage);
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
        ) : families.length === 0 ? (
          <NoFamiliesFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {families.data.map((family, index) => (
              <FamilyCard key={index} family={family.family_name} />
            ))}
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
                        name="familyName"
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
                    <Button onClick={handleClick} type="submit">
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
