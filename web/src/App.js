import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://localhost:5001"; // Update with your backend URL

function StoryCard({ story }) {
  return (
    <div className="card">
      <h2>{story.title}</h2>
      <p>{story.body}</p>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    getAllStories();
  }, []);

  const getAllStories = async () => {
    try {
      setIsLoading(true);
      const resp = await axios.get(`${baseUrl}/api/v1/stories`);
      setData(resp.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const postStory = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${baseUrl}/api/v1/story`, {
        title: event.target.title.value,
        body: event.target.body.value,
      });
      setAlert(response?.data?.message);
      event.target.reset();
      getAllStories(); // Refresh the list of stories after posting
    } catch (e) {
      console.error("Error posting story:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/v1/search?query=${searchQuery}`
      );
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Social Stories</h1>

      <form onSubmit={postStory}>
        <label htmlFor="title">Title: </label>
        <input type="text" id="title" required />
        <br />
        <label htmlFor="body">What's on your mind: </label>
        <textarea id="body" required></textarea>
        <br />
        <button type="submit">hidden search</button>
      </form>

      {alert && <div className="alert">{alert}</div>}

      <br />
      <hr />
      <br />

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search Stories"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="card-container">
        {searchResults.length > 0
          ? searchResults.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))
          : data.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
      </div>
    </div>
  );
}

export default App;
