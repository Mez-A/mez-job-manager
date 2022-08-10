
export const PageLogin = ({message, jobSources, userIsLoggedIn, currentUser, currentUserIsInAccessGroup, handleLogoutButton, handleLoginButton, username, password, setUsername, setPassword}) => {
    return (
        <>
            <p>This is the Login page.</p>
            <div className="loggedInfo">
                {userIsLoggedIn() && (
                    <div>
                        Logged in: {currentUser.firstName}{" "}
                        {currentUser.lastName}
                    </div>
                )}
            </div>

            <div className="info">
                {currentUserIsInAccessGroup("administrators") && (
                    <div>Info for administrators</div>
                )}
                {currentUserIsInAccessGroup("jobSeekers") && (
                    <div>new job infos for job seekers </div>
                )}
            </div>

            {userIsLoggedIn() ? (
                <>
                    <p>There are {jobSources.length} job sources.</p>
                    <ul>
                        {jobSources.map((jobSource, i) => {
                            return <li key={i}>{jobSource.name}</li>;
                        })}
                    </ul>
                    <button className="logout" onClick={handleLogoutButton}>
                        Logout
                    </button>
                </>
            ) : (
                <form className="login">
                    <div className="row">
                        username:
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </div>
                    <div className="row">
                        password:
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            autoComplete="off"
                        />
                    </div>
                    <div className="row">
                        <button type="button" onClick={handleLoginButton}>
                            Login
                        </button>
                    </div>
                    <div className="row">{message}</div>
                </form>
            )}
        </>
    );
};