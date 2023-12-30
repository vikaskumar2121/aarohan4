import { useState } from "react";
import Image from 'next/image';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // Adjust the path as needed

const ImageUpload = ({ onUpdateState }) => {
    const [questionImage, setQuestionImage] = useState(null);
    const [solutionImage, setSolutionImage] = useState(null);
    const [imagesForUpload, setImagesForUpload] = useState({ question: null, solution: null });

    // Function to handle image selection
    const handleImageSelection = (event, type) => {
        const selectedFile = event.target.files[0];
        setImagesForUpload({ ...imagesForUpload, [type]: selectedFile });
        
        if (type === 'question') {
            setQuestionImage(URL.createObjectURL(selectedFile));
        } else if (type === 'solution') {
            setSolutionImage(URL.createObjectURL(selectedFile));
        }
    };

    const uploadImage = async (imageFile) => {
        const imageRef = ref(storage, `images/${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        return getDownloadURL(snapshot.ref);
    };

    const handleImageUpload = async () => {
        if (imagesForUpload.question && imagesForUpload.solution) {
            try {
                const questionURL = await uploadImage(imagesForUpload.question);
                const solutionURL = await uploadImage(imagesForUpload.solution);
                onUpdateState([questionURL, solutionURL]); // Pass array of URLs back to parent component
            } catch (error) {
                console.error('Error uploading images:', error);
            }
        } else {
            console.warn('Both images need to be selected for upload!');
        }
    };

    return (
        <>
            <p>Hi, please upload your question and solution images.</p>
            <input type="file" onChange={(e) => handleImageSelection(e, 'question')} />
            {questionImage && <Image src={questionImage} alt="Question" width={500} height={240} priority />}
            <input type="file" onChange={(e) => handleImageSelection(e, 'solution')} />
            {solutionImage && <Image src={solutionImage} alt="Solution" width={500} height={240} priority />}
            <button onClick={handleImageUpload}>Upload Images</button>
        </>
    );
};

export default ImageUpload;
