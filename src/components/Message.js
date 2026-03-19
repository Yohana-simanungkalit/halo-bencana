import { BsRobot } from "react-icons/bs";
import { RiUserHeartLine } from "react-icons/ri";

export default function Message({ role, text }) {
    return (
        <div className={`msg-row ${role}`}>

            {role === "bot" && (
                <div className="avatar bot"><BsRobot size={"25px"}/></div>
            )}

            <div className="msg-bubble">
                {text}
            </div>

            {role === "user" && (
                <div className="avatar user"><RiUserHeartLine size={"25px"}/></div>
            )}

        </div>
    );
}