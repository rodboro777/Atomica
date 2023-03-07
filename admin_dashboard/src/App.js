import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {GoogleAuth} from 'google-auth-library';
import { SpeechClient } from '@google-cloud/speech/build/src/v1p1beta1';
import Navbar from './Navbar';
import mockImage from './dkit_campus.jpeg';
import Button from '@mui/material/Button';
import CircleLoader from "react-spinners/CircleLoader";
import TextField from '@mui/material/TextField';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

function App() {
  // REACT SPINNERS STUFFS
  const override = {
    display: "block",
    margin: "0",
  };
  let [loading, setLoading] = useState({});
  let [color, setColor] = useState("#6cac57");


  // SPEECH-TO-TEXT STUFFS
  // Load the contents of the JSON credentials file
  const keyFile = require('./guidify-369315-78db1b10c2fd.json');
  // Create a new GoogleAuth client with the credentials
  const auth = new GoogleAuth({
    credentials: keyFile,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
    // Create a new SpeechClient with the authentication client
  const client = new SpeechClient({
    auth: auth
  });


  // CHART.JS STUFFS.
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    },
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2
      }
    },
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    }
  };
  
  const labels = ["Valid", "Invalid - others", "Invalid - harassment"];


  // COMPONENT STUFFS
  const [travelGuideRequests, setTravelGuideRequests] = useState([]);
  const [autoClassifyData, setAutoClassifyData] = useState({});
  const [readyForReview, setReadyForReview] = useState({});
  const [reviewerComments, setReviewerComments] = useState({});
  const TG_STATUS = {
    APPROVED: 'approved',
    PENDING: 'pending',
    REJECTED: 'rejected'
  };

  const [currentPage, setCurrentPage] = useState(TG_STATUS.PENDING);

  useEffect(() => {
    getTravelGuides();
  }, [currentPage]);

  const CLASSIFICATION = {
    VALID: 'valid',
    INVALID_OTHERS: 'invalid - others',
    INVALID_HARASSMENT: 'invalid - harassment',
  };

  async function getTravelGuides() {
        await axios
          .get(`http://localhost:8000/travelGuide/applications?status=${currentPage}`)
          .then(res => {
            const data = res.data.travelGuidesRequests;
            setTravelGuideRequests(data);
          })
          .catch(err => {
            console.log(err);
          });
  }

  async function makeAction(id, action) {
    console.log(id, action);
    if (!action && !reviewerComments[id]) {
      alert("Rejected travel guides must be given comments.");
    }
    await axios
      .post('http://localhost:8000/travelGuide/applicationAction', {
        requestId: id,
        approve: action,
        reviewerComment: reviewerComments[id] ? reviewerComments[id] : "",
      })
      .then(res => {
        setTravelGuideRequests(prev => {
          return prev.filter(tg => tg._id != id);
        });
      })
      .catch(err => {
        alert('Error');
        console.log(err);
      });
  }

  async function transcribeAudio(audioUrl) {
    // construct gcsUri
    const tmp = audioUrl.split("/");
    const gcsUri = `gs://${tmp[3]}/${tmp[4]}`;
    
    // transcribe audio.
    const encoding = 'MP3';
    const sampleRateHertz = 16000;
    const languageCode = 'en-US';
    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      enableWordConfidence: true,
    };
  
    const audio = {
      uri: gcsUri,
    };
  
    const request = {
      config: config,
      audio: audio,
    };
  
    // Detects speech in the audio file. This creates a recognition job that you
    // can wait for now, or get its result later.
    const [operation] = await client.longRunningRecognize(request);
    // Get a Promise representation of the final result of the job
    const [response] = await operation.promise();
    let totalConfidence = 1;
    const transcription = response.results
      .map(result => {
        totalConfidence *= result.alternatives[0].confidence;
        return result.alternatives[0].transcript;
      })
      .join(' ');
    return [transcription, totalConfidence];
  }

  async function autoClassify(requestId, audioUrl) {
    let tmp = {};
    tmp[requestId] = true;
    setLoading({...loading, ...tmp});
    const [transcription, transcribeConfidenceLevel] = await transcribeAudio(audioUrl);
    
    // Auto classify audio.
    fetch(`http://127.0.0.1:5000`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: transcription,
      }),
    })
    // axios.post("http://localhost:5000/", JSON.stringify({
    //   text: transcription,
    // }), {
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    .then(res => res.json())
    .then(res => {
      let tmp = {};
      tmp[requestId] = res;
      tmp[requestId] = {
        ...tmp[requestId],
        transcribeConfidenceLevel: transcribeConfidenceLevel
      }
      setAutoClassifyData({
        ...autoClassifyData,
        ...tmp,
      })
      setLoading(prev => {
        tmp = prev;
        delete tmp[requestId];
        return tmp;
      });
      setReadyForReview(prev => {
        let temp = {};
        temp[requestId] = true;
        return {
          ...prev,
          ...temp,
        };
      });
    })
    .catch(err => {
      console.log(err);
    })
  }

  function getBarChartBorderColor(id) {
    let validProb = parseFloat(autoClassifyData[id][CLASSIFICATION.VALID]);
    let invalidOthersProb = parseFloat(autoClassifyData[id][CLASSIFICATION.INVALID_OTHERS]);
    let invalidHarassmentProb = parseFloat(autoClassifyData[id][CLASSIFICATION.INVALID_HARASSMENT]);
    if (validProb > invalidOthersProb && validProb > invalidHarassmentProb) {
      return '#6cac57';
    }

    if (invalidOthersProb > validProb && invalidOthersProb > invalidHarassmentProb) {
      return '#e6a800';
    }

    if (invalidHarassmentProb > validProb && invalidHarassmentProb > invalidOthersProb) {
      return '#eb5980';
    }
  }

  return (
    <>
      <Navbar
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <div id="audio-div">
        {
          travelGuideRequests.length === 0 ?
          <div className="nothing">
            <h3>No Travel Guide Requests</h3>
          </div> : travelGuideRequests.map(request => (
              <div id={request._id} className="audio-single" style={{display: "flex"}}>
                <div style={{width: "40%", height: 'auto', float: "left", justifyContent: 'left', alignItems: 'center', display: 'flex'}}>
                  <img src={request.imageUrl} style={{width: '100%', height: '200px', borderRadius: '5%', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'}}/>
                </div>
                <div style={{width: "50%", float: "left", alignContent: 'left', paddingLeft: '10px', marginLeft: '10px', boxShadow: 'rgba(0, 0, 0, 0.24) 0 0 7px', borderRadius: '2%'}}>
                  <div className="audio title">
                    <h3>{request.name}</h3>
                  </div>
                  <div className="audio description">
                    <p>{request.description}</p>
                  </div>
                  <div className="audio" style={{padding: '0', backgroundColor: 'white'}}>
                    <audio controls id="audio" onPlay={() => {
                      setReadyForReview(prev => {
                        let tmp = {};
                        tmp[request._id] = true;
                        return {
                          ...prev,
                          ...tmp,
                        }
                      });
                    }}>
                      <source src={request.audioUrl} type="audio/mpeg"/>
                    </audio>
                  </div>
                  {currentPage === TG_STATUS.PENDING ? <div className="audio buttons" style={{textAlign:'left', justifyContent:'left'}}>
                    {request._id in loading ? 
                      <CircleLoader
                      color={color}
                      loading={loading}
                      cssOverride={override}
                      size={50}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    /> : 
                    <>
                    {autoClassifyData[request._id] ? <>
                    <br/>
                    <p>Google Audio Transcribe Confidence Level: <b>{autoClassifyData[request._id].transcribeConfidenceLevel.toFixed(2)}</b></p>
                    <br/>
                    <p>AI Confidence Level</p>
                    <Bar style={{border:'solid', borderColor: getBarChartBorderColor(request._id), boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', borderRadius: '3%', padding: '5px', width: '100%'}} options={options} data={{
                      labels,
                      datasets: [
                        {
                          data: [
                            parseFloat(autoClassifyData[request._id][CLASSIFICATION.VALID]),
                            parseFloat(autoClassifyData[request._id][CLASSIFICATION.INVALID_OTHERS]),
                            parseFloat(autoClassifyData[request._id][CLASSIFICATION.INVALID_HARASSMENT])
                          ],
                          borderColor: ["#2c733f", "#b88600", "#f20041"],
                          backgroundColor: ['#6cac57', '#e6a800', '#eb5980'],
                        }
                      ]
                    }} /> </> : 
                    <Button 
                      style={{color: '#6cac57', borderColor: '#6cac57', marginTop: '10px', fontFamily: 'lexend'}} variant="outlined"
                      onClick={() => {
                        autoClassify(request._id, request.audioUrl);
                      }}
                    >
                      Auto Classify
                    </Button>
                    }
                    </>
                    }
                  </div> :
                  request.reviewerComment && <div>
                    <br />
                    <p><b>Reviewer Comment</b></p>
                    <p>{`"${request.reviewerComment}"`}</p>
                  </div>
                  }
                  {(currentPage === TG_STATUS.PENDING && readyForReview[request._id]) && <div className="audio" style={{textAlign:'left', justifyContent:'left'}}>
                    <TextField
                      style={{borderColor: 'black'}}
                      id="outlined-multiline-static"
                      label="Comment"
                      multiline
                      rows={4}
                      defaultValue=""
                      onChange={e => {
                        setReviewerComments(prev => {
                          let tmp = {};
                          tmp[request._id] = e.target.value;
                          return {
                            ...prev,
                            ...tmp,
                          };
                        });
                      }}
                    />
                    <div>
                      <Button style={{color: '#6cac57', borderColor: '#6cac57', marginTop: '10px', fontFamily: 'lexend'}} variant='outlined' onClick={() => {
                        makeAction(request._id, true);
                      }}>Approve</Button>
                      <Button style={{color: '#f54284', borderColor: '#ff0f68', marginTop: '10px', marginLeft: '10px', fontFamily: 'lexend'}} variant='outlined' onClick={() => {
                        makeAction(request._id, false);
                      }}>Reject</Button>
                    </div>
                  </div>}
                </div>
              </div>
            ))
        }
      </div>
    </>
  );
}

export default App;
