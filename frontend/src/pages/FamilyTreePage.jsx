import React, { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ELK from "elkjs";
import {
  ReactFlow,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getAllChildren, getAllCouples, getFamilyMembers } from "@/lib/api";
import { useParams, Link } from "react-router";
import { ArrowLeft, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

function buildFamilyGraph(members, couples, children) {
  const nodes = members.data.map((m) => ({
    id: String(m.member_id),
    data: { label: m.name },
    position: { x: 0, y: 0 },
  }));

  const coupleEdges = couples.data.map((c) => ({
    id: `couple-${c.couple_id}`,
    source: String(c.husband_id),
    target: String(c.wife_id),
    type: "smoothstep",
    style: { stroke: "blue" },
  }));

  const parentEdges = [];
  children.data.forEach((child) => {
    const couple = couples.data.find((c) => c.couple_id === child.couple_id);
    if (couple) {
      parentEdges.push({
        id: `edge-h-${couple.husband_id}-${child.child_id}`,
        source: String(couple.husband_id),
        target: String(child.child_id),
      });
      parentEdges.push({
        id: `edge-w-${couple.wife_id}-${child.child_id}`,
        source: String(couple.wife_id),
        target: String(child.child_id),
      });
    }
  });

  return { nodes, edges: [...coupleEdges, ...parentEdges] };
}

async function getLayoutedElements(nodes, edges, options = {}) {
  const graph = {
    id: "root",
    layoutOptions: options,
    children: nodes.map((n) => ({
      id: n.id,
      width: 150,
      height: 50,
      labels: [{ text: n.data.label }],
    })),
    edges: edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  const layoutedGraph = await elk.layout(graph);

  const layoutedNodes = layoutedGraph.children.map((n) => ({
    id: n.id,
    data: { label: n.labels[0].text },
    position: { x: n.x, y: n.y },
  }));

  const layoutedEdges = layoutedGraph.edges.map((e) => ({
    id: e.id,
    source: e.sources[0],
    target: e.targets[0],
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
}

export default function FamilyTreePage() {
  const { id } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const { data: members = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["members", id],
    queryFn: () => getFamilyMembers(id),
  });

  const { data: couples = [], isLoading: loadingCouples } = useQuery({
    queryKey: ["couples", id],
    queryFn: () => getAllCouples(id),
  });

  const { data: children = [], isLoading: loadingChildren } = useQuery({
    queryKey: ["children", id],
    queryFn: () => getAllChildren(id),
  });

  const onLayout = useCallback(
    (direction) => {
      getLayoutedElements(nodes, edges, {
        ...elkOptions,
        "elk.direction": direction,
      }).then(({ nodes: ln, edges: le }) => {
        setNodes(ln);
        setEdges(le);
        fitView();
      });
    },
    [nodes, edges, fitView]
  );

  useEffect(() => {
    if (!members?.data || !couples?.data || !children?.data) return;

    const { nodes: ns, edges: es } = buildFamilyGraph(members, couples, children);

    getLayoutedElements(ns, es, elkOptions).then(({ nodes: ln, edges: le }) => {
      setNodes(ln);
      setEdges(le);
      setTimeout(() => fitView(), 100);
    });
  }, [members?.data, couples?.data, children?.data, fitView]);

  if (loadingMembers || loadingCouples || loadingChildren) {
    return (
      <div className="flex h-full min-h-[65vh] items-center justify-center">
        <div className="heritage-panel flex items-center gap-3 px-5 py-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
          <span className="text-sm font-semibold text-[#2a4f3f]">Loading family tree...</span>
        </div>
      </div>
    );
  }

  const handleLayoutChange = (direction) => {
    onLayout(direction);
  };

  return (
    <div className="h-full w-full overflow-hidden rounded-[1.4rem] border border-[#b6a77f]/35 shadow-[0_26px_56px_-36px_rgba(20,58,45,0.65)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Panel
          position="top-left"
          className="m-4 flex items-center gap-2 rounded-2xl border border-[#b6a77f]/40 bg-[#fff9ef]/92 p-2 shadow-[0_16px_34px_-24px_rgba(20,58,45,0.6)] backdrop-blur"
        >
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl text-[10px] uppercase tracking-[0.14em]">
              <ArrowLeft className="size-3.5" />
              Home
            </Button>
          </Link>
          <div className="mx-1 h-5 w-px bg-[#b6a77f]/40" />
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-xl text-[10px] uppercase tracking-[0.14em]"
            onClick={() => handleLayoutChange("DOWN")}
          >
            <LayoutList className="size-3.5" />
            Vertical
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 rounded-xl text-[10px] uppercase tracking-[0.14em]"
            onClick={() => handleLayoutChange("RIGHT")}
          >
            <LayoutGrid className="size-3.5" />
            Horizontal
          </Button>
        </Panel>
        <Background color="rgba(45,82,67,0.18)" gap={24} size={1.2} />
      </ReactFlow>
    </div>
  );
}
