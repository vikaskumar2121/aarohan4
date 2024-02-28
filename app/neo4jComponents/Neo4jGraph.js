
import React, { useEffect } from 'react';
import { NeoVis } from 'neovis.js';

const Neo4jGraph = () => {
  useEffect(() => {
    const config = {
      container_id: "viz",
      server_url: "neo4j+s://a2952975.databases.neo4j.io",
      server_user: "neo4j",
      server_password: "kL8LezCMVVAP7ZdTpgCbivC3t1HdWD2t3NQ2raMfdb4",
      initial_cypher: "MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n, r, m",
      labels: {
        // Define labels and their properties for visualization if needed
      },
      relationships: {
        // Define relationship types and their properties if needed
      },
      arrows: true,
      hierarchical_layout: false,
      hierarchical_sort_method: "directed",
    };

    const viz = new NeoVis(config);
    viz.render();
  }, []);

  return <div id="viz" style={{ width: "100%", height: "100vh" }}></div>;
};

export default Neo4jGraph;
