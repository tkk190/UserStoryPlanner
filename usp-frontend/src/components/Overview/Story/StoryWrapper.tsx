import {StoryWrapperStyled, StoryPlaceholder} from "../Overview.styles"
import {useDrop} from "react-dnd";
import {ItemTypes} from "../Overview";
import { useChangeStoryMutation } from "../../../slices/apiSlice";
import {Story as StoryInterface} from "../../../models/project";
import Story from "./Story";
import {createRandomId} from "../../../utils/utils";
import NewItem from "../NewItem/NewItem";
import {Plus} from "react-feather";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {addEmptyStoryToStep} from "../../../slices/projectSlice";
import {unsetDetails} from "../../../slices/detailsSlice";


interface Props{
    releaseId: number
    stepId: number
    activityId: number
    stories: StoryInterface[]
    lastStep: boolean
    notPlanned: boolean

}

export default function StoryWrapper(props:Props){
    const dispatch = useAppDispatch()
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const currentProject = useAppSelector((state) => state.project.project)
    const releaseId = props.releaseId
    const stepId = props.stepId
    const stories = props.stories

    const [changeStory, changeStoryResult] = useChangeStoryMutation()

    const changePosition = (story:StoryInterface) =>{
        if (story.stepId !== stepId || story.releaseId !== releaseId) {
            changeStory({...story, releaseId, stepId, projectId: currentProject.id})
        }
    }

    const [{ isOver }, drop] = useDrop(
      () => ({
          accept: ItemTypes.STORY,
          drop: (story:StoryInterface) => changePosition(story),
          collect: (monitor) => ({
              isOver: monitor.isOver()
          })
      }),
      []
    )

    const addStory = () => {
        dispatch(unsetDetails())
        const newStory: StoryInterface = {
            id: createRandomId(),
            name: '',
            releaseId: props.releaseId,
            stepId: props.stepId,
            position: 'zzz',
            status: "",
            storyPoints: 0,
            description: '',
            definitionOfDone: '',
            definitionOfReady: '',
            releaseText: ''
        }
        dispatch(addEmptyStoryToStep({story: newStory, activityId: props.activityId}))
    }

    return(
        <StoryWrapperStyled ref={drop} $isOver={isOver} $lastStep={props.lastStep}>
            {stories.map(story=>
                story.name.length > 0
                    ?
                    <Story
                        key={story.id}
                        story={{...story, stepId: props.stepId, releaseId: props.releaseId}}
                        dropRef={drop}
                        stepId={props.stepId}
                        releaseId={props.releaseId}
                        activityId={props.activityId}
                    />
                    :
                    <NewItem
                        key={story.id}
                        itemId={story.id}
                        itemType={'story'}
                        stepId={props.stepId}
                        releaseId={props.releaseId}
                        activityId={props.activityId}
                    />
            )}
            {
                readwrite === 'write' &&
                <StoryPlaceholder
                    $small={(stories.length > 0 || props.notPlanned)}
                    onClick={addStory}
                ><Plus /></StoryPlaceholder>
            }
        </StoryWrapperStyled>
    )
}