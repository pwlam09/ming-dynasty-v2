import buttonBackImg from "../../assets/controls/button_back.png"
import buttonBackPressedImg from "../../assets/controls/button_back_pressed.png"
import buttonExitImg from "../../assets/controls/button_exit.png"
import buttonExitPressedImg from "../../assets/controls/button_exit_pressed.png"

export const Settings = (props) => {
    return (
        <div className="settings-wrapper">
            <div className="settings">
                <img 
                    onMouseDown={(e) => e.target.src = buttonExitPressedImg}
                    onMouseUp={(e) => {
                        e.target.src = buttonExitImg
                        props.onMouseUpExit()
                    }}
                    src={buttonExitImg} 
                />
                <img 
                    onMouseDown={(e) => e.target.src = buttonBackPressedImg}
                    onMouseUp={(e) => {
                        e.target.src = buttonBackImg
                        props.onMouseUpBack()
                    }}
                    src={buttonBackImg} 
                />
            </div>
        </div>
    )
}