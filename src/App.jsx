import { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function App() {
    const [jobSources, setJobSources] = useState([]);

    useEffect(() => {
        (async () => {
            setJobSources((await axios.get(backendUrl)).data);
        })();
    }, []);

    return (
        <div className="App">
            <h2>MEZ Job Manager</h2>
            <p>There are {jobSources.length} job sources.</p>
            <ul>
              {jobSources.map((jobSource, i) => {
              return (
                <li key={i}>{jobSource.name}</li>
              )
            })}
            </ul>
            
        </div>
    );
}

export default App;
