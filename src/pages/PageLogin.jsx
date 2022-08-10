import {PageJobSources} from './PageJobSources'

export const PageLogin = ({message, jobSources, userIsLoggedIn, currentUser, currentUserIsInAccessGroup, handleLogoutButton, handleLoginButton, username, password, setUsername, setPassword}) => {
    return (
        <>
            <p>This is the Login page.</p>
            
            {!userIsLoggedIn() && (
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