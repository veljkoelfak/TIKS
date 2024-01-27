import React from 'react';
import { useState, useRef, useEffect } from 'react';
import '../SubjectTab.css'; // Import your custom styles
import axios from 'axios';



const ExperimentsTab = () => {

  const [addVisible, setAddVisible] = useState(false);
  const [getVisible, setGetVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [postData, setPostData] = useState({})

  const [idPost, setIDPost] = useState(0)
  const [virusPost, setVirusPost] = useState(0)
  const [subPost, setSubPost] = useState(0)
  const [outcomePost, setOutComePost] = useState("")
  const [descPost, setDescPost] = useState("")
  const [notesPost, setNotesPost] = useState("")

  useEffect(() => {
     
    setPostData({
      id: idPost,
      subjectId: subPost,
      virusId: virusPost,
      desc: descPost,
      outcome: outcomePost,
      notes: notesPost
    })
  }, [idPost, subPost, virusPost, notesPost, descPost]);

  const [displayText, setDisplayText] = useState('Welcome, employee');

  const handleAddExpClick = () => {
    setAddVisible(!addVisible);
  };

  const handleAddExpDBClick = () => {
    axios.post('http://localhost:5016/api/Experiment', postData, {
      withCredentials: true, // Include this line to send credentials
    })
    .then(response => {
      setDisplayText(`Succesfully entered Experiment with Subject ${subPost} and Virus ${virusPost}`)
    })
    .catch(error => {
      if (error.response.status === 400) {
        setDisplayText(`Failure to POST Experiment. Check input values`)
      }

      if (error.response.status === 409) {
        setDisplayText(`Experiment with ID ${idPost} already exists, failure to POST`)
      }

      if (error.response.status === 401) {
        setDisplayText(`Subject with ID ${subPost} doesn't exist, failure to POST`)
      }

      if (error.response.status === 422) {
        setDisplayText(`Virus with ID ${virusPost} doesn't exist, failure to POST`)
      }

    })
  };

  const handleGetExpClick = () => {
    setGetVisible(!getVisible);
  };

  const handleGetExpDBClick = () => {

    var id = idPost
    var obj = null
    var virName = ""
    var subFirst = ""
    var subLast = ""
    axios.get(`http://localhost:5016/api/Experiment/${id}`)
    .then(response => {
      obj = response.data
      axios.get(`http://localhost:5016/api/Experiment/virus/${obj.virusId}`)
      .then (response => {
        virName = response.data
        axios.get(`http://localhost:5016/api/Experiment/subject/${obj.subjectId}`)
        .then (response => {
          subFirst = response.data.firstName
          subLast = response.data.lastName

          const multilineString = `Key : ${obj.id}
          Virus ID: ${obj.virusId}
          Virus Name : ${virName}
          Subject ID : ${obj.subjectId}
          Subject First Name: ${subFirst}
          Subject Last Name: ${subLast}
          Description : ${obj.desc}
          Outcome : ${obj.outcome}
          Notes : ${obj.notes}
          `;
      setDisplayText(multilineString)
        })
      })
    })
    .catch(error => {
      if (error.response.status === 404) {
        setDisplayText(`Error during GET, Experiment with ID ${id} does not exist`)
      }

      if (error.response.status === 400) {
        setDisplayText("Error during GET, please enter a valid ID number")
      }

    })
  }

  const handleUpdateExpClick = () => {
    setUpdateVisible(!updateVisible);
  };

  const handleUpdateExpDBClick = () => {

    axios.put(`http://localhost:5016/api/Experiment/${idPost}`, postData, {
      withCredentials: true, // Include this line to send credentials
    })
    .then(response => {
      setDisplayText(`Succesfully updated Experiment ${idPost}`)
    })
    .catch(error => {
      if (error.response.status === 400) {
        setDisplayText(`Failure to POST Experiment. Check input values`)
      }

      if (error.response.status === 404) {
        setDisplayText(`Experiment with ID ${idPost} doesn't exists, failure to POST`)
      }

      if (error.response.status === 401) {
        setDisplayText(`Subject with ID ${subPost} doesn't exist, failure to POST`)
      }

      if (error.response.status === 422) {
        setDisplayText(`Virus with ID ${virusPost} doesn't exist, failure to POST`)
      }

    })
  }

  const handleDeleteExpClick = () => {
    setDeleteVisible(!deleteVisible);
  };

  const handleDeleteExpDBClick = () => {
    axios.delete(`http://localhost:5016/api/Experiment/${idPost}`)
    .then (response => {
      setDisplayText(`Sucessfully classified Experiment ${idPost}`)
    })
    .catch(error => 
      {
        if (error.response.status === 404) {
          setDisplayText(`Failure to DELETE Experiment. Experiment doesn't exist`)
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
      <button className="terminal-button" onClick={handleAddExpClick}>Conduct Experiment</button>
        {
          addVisible &&  <div className="input-container">
              <div className="input-item">
                <label htmlFor="inputField1">ID:</label>
                <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField1">Virus ID:</label>
                <input type="text" id="virusIDInput" name="virusIDInput" onChange={(e) => setVirusPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Subject ID:</label>
                <input type="text" id="subjectIDInput" name="subjectIDInput" onChange={(e) => setSubPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Description:</label>
                <input type="text" id="descInput" name="descInput" onChange={(e) => setDescPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Outcome:</label>
                <input type="text" id="outcomeInput" name="outcomeInput" onChange={(e) => setOutComePost(e.target.value)}/>
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Notes:</label>
                <input type="text" id="notesInput" name="notesInput" onChange={(e) => setNotesPost(e.target.value)}/>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className="terminal-button" onClick={handleAddExpDBClick}>
                    Add to Database
                  </button>
            </div>

          </div>
        }
        </div>

        <div className="button-item">
      <button className="terminal-button" onClick={handleGetExpClick}>Get Experiment</button>
      {
          getVisible && <div className="input-container">
          <div className="input-item">
            <label htmlFor="inputField1">ID:</label>
            <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button className="terminal-button" onClick={handleGetExpDBClick}>
                Get Experiment From Database
              </button>
        </div>
              
          </div>
          
        }
        </div>

      
        <div className="button-item">
      <button className="terminal-button" onClick={handleUpdateExpClick}>Update Experiment</button>
        {
          updateVisible &&  <div className="input-container">
              <div className="input-item">
                <label htmlFor="inputField1">ID:</label>
                <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField1">Virus ID:</label>
                <input type="text" id="virusIDInput" name="virusIDInput" onChange={(e) => setVirusPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Subject ID:</label>
                <input type="text" id="subjectIDInput" name="subjectIDInput" onChange={(e) => setSubPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Description:</label>
                <input type="text" id="descInput" name="descInput" onChange={(e) => setDescPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Outcome:</label>
                <input type="text" id="outcomeInput" name="outcomeInput" onChange={(e) => setOutComePost(e.target.value)}/>
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Notes:</label>
                <input type="text" id="notesInput" name="notesInput" onChange={(e) => setNotesPost(e.target.value)}/>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className="terminal-button" onClick={handleUpdateExpDBClick}>
                    Update Experiment
                  </button>
            </div>

          </div>
        }
        </div>

        <div className="button-item">
      <button className="terminal-button" onClick={handleDeleteExpClick}>Delete Experiment</button>
      {
          deleteVisible && <div className="input-container">
          <div className="input-item">
            <label htmlFor="inputField1">ID:</label>
            <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button className="terminal-button" onClick={handleDeleteExpDBClick}>
                Classify Experiment
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
  
  export default ExperimentsTab;

  