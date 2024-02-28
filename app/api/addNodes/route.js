// app/api/addNodes.js
import { driver } from '../../neo4jDriver'; // Assuming you have this file for Neo4j connection

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { node1, node2, relationship } = req.body;
  const session = driver.session();

  try {
    const result = await session.run(
      'CREATE (n1:Node {name: $node1})-[r:RELATIONSHIP {name: $relationship}]->(n2:Node {name: $node2}) RETURN n1, n2, r',
      { node1, node2, relationship }
    );
    await session.close();
    res.status(200).json({ message: 'Nodes and relationship created successfully', result });
  } catch (error) {
    console.error('Error creating nodes and relationship:', error);
    await session.close();
    res.status(500).json({ message: 'Failed to create nodes and relationship' });
  }
}
