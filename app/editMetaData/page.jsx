"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import AddChapterComponent from "../components/AddChapter";
import AddConceptComponent from "../components/AddConcept";
import DeleteChapterComponent from "../components/DeleteChapter";
import DeleteConceptComponent from "../components/DeleteConcept";
const EditMetaData = () => {
    const { user } = UserAuth();
    const [loading, setLoading] = useState(true);
  
    
  
    useEffect(() => {
      const checkAuthentication = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        setLoading(false);
      };
      checkAuthentication();
    }, [user]);
  
    return (
      <div className="p-4">
        {loading ? (
          <Spinner />
        ) : user ? (
          <>
          <p>
            Welcome, {user.displayName} - you are logged in to the edit Meta data  EditMetaData -
            a protected route.
          </p>
          <AddChapterComponent/> <br />
          <AddConceptComponent/>  <br />
          <DeleteChapterComponent />   <br />
          <DeleteConceptComponent />

          </>
        ) : (
          <p>You must be logged in to view this EditMetaData - protected route.</p>
        )}
      </div>
    );
  };
  
  export default EditMetaData;