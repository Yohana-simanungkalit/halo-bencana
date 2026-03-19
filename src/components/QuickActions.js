export default function QuickActions({ sendMessage }) {
      const actions = [
        { text: "Banjir", icon: "🌊" },
        { text: "Gempa Bumi", icon: "🌍" },
        { text: "Tanah Longsor", icon: "⛰️" },
        { text: "Tsunami", icon: "🌊" }
    ];

    return (
        <div className="quick-actions">
            {actions.map((action, index) => (
                <button
                    key={index}
                    onClick={() => sendMessage(`Apa yang harus dilakukan saat ${action.text}?`)}
                    className="quick-btn"
                >
                    <span className="icon">{action.icon}</span>
                    {action.text}
                </button>
            ))}
        </div>
    );
}