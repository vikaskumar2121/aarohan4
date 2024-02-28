"use client";
import React from 'react'
import FirestoreDisplay from '../components/FirestoreDisplay'
//import Neo4jGraph from '../neo4jComponents/Neo4jGraph'
//import AddNodesClient from '../neo4jComponents/AddNodesClient'


const viewQuestions = () => {
  return (
    <div>
      <h1>Questins list </h1>
      <FirestoreDisplay collectionName="yourCollectionName" />
      
      
    </div>
  )
}

export default viewQuestions
