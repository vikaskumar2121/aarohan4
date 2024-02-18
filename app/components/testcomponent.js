"use client"
import { useReducer, useEffect } from 'react';
import Image from 'next/image';

const initialState = {
  selectedSubject: '',
  selectedChapter: '',
  selectedConcept: '',
  formData: {
    Qsource: '',
    Qimage: '',
    Qtext: '',
    Simage: '',
    Stext: '',
    Atext: '',
    Qdifficulty: '5',
    Qrelavance: [],
    Qtype: '',
    Qmagnitude: '1',
    serialNumber: '0',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_SUBJECT':
      return {
        ...state,
        selectedSubject: action.payload,
        selectedChapter: '',
        selectedConcept: '',
      };
    case 'SELECT_CHAPTER':
      return {
        ...state,
        selectedChapter: action.payload,
        selectedConcept: '',
      };
    case 'SELECT_CONCEPT':
      return {
        ...state,
        selectedConcept: action.payload,
      };
      case 'UPDATE_FORM':
        if(action.payload.field === 'Qrelavance') {
          return {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.field]: [...action.payload.value], // Ensures the value is treated as an array
            },
          };
        } else {
          return {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.field]: action.payload.value,
            },
          };
        };
    case 'SET_INITIAL_IMAGES':
      return {
        ...state,
        formData: {
          ...state.formData,
          Qimage: action.payload[0] ?? '',
          Simage: action.payload[1] ?? '',
        },
      };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
};

export default function Testcomp({ dropdownData, qtypeDropdown,qsourcesDropdown,qrelavanceDropdown,  imageUrls, onJsonUpdate }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (imageUrls && imageUrls.length === 2) {
      dispatch({
        type: 'SET_INITIAL_IMAGES',
        payload: imageUrls,
      });
    }
  }, [imageUrls]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'Qtype') {
      const selectedText = qtypeDropdown[value];
      const firstLetter = selectedText ? selectedText[0] : ''; // Assuming 'value' is the key in your qtypeDropdown object
      dispatch({
        type: 'UPDATE_FORM',
        payload: { field: 'Qmagnitude', value: firstLetter },
      });
    }
    dispatch({
      type: 'UPDATE_FORM',
      payload: { field: id, value },
    });
  };
  

  const handleSubjectChange = (e) => {
    const selectedSubject = e.target.value;
    dispatch({ type: 'SELECT_SUBJECT', payload: selectedSubject });
  };

  const handleChapterChange = (e) => {
    const selectedChapter = e.target.value;
    dispatch({ type: 'SELECT_CHAPTER', payload: selectedChapter });
  };

  const handleConceptChange = (e) => {
    const selectedConcept = e.target.value;
    dispatch({ type: 'SELECT_CONCEPT', payload: selectedConcept });
  };

  const handleSubmit = () => {
    const enhancedFormData = {
      ...state.formData,
      selectedSubject: state.selectedSubject,
      selectedChapter: state.selectedChapter,
      selectedConcept: state.selectedConcept,
    };

    onJsonUpdate(enhancedFormData);
    dispatch({ type: 'RESET_FORM' });
  };

  const isFormValid = () => {
    const { formData, selectedSubject, selectedChapter, selectedConcept } = state;
    return (
      formData.Qsource.trim() &&
      formData.Qimage.trim() &&
      formData.Qtext.trim() &&
      formData.Simage.trim() &&
      formData.Stext.trim() &&
      formData.Atext.trim() &&
      formData.Qdifficulty.trim() &&
      formData.Qrelavance.length > 0 && // Check that Qrelavance array is not empty
      formData.Qtype.trim() &&
      formData.Qmagnitude.trim() &&
      selectedSubject &&
      selectedChapter &&
      selectedConcept &&
      !isNaN(formData.serialNumber) && // Check if serialNumber is a number
      parseInt(formData.serialNumber, 10) >= 0 // Ensure serialNumber is not negative
    );
  };

  const { selectedSubject, selectedChapter, selectedConcept, formData } = state;
  const subject = dropdownData.subjects.find((subj) => subj.name === selectedSubject);
  const chapter = subject ? subject.chapters.find((chap) => chap.name === selectedChapter) : null;

  if (!dropdownData || !qtypeDropdown) {
    return <div>Loading...</div>;
  }

  return (
    <>
  <p>"test comp"</p>
  
  <div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
  <label className="form-control w-full max-w-xs" htmlFor="Qsource" style={{ flex: 1, marginRight: '10px' }}>
  <div className="label">
  <span className="label-text">Question Source:</span>
    
    </div>
  <select className="select select-bordered"
    id="Qsource"
    style={{ flex: 2, marginLeft: '10px' }}
    value={state.formData.Qsource}
    onChange={handleInputChange}
  >
    <option value="">Select a question source</option>
    {qsourcesDropdown && qsourcesDropdown
      .filter(source => source.isActive) // Filter out sources where isActive is false
      .map((source, index) => (
        <option key={index} value={source.qsource}>
          {source.qsource}
        </option>
      ))}
  </select>
  </label>

  <label className="form-control w-full max-w-xs" htmlFor="serialNumber" style={{ flex: 1, marginRight: '10px' }}>
  <div className="label">
  <span className="label-text">Serial Number:</span>
    
    </div>
  <input className="input input-bordered w-16"
    
    type="number"
    id="serialNumber"
    style={{ flex: 2, marginLeft: '10px' }}
    value={state.formData.serialNumber}
    onChange={handleInputChange}
    min="0" // Ensure that only non-negative numbers can be entered
  />
  </label>
</div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label className="form-control w-full max-w-xs" htmlFor="Qtext" style={{ flex: 1, marginRight: '10px' }}>
      <div className="label">
      <span className="label-text">Question Text:</span>
        
        </div>
      <textarea className="textarea textarea-bordered h-24"
        
        type="text"
        id="Qtext"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Qtext}
        onChange={handleInputChange}
      > </textarea>
      </label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label className="form-control w-full max-w-xs" htmlFor="Stext" style={{ flex: 1, marginRight: '10px' }}>
      <div className="label">
      <span className="label-text">Solution Text:</span>
        
      </div>
      <textarea className="textarea textarea-bordered h-24"
        type="text"
        id="Stext"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Stext}
        onChange={handleInputChange}
        > </textarea>
      </label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label className="form-control w-full max-w-xs" htmlFor="Atext" style={{ flex: 1, marginRight: '10px' }}>
      <div className="label">
         <span className="label-text">Answer Text:</span>
      </div>
        
      <input className="input input-bordered w-full max-w-xs"
        type="text"
        id="Atext"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Atext}
        onChange={handleInputChange}
      />
      </label>
    </div>
    <div>
      <label className="form-control w-full max-w-xs" htmlFor="Qsubject">
      <div className="label">
      <span className="label-text">Subject:</span>
        
      </div> 
      <select className="select select-bordered"
      id="Qsubject" value={selectedSubject} onChange={handleSubjectChange}>
        <option value="">Select a subject</option>
        {dropdownData.subjects.map((subj) => (
          <option key={subj.name} value={subj.name}>
            {subj.name}
          </option>
        ))}
      </select>
      </label>
    </div>
    <div>
      <label className="form-control w-full max-w-xs" htmlFor="Qchapter">
      <div className="label">
        <span className="label-text"> Chapter:</span>
      </div>
      <select className="select select-bordered" id="Qchapter" value={selectedChapter} onChange={handleChapterChange} disabled={!selectedSubject}>
        <option value="">Select a chapter</option>
        {subject && subject.chapters.map((chap) => (
          <option key={chap.name} value={chap.name}>
            {chap.name}
          </option>
        ))}
      </select>
      </label>
    </div>
    <div>
      <label className="form-control w-full max-w-xs" htmlFor="Qconcept">
      <div className="label">
      <span className="label-text">Concept:</span>
        
      </div>
      <select className="select select-bordered" id="Qconcept" value={selectedConcept} onChange={handleConceptChange} disabled={!selectedChapter}>
        <option value="">Select a concept</option>
        {chapter && chapter.concepts.map((concept) => (
          <option key={concept.name} value={concept.name}>
            {concept.name}
          </option>
        ))}
      </select> 
      </label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label className="form-control w-full max-w-xs" htmlFor="Qdifficulty" style={{ flex: 1, marginRight: '10px' }}>
      <div className="label">
        <span className="label-text">Question Difficulty:</span>
        </div>
      
      <input className="input input-bordered w-full max-w-xs"
        type="number"
        id="Qdifficulty"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Qdifficulty}
        onChange={handleInputChange}
      />
      </label>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label className="form-control w-full max-w-xs" htmlFor="Qrelavance" style={{ flex: 1, marginRight: '10px' }}>
      <div className="label">
        <span className="label-text">Question Relevance:</span>
      </div>
        
      <select className="select select-bordered"
  id="Qrelavance"
  style={{ flex: 2, marginLeft: '10px' }}
  multiple={true}
  value={state.formData.Qrelavance}
  onChange={(e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    dispatch({
      type: 'UPDATE_FORM',
      payload: { field: e.target.id, value: selectedOptions },
    });
  }}
