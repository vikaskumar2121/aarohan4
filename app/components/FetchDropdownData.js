import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Testcomp from './testcomponent';

const FetchDropdownData = ({ imageUrls, onJsonUpdate }) => {
  const [data, setData] = useState({ dropdownData: null, qtypeDropdown: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const docRef = doc(firestore, 'dropData', 'docid');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Assuming 'string1' is a JSON string
          const jsonString = docSnap.data().string1;

          // Check if the JSON string is valid and parse it
          if (jsonString) {
            const parsedData = JSON.parse(jsonString);
            setData({
              dropdownData: parsedData.dropdownData,
              qtypeDropdown: parsedData.qtypeDropdown
            });
          }
        } else {
          setError('No data found');
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        setError('Error parsing JSON data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Testcomp 
      dropdownData={data.dropdownData}
      qtypeDropdown={data.qtypeDropdown}
      imageUrls={imageUrls}
      onJsonUpdate={onJsonUpdate}
    />
  );
};

export default FetchDropdownData;
