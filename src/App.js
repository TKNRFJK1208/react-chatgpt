import { useState, useEffect } from 'react';

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setMessage(null);
    setValue('');
    setCurrentTitle(uniqueTitle);
  };

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const response = await fetch(
        'https://bucolic-buttercream-5b6bbb.netlify.app//completions',
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: 'user',
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle, value]);

  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );

  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChat) => previousChat.title))
  );
  console.log(uniqueTitles);

  return (
    <div className="app">
      <section className="side-bar">
        <button onCLick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              <p>{uniqueTitle}</p>
            </li>
          ))}
          <nav>
            <p>Made by Taka</p>
          </nav>
        </ul>
      </section>
      <section className="main">
        {!currentTitle && <h1>TAKA GPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              SUBMIT
            </div>
          </div>
          <p className="info">Chat GPT by Taka</p>
        </div>
      </section>
    </div>
  );
};

export default App;
