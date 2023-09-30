import {TextFieldWrapper} from "./DetailBox.styles";
import TextField from "./TextField";
import React from "react";
import {useGetReleaseNotesQuery} from "../../slices/apiSlice";
import {Release} from "../../models/project";

interface Props{
    release: Release
}

function Wrapper(props:{children:React.ReactNode}){
    return <TextFieldWrapper $childCount={React.Children.count(props.children)}>{props.children}</TextFieldWrapper>
}

export default function ReleaseTextFields(props:Props){
    const release = props.release
    const  {data} = useGetReleaseNotesQuery(release.id)

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