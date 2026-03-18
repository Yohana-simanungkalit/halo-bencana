// import { GoogleGenAI } from "@google/genai";
import { useEffect, useRef, useState } from "react";
import QuickActions from "./QuickActions";
import Message from "./Message";

export default function HaloSiaga() {
    // const API_KEY = "AIzaSyCvv-laH6xQN1FRsrrOWlJiwShnu0kgB6U";
    // const genAI = new GoogleGenAI({
    //     apiKey: API_KEY,
    //     apiVersion: "v1alpha"
    // });
    const [messages, setMessages] = useState([
        { role: "bot", text: "Halo! Saya SiagaAI. Saya siap membantu informasi saat bencana." }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (textInput) => {
        const message = textInput || input;
        if (!message) return;

        const userMsg = { role: "user", text: message };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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", //
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000", // WAJIB
                    "X-Title": "SiagaAI App" // WAJIB
                },
                body: JSON.stringify({
                    model: "openrouter/auto",
                    messages: [
                        {
                            role: "system",
                            content: `Kamu adalah AI kesiapsiagaan bencana di Indonesia.
                                        Jawab dengan:
                                        1. Penjelasan singkat
                                        2. Langkah yang harus dilakukan
                                        3. Hal yang harus dihindari`
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            });

            const data = await res.json();

            console.log("DEBUG response:", data);

            const botText =
                data?.choices?.[0]?.message?.content ||
                "Maaf, tidak ada respon dari AI.";

            setMessages(prev => [...prev, { role: "bot", text: botText }]);

        } catch (error) {
            console.error(error);

            setMessages(prev => [
                ...prev,
                { role: "bot", text: "Maaf terjadi kesalahan." }
            ]);
        }

        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="container">

              <div className="header">
                <h2>🚨 SiagaAI</h2>
                <p>Asisten kesiapsiagaan bencana</p>
            </div>

            <QuickActions sendMessage={sendMessage} />

            <div className="chat-box">

                {messages.map((msg, index) => (
                    <Message key={index} role={msg.role} text={msg.text} />
                ))}

                {loading && <p className="loading">AI sedang mengetik...</p>}

            </div>

            <div className="input-area">

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya tentang bencana..."
                />

                <button onClick={() => sendMessage()}>
                    Kirim
                </button>

            </div>

        </div>
    );
}