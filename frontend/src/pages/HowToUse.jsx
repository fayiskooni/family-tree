import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  Link as LinkIcon,
  TreePine,
  Pencil,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const STEP_STYLES = {
  green: {
    orb: "bg-[#3b775f]/18",
    iconWrap: "bg-[#3b775f]/15 border-[#3b775f]/35",
    icon: "text-[#2f6652]",
    tag: "text-[#2f6652]",
  },
  gold: {
    orb: "bg-[#b69557]/18",
    iconWrap: "bg-[#b69557]/18 border-[#b69557]/35",
    icon: "text-[#8a6b34]",
    tag: "text-[#7d6334]",
  },
  rust: {
    orb: "bg-[#ad7458]/18",
    iconWrap: "bg-[#ad7458]/18 border-[#ad7458]/35",
    icon: "text-[#875540]",
    tag: "text-[#7f5241]",
  },
};

const StepCard = ({ number, title, icon: Icon, children, tone }) => {
  const style = STEP_STYLES[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: number * 0.08 }}
      className="group relative overflow-hidden rounded-[1.7rem] border border-[#b6a77f]/35 bg-[#fffaf0]/82 p-6 shadow-[0_18px_44px_-30px_rgba(20,58,45,0.45)] transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className={`absolute -right-6 -top-8 h-24 w-24 rounded-full blur-3xl ${style.orb}`} />
      <div className="relative z-10 flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border ${style.iconWrap}`}>
          <Icon className={`h-6 w-6 ${style.icon}`} />
        </div>

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-[0.16em] ${style.tag}`}>
              Step 0{number}
            </span>
            <ChevronRight className="h-3 w-3 text-[#54665b]" />
          </div>
          <h3 className="text-3xl font-bold text-[#264d3d]">{title}</h3>
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#4c6156]">{children}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default function HowToUse() {
  return (
    <div className="min-h-screen space-y-8 pb-14">
      <section className="heritage-shell px-6 pb-10 pt-12 sm:px-8 lg:px-10 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#b69557]/18 blur-3xl"
        />
        <div className="relative z-10 max-w-4xl">
          <div className="heritage-kicker mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Guide
          </div>

          <h1 className="text-5xl font-bold leading-[0.95] text-[#1f4537] sm:text-6xl lg:text-7xl">
            Build your family tree
            <br />
            with confidence.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#4f6157] sm:text-lg">
            Follow this flow to create families, register members, connect
            relationships, and visualize a complete lineage map.
          </p>
        </div>
      </section>

      <div className="grid gap-6">
        <StepCard number={1} title="Create a Family" icon={Home} tone="green">
          <p>Start by creating a family container to hold all related profiles.</p>
          <p>
            Open <span className="font-semibold text-primary">Home</span> and click
            <span className="font-semibold text-primary"> Create Family</span>.
          </p>
        </StepCard>

        <StepCard number={2} title="Add Members" icon={Users} tone="gold">
          <p>Register individuals with their details in the shared member registry.</p>
          <p>
            Go to <span className="font-semibold text-primary">Members</span> and add
            each person once.
          </p>
        </StepCard>

        <StepCard number={3} title="Link to Family" icon={Pencil} tone="rust">
          <p>Associate existing members with a selected family archive.</p>
          <p>
            Open a family and use <span className="font-semibold text-primary">Add Existing Member</span>.
          </p>
        </StepCard>

        <StepCard number={4} title="Define Relations" icon={LinkIcon} tone="green">
          <p>Set spouse and child links inside each member profile.</p>
          <p>
            These links update the tree structure used in visualization.
          </p>
        </StepCard>

        <StepCard number={5} title="Visualize Tree" icon={TreePine} tone="gold">
          <p>Open the family tree view to see branches arranged automatically.</p>
          <p>
            Switch between vertical and horizontal layouts at any time.
          </p>
        </StepCard>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-[1.7rem] border border-[#7a9bc0]/35 bg-[#edf4fb]/70 p-7 text-center shadow-[0_16px_36px_-26px_rgba(20,58,45,0.42)]"
        >
          <Info className="mx-auto mb-3 h-8 w-8 text-[#3d6e98]" />
          <h4 className="text-2xl font-bold text-[#2f4f66]">Performance Note</h4>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-[#425f74]">
            If the database has been inactive, the first request can take longer than
            usual due to cold start behavior.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-4 text-center"
        >
          <h2 className="text-4xl font-bold text-[#254a3a]">Ready to map your lineage?</h2>
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4 rounded-xl bg-primary px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-[0_18px_40px_-24px_hsl(var(--primary)/0.8)]"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Start Building
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
