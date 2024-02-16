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
  <>{JSON.stringify({qrelavanceDropdown})}</>
  <div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="Qsource" style={{ flex: 1, marginRight: '10px' }}>
    Question Source:
  </label>
  <select
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
</div>
<div style={{ display: 'flex', alignItems: 'center' }}>
  <label htmlFor="serialNumber" style={{ flex: 1, marginRight: '10px' }}>
    Serial Number:
  </label>
  <input
    type="number"
    id="serialNumber"
    style={{ flex: 2, marginLeft: '10px' }}
    value={state.formData.serialNumber}
    onChange={handleInputChange}
    min="0" // Ensure that only non-negative numbers can be entered
  />
</div>

    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="Qtext" style={{ flex: 1, marginRight: '10px' }}>
        Question Text:
      </label>
      <input
        type="text"
        id="Qtext"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Qtext}
        onChange={handleInputChange}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="Stext" style={{ flex: 1, marginRight: '10px' }}>
        Solution Text:
      </label>
      <input
        type="text"
        id="Stext"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Stext}
        onChange={handleInputChange}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="Atext" style={{ flex: 1, marginRight: '10px' }}>
        Answer Text:
      </label>
      <input
        type="text"
        id="Atext"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Atext}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label htmlFor="Qsubject">Subject:</label>
      <select id="Qsubject" value={selectedSubject} onChange={handleSubjectChange}>
        <option value="">Select a subject</option>
        {dropdownData.subjects.map((subj) => (
          <option key={subj.name} value={subj.name}>
            {subj.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="Qchapter">Chapter:</label>
      <select id="Qchapter" value={selectedChapter} onChange={handleChapterChange} disabled={!selectedSubject}>
        <option value="">Select a chapter</option>
        {subject && subject.chapters.map((chap) => (
          <option key={chap.name} value={chap.name}>
            {chap.name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="Qconcept">Concept:</label>
      <select id="Qconcept" value={selectedConcept} onChange={handleConceptChange} disabled={!selectedChapter}>
        <option value="">Select a concept</option>
        {chapter && chapter.concepts.map((concept) => (
          <option key={concept.name} value={concept.name}>
            {concept.name}
          </option>
        ))}
      </select>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="Qdifficulty" style={{ flex: 1, marginRight: '10px' }}>
        Question Difficulty:
      </label>
      <input
        type="number"
        id="Qdifficulty"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Qdifficulty}
        onChange={handleInputChange}
      />
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="Qrelavance" style={{ flex: 1, marginRight: '10px' }}>
        Question Relevance:
      </label>
      <select
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
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="Qtype" style={{ flex: 1, marginRight: '10px' }}>
        Question Type:
      </label>
      <select
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
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="Qmagnitude" style={{ flex: 1, marginRight: '10px' }}>
        Question Magnitude:
      </label>
      <input
        type="number"
        id="Qmagnitude"
        style={{ flex: 2, marginLeft: '10px' }}
        value={state.formData.Qmagnitude}
        onChange={handleInputChange} min="1" max="5"
      />
    </div>
    <button 
      onClick={handleSubmit} 
      disabled={!isFormValid()}
    >
      Submit
    </button>
  </div>
</>

  );
}
