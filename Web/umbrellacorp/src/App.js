import React, { useState } from 'react';
import { useRef, useEffect } from 'react';
import './App.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SubjectsTab from './components/SubjectsTab';
import VirusesTab from './components/VirusesTab';
import ExperimentsTab from './components/ExperimentsTab';

import start from './resources/logo.png'


function App() {
  useEffect(() => {
    document.title = 'Umbrella Corp';
  }, [])

  const handleButtonClick = () => {
    window.close();
  };

  return (
    <div className="App">
      <Tabs>
        <TabList className="side-tabs">
          <Tab className="tab-item">Subjects</Tab>
          <Tab className="tab-item">Viruses</Tab>
          <Tab className="tab-item">Experiments</Tab>
        </TabList>

        <div className="content-container">
          <TabPanel>
            <div>
              <SubjectsTab></SubjectsTab>
              {/* Content for Subjects Tab */}
            </div>
          </TabPanel>

          <TabPanel>
            <div>
              <VirusesTab></VirusesTab>
              {/* Content for Viruses Tab */}
            </div>
          </TabPanel>

          <TabPanel>
            <div>
              <ExperimentsTab></ExperimentsTab>
              {/* Content for Experiments Tab */}
            </div>
          </TabPanel>
        </div>
      </Tabs>

      <div class="msdos-container">
    <div class="msdos-bottom-bar">
      <div class = "msdos-start">
        <img class = "msdos-image" src = {start} alt = "Umbrella Logo"/>
        <p class = "msdos-p"> Start </p>
      </div>
      <div class = "msdos-close">
      <button className="terminal-button" onClick={handleButtonClick}>
                    Log Out
      </button>
      </div>
    </div>
  </div>

    </div>
  );
}

export default App;
