import {TextFieldWrapper} from "./DetailBox.styles";
import TextField from "./TextField";
import {setDefinitionOfDone, setDefinitionOfReady, setDescription, setReleaseText} from "../../slices/detailsSlice";
import React, {useEffect, useState} from "react";
import {useChangeStoryMutation} from "../../slices/apiSlice";
import {Story} from "../../models/project";
import {useAppDispatch, useAppSelector} from "../../app/hooks";

interface Props{
    story: Story
}

function Wrapper(props:{children:React.ReactNode}){
    return <TextFieldWrapper $childCount={React.Children.count(props.children)}>{props.children}</TextFieldWrapper>
}

export default function StoryTextFields(props:Props){
    const story = props.story
    const dispatch = useAppDispatch()
    const currentProject = useAppSelector((state) => state.project.project)

    const [currentDescription, setCurrentDescription] = useState(story.description)
    const [currentDefinitionOfReady, setCurrentDefinitionOfReady] = useState(story.definitionOfReady)
    const [currentDefinitionOfDone, setCurrentDefinitionOfDone] = useState(story.definitionOfDone)
    const [currentReleaseText, setCurrentReleaseText] = useState(story.releaseText)

    const [openedTextarea, setOpenedTextarea] = useState('')




    const [pressedKeys, setPressedKeys] = useState<string[]>([])

    const [changeStory, changeStoryResult] = useChangeStoryMutation()


    useEffect(()=>{
        setCurrentDescription(story.description)
        setCurrentReleaseText(story.releaseText)
        setCurrentDefinitionOfReady(story.definitionOfReady)
        setCurrentDefinitionOfDone(story.definitionOfDone)
    }, [story])

    const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Control' || e.key === 'Enter'){
            setPressedKeys(pressedKeys => [...pressedKeys, e.key])
        }
    }
    const handleKeyUp = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Control' || e.key === 'Enter'){
            setPressedKeys(pressedKeys => [...pressedKeys.splice(pressedKeys.indexOf(e.key))])
        }
    }

    useEffect(()=>{
        if (pressedKeys.includes('Enter') && pressedKeys.includes('Control')){
            setOpenedTextarea('')
        }
    }, [pressedKeys])


    useEffect(()=>{
        if (openedTextarea === ''){
            changeStory({
                id: story.id,
                description: currentDescription,
                definitionOfDone: currentDefinitionOfDone,
                definitionOfReady: currentDefinitionOfReady,
                releaseText: currentReleaseText,
                projectId: currentProject.id
            })
        }
    }, [openedTextarea])


    return(
        <Wrapper>
            <TextField
                marker={'description'}
                currentValue={currentDescription}
                setCurrentValue={(value:string)=>dispatch(setDescription(value))}
                placeholder={'Description'}
                openedTextarea={openedTextarea}
                setOpenedTextarea={setOpenedTextarea}
                handleKeyDown={handleKeyDown}
                handleKeyUp={handleKeyUp}
            />
            <TextField
                marker={'releaseText'}
                currentValue={currentReleaseText}
                setCurrentValue={(value:string)=>dispatch(setReleaseText(value))}
                placeholder={'Release Text (optional)'}
                openedTextarea={openedTextarea}
                setOpenedTextarea={setOpenedTextarea}
                handleKeyDown={handleKeyDown}
                handleKeyUp={handleKeyUp}
            />
            <TextField
                marker={'definitionOfDone'}
                currentValue={currentDefinitionOfDone}
                setCurrentValue={(value:string)=>dispatch(setDefinitionOfDone(value))}
                placeholder={'Definition of Done'}
                openedTextarea={openedTextarea}
                setOpenedTextarea={setOpenedTextarea}
                handleKeyDown={handleKeyDown}
                handleKeyUp={handleKeyUp}
            />
            <TextField
                marker={'definitionOfReady'}
                currentValue={currentDefinitionOfReady}
                setCurrentValue={(value:string)=>dispatch(setDefinitionOfReady(value))}
                placeholder={'Definition of Ready'}
                openedTextarea={openedTextarea}
                setOpenedTextarea={setOpenedTextarea}
                handleKeyDown={handleKeyDown}
                handleKeyUp={handleKeyUp}
            />
        </Wrapper>
    )
}