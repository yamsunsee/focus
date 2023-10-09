import focus from "/focus.png";
import { useLayoutEffect, useState } from "react";

const App = () => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const localData = localStorage.getItem("focus-count");

    if (localData) {
      const distraction = Number.parseInt(JSON.parse(localData));
      const newDistraction = distraction + 1;
      setCount(newDistraction);
      localStorage.setItem("focus-count", JSON.stringify(newDistraction));
    } else {
      localStorage.setItem("focus-count", JSON.stringify(1));
    }
  }, []);

  useLayoutEffect(() => {
    const localData = localStorage.getItem("focus-messages");
    if (localData) {
      const localMessages = JSON.parse(localData);
      setMessages(localMessages);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (input.trim().length > 0) {
      const newMessage = {
        timestamp: new Date().toLocaleString(),
        content: input.replace(/\n/g, "<br>"),
      };
      const newMessages = [newMessage, ...messages];
      setMessages(newMessages);
      localStorage.setItem("focus-messages", JSON.stringify(newMessages));
    }
    setInput("");
  };

  const handleRemove = (timestamp) => {
    const newMessages = messages.filter((message) => message.timestamp !== timestamp);
    setMessages(newMessages);
    localStorage.setItem("focus-messages", JSON.stringify(newMessages));
  };

  const handleClick = () => {
    if (click > 5) {
      localStorage.clear();
      location.reload();
      setClick(0);
    } else {
      setClick(click + 1);
    }
  };

  return (
    <main className="p-8 min-h-screen bg-black text-white flex flex-col gap-8 items-center">
      <div className="text-4xl uppercase font-bold flex flex-col gap-2 items-center">
        <div>
          Mày đã xao nhãng lần<span className="text-blue-400"> thứ {count}</span>
        </div>
        <div className="text-red-400">Tập trung lại nào!</div>
      </div>
      <div className="group w-40 overflow-hidden rounded-2xl" onClick={handleClick} onMouseLeave={() => setClick(0)}>
        <img
          className="group-hover:scale-110 group-hover:saturate-150 saturate-100 transition-all cursor-pointer"
          width={160}
          height={160}
          loading="lazy"
          src={focus}
          alt="focus"
        />
      </div>
      <form onSubmit={handleSubmit} className="group w-full relative overflow-hidden rounded-2xl bg-white/5 p-8">
        <button className="group-hover:visible invisible absolute bg-white/5 right-0 bottom-0 rounded-tl-2xl uppercase px-8 py-4 font-bold hover:cursor-pointer hover:bg-white/10">
          Submit
        </button>
        <textarea
          className="placeholder:text-white/50 bg-transparent resize-none w-full outline-none"
          type="text"
          rows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Viết những ý định mày muốn làm vào đây..."
        />
      </form>
      {messages.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <div className="font-bold text-2xl">
            Những ý định lúc trước mày muốn làm ở bên dưới nè! Mày đã viết {messages.length} cái rồi!
          </div>
          <div className="flex flex-col gap-2">
            {messages.map((message, index) => (
              <div key={index} className="group overflow-hidden p-8 bg-white/5 rounded-2xl relative">
                <div className="text-[10px] font-bold absolute top-0 left-0 bg-white/5 px-4 py-1 rounded-br-2xl">
                  {message.timestamp}
                </div>
                <div
                  onClick={() => handleRemove(message.timestamp)}
                  className="group-hover:visible invisible hover:cursor-pointer hover:bg-white/10 text-[10px] font-bold absolute top-0 right-0 bg-white/5 px-4 py-1 rounded-bl-2xl"
                >
                  x
                </div>
                <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
