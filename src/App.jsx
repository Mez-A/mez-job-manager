import { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

import { NavLink, Route, Routes } from "react-router-dom";
import { PageWelcome } from "./pages/PageWelcome";
import { PageJobSources } from "./pages/PageJobSources";
import { PageJobApplications } from "./pages/PageJobApplications";
import { PageCv } from "./pages/PageCv";
import { PageLogin } from "./pages/PageLogin";
import { PageRegister } from "./pages/PageRegister";

// const backend_base_url = import.meta.env.VITE_BACKEND_URL;
const backend_base_url = "http://localhost:9000";

function App() {
    const [jobSources, setJobSources] = useState([]);
    const [currentUser, setCurrentUser] = useState({
        username: 'anonymousUser',
        accessGroups: ['loggedOutUsers']
    });
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const userIsLoggedIn = () => {
        return currentUser.username !== "anonymousUser";
    };

    const currentUserIsInAccessGroups = (accessGroups) => {
        let rb = false;
        accessGroups.forEach((accessGroup) => {
            // console.log(`checking ${accessGroup}`, currentUser.accessGroups);
            // console.log(currentUser.accessGroups.includes(accessGroup));
            if (currentUser.accessGroups.includes(accessGroup)) {
                rb = true;
            }
        });
        return rb
    };

    const getJobSources = async () => {
        setJobSources(
            (await axios.get(backend_base_url + "/job-sources")).data
        );
    };

    useEffect(() => {
        (async () => {
            const response = await fetch(backend_base_url + "/maintain-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("token"),
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
                getJobSources();
            } else {
                const response = await fetch(backend_base_url + "/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: "anonymousUser",
                        password: "anonymous123",
                    }),
                });
                if (response.ok) {
                    const data = await response.json();
                    getJobSources();
                    setCurrentUser(data.user);
                    localStorage.setItem("token", data.token);
                } else {
                    setMessage("Bad Login");
                }
            }
        })();
    }, []);

    const handleLoginButton = async (e) => {
        e.preventDefault();
        const response = await fetch(backend_base_url + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        // setUsername("");
        // setPassword("");
        if (response.ok) {
            const data = await response.json();
            // console.log(data);
            setCurrentUser(data.user);
            getJobSources();
            localStorage.setItem("token", data.token);
        } else {
            setMessage("Bad Login");
        }
    };

    const handleLogoutButton = () => {
        localStorage.removeItem("token");
        setCurrentUser({ username: "anonymousUser", accessGroups:['loggedOutUsers'] });
    };

    return (
        <div className="App">
            <h2>MEZ Job Manager</h2>
            {userIsLoggedIn() && (
                <div className="loggedInfo">
                    {currentUser.firstName} {currentUser.lastName}{" "}
                    <button className="logout" onClick={handleLogoutButton}>
                        Logout
                    </button>
                </div>
            )}

            <nav>
                <NavLink to="/welcome">Welcome</NavLink>

                {currentUserIsInAccessGroups([
                    "jobSeekers",
                    "administrators",
                ]) && <NavLink to="/job-sources">Job Sources</NavLink>}
                
                <NavLink to="/job-applications">Job Applications</NavLink>
                <NavLink to="/cv">CV</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
            </nav>

            <Routes>
                <Route path="/welcome" element={<PageWelcome />} />
                {currentUserIsInAccessGroups([
                    "jobSeekers",
                    "administrators",
                ]) &&<Route
                    path="/job-sources"
                    element={
                        <PageJobSources
                            handleLogoutButton={handleLogoutButton}
                            jobSources={jobSources}
                        />
                    }
                />}
                <Route
                    path="/job-applications"
                    element={<PageJobApplications />}
                />
                <Route path="/cv" element={<PageCv />} />
                <Route
                    path="/login"
                    element={
                        <PageLogin
                            message={message}
                            jobSources={jobSources}
                            userIsLoggedIn={userIsLoggedIn}
                            currentUser={currentUser}
                            currentUserIsInAccessGroups={
                                currentUserIsInAccessGroups
                            }
                            handleLogoutButton={handleLogoutButton}
                            handleLoginButton={handleLoginButton}
                            username={username}
                            password={password}
                            setUsername={setUsername}
                            setPassword={setPassword}
                        />
                    }
                />
                <Route path="/register" element={<PageRegister />} />
            </Routes>
        </div>
    );
}

export default App;
