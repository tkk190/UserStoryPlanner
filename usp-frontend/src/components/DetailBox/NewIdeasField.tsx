import React, {useEffect, useState} from "react";
import {Textarea, TextFieldStyled} from "./DetailBox.styles";
import Markdown from "marked-react";
import {useAppSelector} from "../../app/hooks";
import {useAddActivityIdeasMutation, useAddProjectIdeasMutation, useAddStepIdeasMutation} from "../../slices/apiSlice";

interface Props {
    type: 'project' | 'activity' | 'step'
    currentIdeas: string
    currentId: number
}

export default function NewIdeasField(props:Props){
    const [pressedKeys, setPressedKeys] = useState<string[]>([])
    const [openedTextarea, setOpenedTextarea] = useState(false)
    const [currentValue, setCurrentValue] = useState(props.currentIdeas)

    const readwrite = useAppSelector((state) => state.login.readwrite)
    const currentProject = useAppSelector((state) => state.project.project)

    const [addProjectIdeas] = useAddProjectIdeasMutation()
    const [addActivityIdeas] = useAddActivityIdeasMutation()
    const [addStepIdeas] = useAddStepIdeasMutation()


    const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Control' || e.key === 'Enter'){
            setPressedKeys(pressedKeys => [...pressedKeys, e.key])
        }
    }
    const handleKeyUp = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Control' || e.key === 'Enter'){
            setPressedKeys(pressedKeys.filter(key => key !== e.key))
        }
    }

    useEffect(()=>{
        if (pressedKeys.includes('Enter') && pressedKeys.includes('Control')){
            setOpenedTextarea(false)
            setPressedKeys([])
        }
    }, [pressedKeys])

    useEffect(()=>{
        if (!openedTextarea){
            const data = {projectId: currentProject.id, id: props.currentId, content: currentValue}
            if (props.type === 'project'){
                addProjectIdeas(data)
            } else if (props.type === 'activity'){
                addActivityIdeas(data)
            } else if (props.type === 'step') {
                addStepIdeas(data)
            }
        }
    }, [openedTextarea])

    return(
        <TextFieldStyled
            $opened={openedTextarea}
            onDoubleClick={()=> readwrite === 'write' && setOpenedTextarea(!openedTextarea)}
        >
            <b>Ideen:</b>
            {
                openedTextarea &&
                    <Textarea
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        placeholder={"Ideen"}
                        defaultValue={currentValue}
                    />
            }
            <Markdown>{currentValue}</Markdown>
        </TextFieldStyled>
    )
}