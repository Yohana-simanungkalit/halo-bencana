// import { GoogleGenAI } from "@google/genai";
import { useEffect, useRef, useState } from "react";
import QuickActions from "./QuickActions";
import Message from "./Message";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function HaloSiaga() {
    // const API_KEY = "AIzaSyCvv-laH6xQN1FRsrrOWlJiwShnu0kgB6U";
    // const genAI = new GoogleGenAI({
    //     apiKey: API_KEY,
    //     apiVersion: "v1alpha"
    // });
    const [messages, setMessages] = useState([
        { role: "bot", text: "Saya Bot HaloSiaga. Saya siap membantu informasi saat bencana." }
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const [showMap, setShowMap] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [locationDenied, setLocationDenied] = useState(false)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => {
                if (err.code === 1) {
                    setLocationDenied(true);
                }
            }
        );
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (textInput) => {
        if (loading) return;
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
                    "Authorization": `Bearer ${process.env.REACT_APP_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Halo Siaga App"
                },
                body: JSON.stringify({
                    model: "nvidia/nemotron-3-super-120b-a12b:free",
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

            const botText =
                data?.choices?.[0]?.message?.content ||
                "Maaf, tidak ada respon dari Halo Siaga.";

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
                <h3>HaloSiaga, Siap membantu anda!</h3>
            </div>

            {showMap && (
                <div className="map-container">
                    <button
                        className="close-map-btn"
                        onClick={() => setShowMap(false)}
                    >
                        ✖
                    </button>
                    <MapContainer
                        center={userLocation || [-6.2, 106.8]}
                        zoom={13}
                        style={{ height: "200px", borderRadius: "15px", margin: "10px" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>📍 Lokasi Anda</Popup>
                            </Marker>
                        )}

                    </MapContainer>
                    {locationDenied && (
                        <div className="map-overlay">
                            <div className="map-popup">
                                <button
                                    className="close-btn"
                                    onClick={() => setLocationDenied(false)}
                                >
                                    ✖
                                </button>
                                <h4>Lokasi Tidak Diizinkan</h4>
                                <p>Aktifkan lokasi untuk melihat posisi Anda.</p>
                            </div>
                        </div>
                    )}

                </div>
            )}

            {!showMap && <button
                className="map-btn"
                onClick={() => {
                    setShowMap(true);
                }}
            >
                🗺️ Lihat Lokasi Saya
            </button>}
            <QuickActions sendMessage={sendMessage} />
            <div className="chat-box">

                {messages.map((msg, index) => (
                    <Message key={index} role={msg.role} text={msg.text} />
                ))}

                {loading && (
                    <div className="typing">
                        <span></span><span></span><span></span>
                    </div>
                )}

            </div>

            <div className="input-area">

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya tentang bencana..."
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />

                <button onClick={() => sendMessage()} disabled={loading}>
                    {loading ? "Mengetik..." : "Kirim"}
                </button>

            </div>
        </div >
    );
}