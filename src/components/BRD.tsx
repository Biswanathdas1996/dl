import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  select,
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  drag,
} from "d3";

interface Node extends d3.SimulationNodeDatum {
  id: string;
}

interface Link {
  source: string;
  target: string;
}

interface Data {
  nodes: Node[];
  links: Link[];
}

interface Input {
  [key: string]: {
    relationships: {
      target_table: string;
      source_column: string;
      target_column: string;
    }[];
  };
}

const ERD = ({ input }: { input: Input }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const graphData: Data = {
    nodes: Object.keys(input).map((table) => ({ id: table })),
    links: Object.keys(input).flatMap((table) =>
      input[table].relationships.map((rel) => ({
        source: table,
        target: rel.target_table,
      }))
    ),
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = 600;
    const height = 600;

    // Create a simulation for positioning
    const simulation = forceSimulation(graphData.nodes)
      .force(
        "link",
        forceLink(graphData.links).id((d: any) => (d as Node).id)
      )
      .force("charge", forceManyBody().strength(-200))
      .force("center", forceCenter(width / 2, height / 2));

    // Define arrow markers for links
    svg
      .append("defs")
      .selectAll("marker")
      .data(["end"])
      .enter()
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#ccc");

    const link = svg
      .selectAll(".link")
      .data(graphData.links)
      .enter()
      .append("line")
      .attr("stroke", "#ccc")
      .attr("marker-end", "url(#arrow)");

    const node = svg
      .selectAll(".node")
      .data(graphData.nodes)
      .enter()
      .append("circle")
      .attr("r", 10)
      .attr("fill", "blue")
      .call(
        drag<SVGCircleElement, Node>()
          .subject((d) => d)
          .on("start", (event, d: Node) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d: Node) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d: Node) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    const labels = svg
      .selectAll(".label")
      .data(graphData.nodes)
      .enter()
      .append("text")
      .attr("dy", -15)
      .attr("text-anchor", "middle")
      .text((d) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as unknown as Node).x ?? 0)
        .attr("y1", (d) => (d.source as unknown as Node).y ?? 0)
        .attr("x2", (d) => (d.target as unknown as Node).x ?? 0)
        .attr("y2", (d) => (d.target as unknown as Node).y ?? 0);

      link.append("title").text((d) => {
        const sourceTable = d.source as unknown as Node;
        const targetTable = d.target as unknown as Node;
        const relationship = input[sourceTable.id].relationships.find(
          (rel) => rel.target_table === targetTable.id
        );
        return relationship
          ? `FK: ${relationship.source_column} -> ${relationship.target_column}`
          : "";
      });

      node.attr("cx", (d) => d.x ?? 0).attr("cy", (d) => d.y ?? 0);

      labels.attr("x", (d) => d.x ?? 0).attr("y", (d) => d.y ?? 0);
    });
  }, [graphData]);
  return <svg ref={svgRef} width="100vw" height="700" />;
};

export default ERD;
