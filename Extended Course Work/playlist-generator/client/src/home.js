import React from "react";
import "./App.css";

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <p>You are not logged into Spotify</p>
        <a className="App-link" href={"/auth/login"}>
          Login here!
        </a>
      </header>
    </div>
  );
}

export default Home;
