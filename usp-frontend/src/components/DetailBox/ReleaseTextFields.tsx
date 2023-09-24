import {TextFieldWrapper} from "./DetailBox.styles";
import TextField from "./TextField";
import {setDefinitionOfDone, setDefinitionOfReady, setDescription, setReleaseText} from "../../slices/detailsSlice";
import React, {useEffect, useState} from "react";
import {useChangeStoryMutation, useGetReleaseNotesQuery} from "../../slices/apiSlice";
import {Release, Story} from "../../models/project";
import {useAppDispatch} from "../../app/hooks";

interface Props{
    release: Release
}

function Wrapper(props:{children:React.ReactNode}){
    return <TextFieldWrapper $childCount={React.Children.count(props.children)}>{props.children}</TextFieldWrapper>
}

export default function ReleaseTextFields(props:Props){
    const release = props.release
    const dispatch = useAppDispatch()

    const  {data} = useGetReleaseNotesQuery(release.id)




    const [pressedKeys, setPressedKeys] = useState<string[]>([])

    const [changeStory, changeStoryResult] = useChangeStoryMutation()


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



    return(
        <Wrapper>
            <TextField
                marker={'releaseNotes'}
                currentValue={!!data ? data : ''}
                setCurrentValue={(value:string)=>{}}
                placeholder={'Release Notes'}
                openedTextarea={''}
                setOpenedTextarea={()=>{}}
                handleKeyDown={()=>{}}
                handleKeyUp={()=>{}}
            />
        </Wrapper>
    )
}