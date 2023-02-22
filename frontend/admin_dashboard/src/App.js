import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function App() {
  const [travelGuideRequests, setTravelGuideRequests] = useState([]);
  useEffect(() => {
    getTravelGuides();
  }, []);

  async function getTravelGuides() {
        await axios
          .get('http://localhost:8000/travelGuide/applications')
          .then(res => {
            const data = res.data.travelGuidesRequests;
            setTravelGuideRequests([...travelGuideRequests, ...data]);
          })
          .catch(err => {
            console.log(err);
          });
  }
  return (
    <>
      <div class="top-bar">
        <h1>Admin Dashboard</h1>
      </div>
      <div id="audio-div">
        {
          travelGuideRequests.length === 0 ?

          <div class="nothing">
            <h3>No Travel Guide Requests</h3>
          </div> : travelGuideRequests.map(request => (
              <div id={request._id} class="audio-single">
                <div class="audio title">
                  <h3>{request.name}</h3>
                </div>
                <div class="audio description">
                  <p>{request.description}</p>
                </div>
                <div class="audio">
                  <audio controls id="audio">
                    <source src={request.audioUrl} type="audio/mpeg"/>
                  </audio>
                </div>
                <div class="audio buttons">
                  <button class="audio button classify">Auto classify</button>
                  <button class="audio button accept">Accept</button>
                  <button class="audio button reject">Reject</button>
                </div>
              </div>
            ))
        }
      </div>
    </>
  );
}

export default App;