>
  {qrelavanceDropdown.map(relavance => (
    <option key={relavance} value={relavance}>
      {relavance}
    </option>
  ))}
</select>
</label>
    </div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label className="form-control w-full max-w-xs" htmlFor="Qtype" style={{ flex: 1, marginRight: '10px' }}>
      <div className="label">
        <span className="label-text"> Question Type: </span>
      </div>
      <select className="select select-bordered"
  id="Qtype"
  style={{ flex: 2, marginLeft: '10px' }}
  value={state.formData.Qtype}
  onChange={handleInputChange}
>
  <option value="">Select a question type</option>
  {Object.entries(qtypeDropdown).map(([key, value]) => (
    <option key={key} value={key}>
      {value} {/* Assuming value is what you want to display */}
    </option>
  ))}
</select>
</label>
    
      <label className="form-control w-full max-w-xs" htmlFor="Qmagnitude" style={{ flex: 1, marginRight: '10px' }}>
      <div className="label">
        <span className="label-text">Question Magnitude:</span>
      </div>
      
      <input className="input input-bordered w-16"
  type="text" // Change type to "text" since we might be displaying letters now
  id="Qmagnitude"
  style={{ flex: 2, marginLeft: '10px' }}
  value={state.formData.Qmagnitude}
  onChange={handleInputChange}
  disabled={true} // Disable this input
/>

      </label>
    </div>

    <button className="btn"
      onClick={handleSubmit} 
      disabled={!isFormValid()}
    >
      Submit
    </button>
  </div>
</>

  );
}
