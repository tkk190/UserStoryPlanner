import {Textarea, TextFieldStyled} from "./DetailBox.styles";
import Markdown from "marked-react";
import {KeyboardEventHandler} from "react";
import {useAppSelector} from "../../app/hooks";

interface Props{
    marker: string
    openedTextarea: string
    setOpenedTextarea: Function
    currentValue: string
    setCurrentValue: Function
    handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement>
    handleKeyUp: KeyboardEventHandler<HTMLTextAreaElement>
    placeholder: string
    height?: string
}

export default function TextField(props:Props){
    const openedTextarea = props.openedTextarea
    const marker = props.marker
    const readwrite = useAppSelector((state) => state.login.readwrite)

    return(
        <TextFieldStyled
            $opened={openedTextarea === marker}
            onDoubleClick={()=> readwrite === 'write' && props.setOpenedTextarea(openedTextarea === marker ? '' : marker)}
            $height={props.height}
        >
            <b>{props.placeholder}:</b>
            {
                openedTextarea === marker &&
                    <Textarea
                        onChange={(e) => props.setCurrentValue(e.target.value)}
                        onKeyDown={props.handleKeyDown}
                        onKeyUp={props.handleKeyUp}
                        placeholder={props.placeholder}
                        defaultValue={props.currentValue}
                    />
            }
            <Markdown>{props.currentValue}</Markdown>
        </TextFieldStyled>
    )
}