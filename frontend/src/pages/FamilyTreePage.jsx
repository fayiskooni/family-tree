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
import { useParams } from "react-router";

// ✅ Create a single ELK instance
const elk = new ELK();

// ✅ ELK layout options for spacing and hierarchy
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.nodeNode": "80",
};

//  STEP 1: Build graph structure (nodes + edges)
function buildFamilyGraph(members, couples, children) {
  // create one node for each member
  const nodes = members.data.map((m) => ({
    id: String(m.member_id),
    data: { label: m.name },
    position: { x: 0, y: 0 },
  }));

  // edges between husband and wife
  const coupleEdges = couples.data.map((c) => ({
    id: `couple-${c.couple_id}`,
    source: String(c.husband_id),
    target: String(c.wife_id),
    type: "smoothstep",
    style: { stroke: "blue" },
  }));

  // edges from parents to children
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

// STEP 2: Ask ELK to layout the graph neatly
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

  // convert ELK output into ReactFlow format
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

// STEP 3: Main FamilyFlow component
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
    // Check if we have all the required data
    if (!members?.data || !couples?.data || !children?.data) return;

    const { nodes: ns, edges: es } = buildFamilyGraph(members, couples, children);

    getLayoutedElements(ns, es, elkOptions).then(({ nodes: ln, edges: le }) => {
      setNodes(ln);
      setEdges(le);
      setTimeout(() => fitView(), 100); // Add slight delay to ensure rendering
    });
  }, [members?.data, couples?.data, children?.data, fitView]);

  // Add loading state
  if (loadingMembers || loadingCouples || loadingChildren) {
    return <div className="flex justify-center items-center h-screen">Loading family tree...</div>;
  }

  // STEP 5: Allow switching between vertical & horizontal layout
  const handleLayoutChange = (direction) => {
    onLayout(direction);
  };

  // STEP 6: Render graph
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Panel position="top-right">
          <button onClick={() => handleLayoutChange("DOWN")}>Vertical</button>
          <button onClick={() => handleLayoutChange("RIGHT")}>Horizontal</button>
        </Panel>
        <Background />
      </ReactFlow>
    </div>
  );
}
