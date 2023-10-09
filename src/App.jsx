import moment from "moment/moment";
import "moment/locale/vi";
import focus from "/focus.png";
import { useLayoutEffect, useMemo, useState } from "react";

const App = () => {
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(0);
  const [input, setInput] = useState("");
  const [time, setTime] = useState("");
  const [messages, setMessages] = useState([]);

  const formattedMessages = useMemo(() => {
    return messages.reduce((output, current) => {
      const date = current.timestamp.split(", ")[0];
      if (!Object.keys(output).includes(date)) output[date] = [current];
      else output[date].push(current);
      return output;
    }, {});
  }, [messages]);

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

  useLayoutEffect(() => {
    const localData = localStorage.getItem("focus-time");
    if (localData) {
      const localTime = JSON.parse(localData);
      setTime(localTime);
    }
    localStorage.setItem("focus-time", JSON.stringify(new Date().toLocaleString()));
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

  const handleKeyboard = (event) => {
    const { ctrlKey, code } = event;
    if (ctrlKey && code === "Enter") handleSubmit(event);
  };

  const handleRemove = (targetMessage) => {
    const newMessages = messages.filter(
      (message) => message.timestamp !== targetMessage.timestamp && message.context !== targetMessage.content
    );
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
      <div className="md:text-4xl uppercase font-bold flex flex-col gap-2 items-center text-center">
        <div>
          Mày đã sao nhãng lần<span className="text-red-400"> thứ {count}</span>
        </div>
        {time && (
          <div>
            Lần gần nhất là khoảng<span className="text-blue-400"> {moment(time).fromNow()}</span>
          </div>
        )}
        <div className="text-orange-400 text-2xl md:text-6xl">Tập trung lại nào!</div>
      </div>
      <div
        className="group w-40 overflow-hidden rounded-2xl"
        onClick={handleClick}
        onMouseLeave={() => setClick(0)}
        title="Nhấn 7 lần vào đây để xoá lịch sử cho đỡ nhục nè!"
      >
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
          Lưu
        </button>
        <textarea
          className="placeholder:text-white/50 bg-transparent resize-none w-full outline-none"
          type="text"
          rows={5}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyboard}
          placeholder="Viết lời giải thích tại sao mày lại bị sao nhãng hay những công việc mà mày cần phải hoàn thành nhưng vì lười quá nên chưa làm vào đây... Nhấn Ctrl + Enter để lưu cho lần sau vô còn có cái đọc lại!"
        />
      </form>
      {messages.length > 0 && (
        <div className="w-full flex flex-col gap-4">
          <div className="font-bold text-2xl">
            Lý do của những lần trước mày viết ở bên dưới nè! Đọc lại và tập trung hoàn thành công việc đi! Mày đã viết
            được {messages.length} cái rồi!
          </div>
          <div className="flex flex-col gap-4">
            {Object.keys(formattedMessages).map((group, index) => (
              <div key={index}>
                <p className="first-letter:uppercase text-[10px] italic text-white/50 mb-1">
                  {moment(group).format("dddd, [ngày] Do MMMM [năm] YYYY")}
                </p>
                <div className="flex flex-col gap-2">
                  {formattedMessages[group].map((message, index) => (
                    <div key={index} className="group overflow-hidden p-8 bg-white/5 rounded-2xl relative">
                      <div className="text-[10px] font-bold absolute top-0 left-0 bg-white/5 px-4 py-1 rounded-br-2xl">
                        {moment(message.timestamp).format("hh:mm")} {message.timestamp.split(" ")[2]}
                      </div>
                      <div
                        onClick={() => handleRemove(message)}
                        className="group-hover:visible invisible hover:cursor-pointer hover:bg-white/10 text-[10px] font-bold absolute top-0 right-0 bg-white/5 px-4 py-1 rounded-bl-2xl"
                      >
                        x
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: message.content }}></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
