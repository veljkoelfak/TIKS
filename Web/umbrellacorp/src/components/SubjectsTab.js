import React from 'react';
import { useState, useRef, useEffect } from 'react';
import '../SubjectTab.css'; // Import your custom styles
import axios from 'axios';



const SubjectsTab = () => {

  const [addVisible, setAddVisible] = useState(false);
  const [getVisible, setGetVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [selectedOption, setSelectedOption] = useState('');
  const options = ["Alive", "Missing", "Dead"];

  const [postData, setPostData] = useState({})


  const [idPost, setIDPost] = useState(0)
  const [firstPost, setFirstPost] = useState("")
  const [lastPost, setLastPost] = useState("")
  const [heightPost, setHeightPost] = useState(0)
  const [agePost, setAgePost] = useState(0)
  const [weightPost, setWeightPost] = useState(0)

  useEffect(() => {
     
    setPostData({
      id: idPost,
      firstName: firstPost,
      lastName: lastPost,
      height: heightPost,
      weight: weightPost,
      age: agePost,
      status: selectedOption
    })
  }, [idPost, firstPost, lastPost, heightPost, weightPost, agePost, selectedOption]);

  const [displayText, setDisplayText] = useState('Welcome, employee');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAddSubjectClick = () => {
    setAddVisible(!addVisible);
  };

  const handleAddSubjecDBClick = () => {
    axios.post('http://localhost:5016/api/Subject', postData, {
      withCredentials: true, // Include this line to send credentials
    })
    .then(response => {
      setDisplayText(`Succesfully entered Subject ${firstPost} ${lastPost}`)
    })
    .catch(error => {
      if (error.response.status === 400) {
        setDisplayText(`Failure to POST Subject. Check input values`)
      }

      if (error.response.status === 409) {
        setDisplayText(`Subject with ID ${idPost} already exists, failure to POST`)
      }

    })
  };

  const handleGetSubjectClick = () => {
    setGetVisible(!getVisible);
  };

  const handleGetSubjectDBClick = () => {

    var id = idPost
    axios.get(`http://localhost:5016/api/Subject/${id}`)
    .then(response => {
      var obj = response.data
      const multilineString = `Key : ${obj.id}
      First Name : ${obj.firstName}
      Last Name : ${obj.lastName}
      Age : ${obj.age} years
      Height: ${obj.height} cm
      Weight: ${obj.weight} kg
      Status : ${obj.status}
      `;
      setDisplayText(multilineString)
    })
    .catch(error => {
      if (error.response.status === 404) {
        setDisplayText(`Error during GET, Subject with ID ${id} does not exist`)
      }

      if (error.response.status === 400) {
        setDisplayText("Error during GET, please enter a valid ID number")
      }

    })
  }

  const handleUpdateSubjectClick = () => {
    setUpdateVisible(!updateVisible);
  };

  const handleUpdateSubjectDBClick = () => {

    axios.put(`http://localhost:5016/api/Subject/${idPost}`, postData, {
      withCredentials: true, // Include this line to send credentials
    })
    .then(response => {
      setDisplayText(`Succesfully updated Subject ${firstPost} ${lastPost}`)
    })
    .catch(error => {
      if (error.response.status === 404) {
        setDisplayText(`Failure to PUT Subject. Subject doesn't exist`)
      }

      if (error.response.status === 409) {
        setDisplayText(`Failure to PUT, invalid operation : Subject ID change`)
      }
    })
  }

  const handleDeleteSubjectClick = () => {
    setDeleteVisible(!deleteVisible);
  };

  const handleDeleteSubjectDBClick = () => {
    axios.delete(`http://localhost:5016/api/Subject/${idPost}`)
    .then (response => {
      setDisplayText(`Sucessfully terminated Subject ${idPost}`)
    })
    .catch(error => 
      {
        if (error.response.status === 404) {
          setDisplayText(`Failure to DELETE Subject. Subject doesn't exist`)
        }

        if (error.response.status === 400) {
          setDisplayText("Error during DELETE, please enter a valid ID number")
        }
      })
  }

    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div className="subjects-tab">
        <div className="button-item">
      <button className="terminal-button" onClick={handleAddSubjectClick}>Add Subject</button>
        {
          addVisible &&  <div className="input-container">
              <div className="input-item">
                <label htmlFor="inputField1">ID:</label>
                <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField1">First Name:</label>
                <input type="text" id="firstInput" name="firstInput" onChange={(e) => setFirstPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Last Name:</label>
                <input type="text" id="lastInput" name="lastInput" onChange={(e) => setLastPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Age:</label>
                <input type="text" id="ageInput" name="ageInput" onChange={(e) => setAgePost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Height:</label>
                <input type="text" id="heightInput" name="heightInput" onChange={(e) => setHeightPost(e.target.value)}/>
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Weight:</label>
                <input type="text" id="weightInput" name="weightInput" onChange={(e) => setWeightPost(e.target.value)}/>
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Status:</label>
                 <select id="statusDropdown" value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className="terminal-button" onClick={handleAddSubjecDBClick}>
                    Add to Database
                  </button>
            </div>

          </div>
        }
        </div>

        <div className="button-item">
      <button className="terminal-button" onClick={handleGetSubjectClick}>Get Subject</button>
      {
          getVisible && <div className="input-container">
          <div className="input-item">
            <label htmlFor="inputField1">ID:</label>
            <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button className="terminal-button" onClick={handleGetSubjectDBClick}>
                Get Subject From Database
              </button>
        </div>
              
          </div>
          
        }
        </div>

      
        <div className="button-item">
      <button className="terminal-button" onClick={handleUpdateSubjectClick}>Update Subject</button>
        {
          updateVisible &&  <div className="input-container">
<div className="input-item">
                <label htmlFor="inputField1">ID:</label>
                <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField1">First Name:</label>
                <input type="text" id="firstInput" name="firstInput" onChange={(e) => setFirstPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Last Name:</label>
                <input type="text" id="lastInput" name="lastInput" onChange={(e) => setLastPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Age:</label>
                <input type="text" id="ageInput" name="ageInput" onChange={(e) => setAgePost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Height:</label>
                <input type="text" id="heightInput" name="heightInput" onChange={(e) => setHeightPost(e.target.value)}/>
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Weight:</label>
                <input type="text" id="weightInput" name="weightInput" onChange={(e) => setWeightPost(e.target.value)}/>
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Status:</label>
                 <select id="statusDropdown" value={selectedOption} onChange={handleSelectChange}>
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className="terminal-button" onClick={handleUpdateSubjectDBClick}>
                    Update Subject
                  </button>
            </div>

          </div>
        }
        </div>

        <div className="button-item">
      <button className="terminal-button" onClick={handleDeleteSubjectClick}>Delete Subject</button>
      {
          deleteVisible && <div className="input-container">
          <div className="input-item">
            <label htmlFor="inputField1">ID:</label>
            <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button className="terminal-button" onClick={handleDeleteSubjectDBClick}>
                Delete Subject
              </button>
        </div>
              
          </div>
          
        }
        </div>

    </div>
    <div className = "output-console">
      <div className = "top-bar">
        <div>
          <p> Umbrella Coorporation Terminal (C) Oswell E. Spencer 1983</p>
          </div>
        <div class="cursor">

        </div>
      </div>
      <div className = "console-data">
        <p className = "console-text">{displayText}</p>
      </div>
    </div>
    </div>
    );
  };
  
  export default SubjectsTab;

  