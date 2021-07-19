/** @jsxImportSource theme-ui */
import { useEffect, useRef } from "react";

import { DirectedGraph } from "graphology";
import { random } from "graphology-layout";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import NodeAttribute from "../data/NodeAttribute";
import animate from "../utils/animate";

interface NetworkProps {
  graph: DirectedGraph<NodeAttribute>;
}

export default function Network({ graph }: NetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;

    random.assign(graph, { scale: 100, center: 0 });
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: {
        gravity: 1,
        barnesHutOptimize: true,
        adjustSizes: true,
      },
    });

    const defaultEdgeColor = "rgba(100, 100, 100, 0.5)",
      defaultNodeColor = "#495057";

    graph.forEachNode((key) =>
      graph.setNodeAttribute(key, "color", defaultNodeColor)
    );

    graph.forEachEdge((key) => {
      graph.setEdgeAttribute(key, "color", defaultEdgeColor);
      graph.setEdgeAttribute(key, "size", 1);
    });

    let highlightNode: string | null = null;
    let influencedToEdges: Set<string> = new Set(),
      influencedToNodes: Set<string> = new Set();
    let influencedByEdges: Set<string> = new Set(),
      influencedByNodes: Set<string> = new Set();

    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "arrow",
      zIndex: true,
      labelColor: "#212529",
    });

    renderer.on("enterNode", (e) => {
      document.body.style.cursor = "pointer";
      highlightNode = e.node;

      for (const edge of graph.outEdges(e.node)) {
        influencedToEdges.add(edge);
        influencedToNodes.add(graph.target(edge));
      }

      for (const edge of graph.inEdges(e.node)) {
        influencedByEdges.add(edge);
        influencedByNodes.add(graph.source(edge));
      }

      animate(
        graph,
        (key) => {
          if (highlightNode === key) {
            return { color: "#12b886" };
          } else if (influencedToNodes.has(key)) {
            return { color: "#1c7ed6" };
          } else if (influencedByNodes.has(key)) {
            return { color: "#f03e3e" };
          } else {
            return { color: defaultEdgeColor };
          }
        },
        (key) => {
          if (influencedToEdges.has(key)) {
            return {
              color: "#1c7ed6",
              size: 1.5,
              z: 99,
            };
          } else if (influencedByEdges.has(key)) {
            return {
              color: "#f03e3e",
              size: 1.5,
              z: 99,
            };
          } else {
            return {
              color: defaultEdgeColor,
              size: 1,
              z: 0,
            };
          }
        },
        { duration: 100 }
      );
    });

    renderer.on("leaveNode", (e) => {
      document.body.style.cursor = "default";
      highlightNode = null;

      influencedToEdges.clear();
      influencedToNodes.clear();

      influencedByEdges.clear();
      influencedByNodes.clear();

      animate(
        graph,
        () => ({
          color: defaultNodeColor,
        }),
        () => ({
          size: 1,
          color: defaultEdgeColor,
        }),
        { duration: 100 }
      );
    });

    return () => {
      renderer.kill();
    };
  }, [graph]);

  return (
    <div
      ref={containerRef}
      sx={{ height: "100vh", backgroundColor: "background" }}
    />
  );
}
