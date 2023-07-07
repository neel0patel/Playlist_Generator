import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./home";
import Loading from "./loading";
import spotifyRecommender from "./spotifyRecommender";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    axios.get("/auth/current-session").then(({ data }) => {
      setAuth(data);
    });
  }, []);

  if (auth === null) {
    return <Loading />;
  }
  if (auth) {
    return <spotifyRecommender auth={auth} />;
  }
  return <Home />;
}

export default App;
