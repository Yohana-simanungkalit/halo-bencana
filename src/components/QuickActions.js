export default function QuickActions({ sendMessage }) {
    const actions = [
        "Gempa bumi",
        "Banjir",
        "Tsunami",
        "Gunung meletus"
    ];

    return (
        <div className="quick-actions">
            {actions.map((action, index) => (
                <button key={index} onClick={() => sendMessage(action)}>
                    ⚡ {action}
                </button>
            ))}
        </div>
    );
}