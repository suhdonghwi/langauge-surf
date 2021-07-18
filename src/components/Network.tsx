/** @jsxImportSource theme-ui */
import { useEffect, useRef } from "react";

import Graph from "graphology";
import { random } from "graphology-layout";
import Sigma from "sigma";
import { useThemeUI } from "theme-ui";
import forceAtlas2 from "graphology-layout-forceatlas2";

interface NetworkProps {
  graph: Graph;
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

    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeColor: "rgba(100, 100, 100, 0.5)",
      defaultNodeColor: "#495057",
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
