import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Home,
  Users,
  UserPlus,
  Link as LinkIcon,
  TreePine,
  Pencil,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const StepCard = ({ number, title, icon: Icon, children, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: number * 0.1 }}
    className="relative group lg:p-8 p-6 rounded-3xl bg-base-100/40 backdrop-blur-xl border border-base-content/10 hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-primary/5 cursor-default overflow-hidden"
  >
    <div className={`absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-${color}-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`} />
    <div className="flex items-start gap-6">
      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-${color}-500/20 to-${color}-600/40 flex items-center justify-center shadow-inner border border-${color}-500/20`}>
        <Icon className={`w-7 h-7 text-${color}-500`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className={`text-xs font-bold uppercase tracking-widest text-${color}-500/70`}>Step 0{number}</span>
          <ChevronRight className="w-3 h-3 text-base-content/20" />
        </div>
        <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <div className="text-base-content/70 leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

export default function HowToUse() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-12 lg:pt-24 lg:pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/10 blur-[120px] rounded-full -z-10"
        />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive Guide</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl lg:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-base-content to-base-content/50"
          >
            Experience your family <br /> legacy in high-fidelity.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-base-content/60 max-w-2xl mx-auto leading-relaxed"
          >
            A comprehensive guide to building, connecting, and visualizing your ancestral journey with our premium family mapping tools.
          </motion.p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 grid gap-8">
        <StepCard number={1} title="Create a Family" icon={Home} color="blue">
          <p>
            Start by creating a family container. Think of this as your digital family vault.
          </p>
          <p className="text-sm italic">
            Go to the <span className="font-semibold text-primary">Home</span> page and click "Create Family" to initialize your record.
          </p>
        </StepCard>

        <StepCard number={2} title="Add Family Members" icon={Users} color="pink">
          <p>
            Populate your database with individuals. Add names, genders, and biographical details.
          </p>
          <p className="text-sm italic">
            Head to the <span className="font-semibold text-primary">Members</span> tab and click "Add Member" for each person.
          </p>
        </StepCard>

        <StepCard number={3} title="Map to Families" icon={Pencil} color="yellow">
          <p>
            Assign members to their respective families. This builds the membership list for each group.
          </p>
          <p className="text-sm italic">
            On the <span className="font-semibold text-primary">Family</span> page, use the pencil icon to associate members.
          </p>
        </StepCard>

        <StepCard number={4} title="Define Relationships" icon={LinkIcon} color="purple">
          <p>
            Interconnect your members. Define marriages, partnerships, and parent-child links.
          </p>
          <p className="text-sm italic">
            Open a family member's profile and click "Add Relation". Our system syncs both profiles instantly.
          </p>
        </StepCard>

        <StepCard number={5} title="Visualize the Journey" icon={TreePine} color="emerald">
          <p>
            The pinnacle of the experience—your interactive, auto-layout family tree.
          </p>
          <p className="text-sm italic">
            Click <span className="font-semibold text-primary">"View My Family Tree"</span> to see a beautiful, zoomable graph of your lineage.
          </p>
        </StepCard>

        {/* Note on Performance */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-8 rounded-3xl bg-blue-500/5 border border-blue-500/20 text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <Info className="w-10 h-10 text-blue-500 mx-auto mb-4 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          <h4 className="text-lg font-bold mb-2">Architectural Note</h4>
          <p className="text-base-content/60 max-w-xl mx-auto text-sm leading-relaxed">
            We utilize high-performance cloud infrastructure including Neon's serverless PostgreSQL.
            On the first request, the database may undergo a brief "cold start"—we appreciate your patience as the system scales to meet your request.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12"
        >
          <h2 className="text-3xl font-black mb-4">Your legacy starts here.</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-2xl bg-primary text-primary-content font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
            onClick={() => window.location.href = "/"}
          >
            Start Building Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
