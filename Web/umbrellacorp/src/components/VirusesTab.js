import React from 'react';
import { useState, useRef, useEffect } from 'react';
import '../SubjectTab.css'; // Import your custom styles
import axios from 'axios';



const VirusesTab = () => {

  const [addVisible, setAddVisible] = useState(false);
  const [getVisible, setGetVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const [selectedOption, setSelectedOption] = useState('');
  const options = ["Low", "Medium", "High"];

  const [postData, setPostData] = useState({})

  const [idPost, setIDPost] = useState(0)
  const [namePost, setNamePost] = useState("")
  const [typePost, setTypePost] = useState("")
  const [familyPost, setFamilyPost] = useState("")
  const [descPost, setDescPost] = useState("")
  const [genPost, setGenPost] = useState(0)

  useEffect(() => {
     
    setPostData({
      id: idPost,
      name: namePost,
      type: typePost,
      family: familyPost,
      desc: descPost,
      lethality: selectedOption,
      genCode: genPost
    })
  }, [idPost, namePost, typePost, familyPost, descPost, genPost, selectedOption]);

  const [displayText, setDisplayText] = useState('Welcome, employee');

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleAddVirusClick = () => {
    setAddVisible(!addVisible);
  };

  const handleAddVirusDBClick = () => {
    axios.post('http://localhost:5016/api/Virus', postData, {
      withCredentials: true, // Include this line to send credentials
    })
    .then(response => {
      setDisplayText(`Succesfully entered Virus ${namePost} of type ${typePost}`)
    })
    .catch(error => {
      if (error.response.status === 400) {
        setDisplayText(`Failure to POST Virus. Check input values`)
      }

      if (error.response.status === 409) {
        setDisplayText(`Virus with ID ${idPost} already exists, failure to POST`)
      }

    })
  };

  const handleGetVirusClick = () => {
    setGetVisible(!getVisible);
  };

  const handleGetVirusDBClick = () => {

    var id = idPost
    axios.get(`http://localhost:5016/api/Virus/${id}`)
    .then(response => {
      var obj = response.data
      const multilineString = `Key : ${obj.id}
      Name: ${obj.name}
      Type : ${obj.type} type
      Family : ${obj.family} genera
      Description: ${obj.desc}
      Lethality: ${obj.lethality}
      Gen Code : ${obj.genCode}
      `;
      setDisplayText(multilineString)
    })
    .catch(error => {
      if (error.response.status === 404) {
        setDisplayText(`Error during GET, Virus with ID ${id} does not exist`)
      }

      if (error.response.status === 400) {
        setDisplayText("Error during GET, please enter a valid ID number")
      }

    })
  }

  const handleUpdateVirusClick = () => {
    setUpdateVisible(!updateVisible);
  };

  const handleUpdateVirusDBClick = () => {

    axios.put(`http://localhost:5016/api/Virus/${idPost}`, postData, {
      withCredentials: true, // Include this line to send credentials
    })
    .then(response => {
      setDisplayText(`Succesfully updated Virus ${namePost} of type ${typePost}`)
    })
    .catch(error => {
      if (error.response.status === 404) {
        setDisplayText(`Failure to PUT Virus. Virus doesn't exist`)
      }

      if (error.response.status === 409) {
        setDisplayText(`Failure to PUT, invalid operation : virus ID change`)
      }

      if (error.response.status === 304) {
        setDisplayText('Failure to PUT Virus, New Gen Code smaller than 13')
      }

      else {
        console.log(error)
      }

    })
  }

  const handleDeleteVirusClick = () => {
    setDeleteVisible(!deleteVisible);
  };

  const handleDeleteVirusDBClick = () => {
    axios.delete(`http://localhost:5016/api/Virus/${idPost}`)
    .then (response => {
      setDisplayText(`Sucessfully eradicated Virus ${idPost}`)
    })
    .catch(error => 
      {
        if (error.response.status === 404) {
          setDisplayText(`Failure to DELETE Virus. Virus doesn't exist`)
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
      <button className="terminal-button" onClick={handleAddVirusClick}>Create Virus</button>
        {
          addVisible &&  <div className="input-container">
              <div className="input-item">
                <label htmlFor="inputField1">ID:</label>
                <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField1">Virus Name:</label>
                <input type="text" id="nameInput" name="nameInput" onChange={(e) => setNamePost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Type:</label>
                <input type="text" id="typeinput" name="typeinput" onChange={(e) => setTypePost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Family:</label>
                <input type="text" id="familyInput" name="familyInput" onChange={(e) => setFamilyPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Description:</label>
                <input type="text" id="descInput" name="descInput" onChange={(e) => setDescPost(e.target.value)}/>
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
              <div className="input-item">
                <label htmlFor="inputField2">Gen Code:</label>
                <input type="text" id="genInput" name="genInput" onChange={(e) => setGenPost(e.target.value)}/>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className="terminal-button" onClick={handleAddVirusDBClick}>
                    Add to Database
                  </button>
            </div>

          </div>
        }
        </div>

        <div className="button-item">
      <button className="terminal-button" onClick={handleGetVirusClick}>Get Virus</button>
      {
          getVisible && <div className="input-container">
          <div className="input-item">
            <label htmlFor="inputField1">ID:</label>
            <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button className="terminal-button" onClick={handleGetVirusDBClick}>
                Get Virus From Database
              </button>
        </div>
              
          </div>
          
        }
        </div>

      
        <div className="button-item">
      <button className="terminal-button" onClick={handleUpdateVirusClick}>Update Virus</button>
        {
          updateVisible &&  <div className="input-container">
              <div className="input-item">
                <label htmlFor="inputField1">ID:</label>
                <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField1">Virus Name:</label>
                <input type="text" id="nameInput" name="nameInput" onChange={(e) => setNamePost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Type:</label>
                <input type="text" id="typeinput" name="typeinput" onChange={(e) => setTypePost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Family:</label>
                <input type="text" id="familyInput" name="familyInput" onChange={(e) => setFamilyPost(e.target.value)} />
              </div>
              <div className="input-item">
                <label htmlFor="inputField2">Description:</label>
                <input type="text" id="descInput" name="descInput" onChange={(e) => setDescPost(e.target.value)}/>
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
              <div className="input-item">
                <label htmlFor="inputField2">Gen Code:</label>
                <input type="text" id="genInput" name="genInput" onChange={(e) => setGenPost(e.target.value)}/>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className="terminal-button" onClick={handleUpdateVirusDBClick}>
                    Update Virus
                  </button>
            </div>

          </div>
        }
        </div>

        <div className="button-item">
      <button className="terminal-button" onClick={handleDeleteVirusClick}>Delete Virus</button>
      {
          deleteVisible && <div className="input-container">
          <div className="input-item">
            <label htmlFor="inputField1">ID:</label>
            <input type="text" id="idInput" name="idInput" onChange={(e) => setIDPost(e.target.value)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button className="terminal-button" onClick={handleDeleteVirusDBClick}>
                Delete Virus
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
  
  export default VirusesTab;

  