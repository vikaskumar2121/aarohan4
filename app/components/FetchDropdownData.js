import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Testcomp from './testcomponent';

const FetchDropdownData = ({ imageUrls, onJsonUpdate }) => {
  const [data, setData] = useState({ dropdownData: null, qtypeDropdown: null,qsourcesDropdown:null ,qrelavanceDropdown:null});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const docRef = doc(firestore, 'dropData', 'docid');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Assuming 'string1' is a JSON string
          const jsonString1 = docSnap.data().string1;
          const jsonString2 = docSnap.data().string2;
          const jsonString3 = docSnap.data().string3;
          const jsonString4 = docSnap.data().string4;

          // Check if the JSON string is valid and parse it
          if (jsonString1 && jsonString2 && jsonString3 && jsonString4) {
            const parsedData1 = JSON.parse(jsonString1);
            const parsedData2 = JSON.parse(jsonString2);
            const parsedData3 = JSON.parse(jsonString3);
            const parsedData4 = JSON.parse(jsonString4);
            setData({
              dropdownData: parsedData1.dropdownData,
              qtypeDropdown: parsedData2.qtypeDropdown,
              qsourcesDropdown: parsedData3.qsources,
              qrelavanceDropdown: parsedData4.qrelavanceDropdown
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
      qsourcesDropdown={data.qsourcesDropdown}
      qrelavanceDropdown={data.qrelavanceDropdown}
      imageUrls={imageUrls}
      onJsonUpdate={onJsonUpdate}
    />
  );
};

export default FetchDropdownData;
