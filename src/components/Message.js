export default function Message(props) {
    const { role, text } = props;
    return (
        <div className={`msg ${role}`}>
            <div className="bubble">
                {text.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        </div>
    )
}