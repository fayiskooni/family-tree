import { CirclePlus } from "lucide-react";
import React from "react";

const AddCard = () => {
  return (
    <div className="group flex items-center justify-center rounded-[1.7rem] border-2 border-dashed border-[#b6a77f]/45 bg-[#faf4e8]/70 p-6 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/55 hover:bg-[#f7f0df]">
      <div className="flex items-center justify-center gap-2">
        <h3 className="font-semibold truncate text-[#2d4f40]">
          <CirclePlus className="size-6 transition-transform group-hover:scale-110" />
        </h3>
      </div>
    </div>
  );
};

export default AddCard;
