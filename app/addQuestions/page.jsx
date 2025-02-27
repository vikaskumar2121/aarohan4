"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import ImageUpload from "../components/imagecomponent";

import FirestoreUpload from "../components/FirestoreUpload";
import FetchDropdownData from "../components/FetchDropdownData";

const page = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  const [imageUrls, setImageUrls] = useState([]);
  const [jsonData, setJsonData] = useState({});
  const [uploadableFirestoreData, setuploadableFirestoreData] = useState({});
  const handleImageURLUpdate = (urls) => {
    console.log("Received URLs:", urls);
    setImageUrls(urls); // Update state with the array of URLs
};
const handleJsonUpdate = (data) => {
  setJsonData(data);
  
  // Now jsonData can be passed to the `fireUpload` component

  // Combine username, email, and jsonData into uploadableFirestoreData
  const updatedFirestoreData = {
    username: user.displayName,
    email: user.email,
    ...uploadableFirestoreData,
    ...data
  };
  setuploadableFirestoreData(updatedFirestoreData);
};

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
          <p>Welcome, {user.displayName} - you are logged in to the addQuestions - a protected route.</p>
          <ImageUpload onUpdateState={handleImageURLUpdate} /><br />
          <pre>{JSON.stringify(imageUrls, null, 2)}</pre><br />
          <FetchDropdownData imageUrls={imageUrls} onJsonUpdate={handleJsonUpdate} /><br />
          <pre>{JSON.stringify(uploadableFirestoreData, null, 2)}</pre><br />
          <FirestoreUpload 
            dataToUpload={uploadableFirestoreData} 
            collectionName="yourCollectionName" 
            onUploadComplete={handleJsonUpdate}
          /><br />
        </>
      ) : (
        <p>You must be logged in to view this page - protected route.</p>
      )}
    </div>
  );
};

export default page;