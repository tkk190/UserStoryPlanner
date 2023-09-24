import {StoryPointButton, StoryPointWrapper} from "./DetailBox.styles";
import {useEffect, useState} from "react";
import {Story} from "../../models/project";
import {useChangeStoryMutation} from "../../slices/apiSlice";
import {useAppSelector} from "../../app/hooks";

interface Props{
    story: Story
}

const storyPointList = [0, 1, 2, 3, 5, 8, 13, 21, 50, 99]

export default function StoryPoints(props:Props){
    const story = props.story
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const project = useAppSelector((state) => state.project.project)

    const [currentStoryPoint, setCurrentStoryPoint] = useState(story.storyPoints)

    const [changeStory, changeStoryResult] = useChangeStoryMutation()

    useEffect(()=>{
        setCurrentStoryPoint(story.storyPoints)
    }, [story])

    const handleCurrentStoryPoint = (value: number) =>{
        setCurrentStoryPoint(value)
        changeStory({id: story.id, storyPoints: value, projectId: project.id})
    }


    return(
        <StoryPointWrapper>
            {
                storyPointList.map(storyPoint =>
                    <StoryPointButton
                        key={storyPoint}
                        onClick={() => readwrite === 'write' && handleCurrentStoryPoint(storyPoint)}
                        $checked={currentStoryPoint === storyPoint}
                        $disabled={readwrite !== 'write'}
                    >
                        {storyPoint === 0 ? '' : storyPoint}
                    </StoryPointButton>)
            }
        </StoryPointWrapper>

    )
}