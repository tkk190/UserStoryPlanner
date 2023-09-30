import {StoryPointsActive, StoryPointsDone, StoryStatusLine, StoryStyled} from "../Overview.styles";
import {Story as StoryInterface} from "../../../models/project"
import {ConnectDropTarget, useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../Overview";
import {useMemo, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {switchPositionOfStory} from "../../../slices/projectSlice";
import {useSwitchStoryPositionMutation} from "../../../slices/apiSlice";
import {setStory} from "../../../slices/detailsSlice";

interface Props {
    story: StoryInterface
    dropRef:  ConnectDropTarget
    stepId: number
    releaseId: number
    activityId: number
}

export default function Story(props:Props){
    let story = props.story
    const ref = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const project = useAppSelector((state) => state.project.project!)
    const storyInDetails = useAppSelector((state) => state.details.story)
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const stepStories = useMemo(() => {
        return project.activities?.find(activity => activity.id === props.activityId)?.steps?.find(step => step.id === props.stepId)?.stories?.filter(story => !!story.release && story.release?.id === props.releaseId)
    }, [project.activities, props.activityId, props.releaseId, props.stepId])
    const [switchStoryPosition, switchStoryPositionResult] = useSwitchStoryPositionMutation()

    const handleStoryClick = () =>{
        dispatch(setStory(story))
    }


    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.STORY,
        canDrag: readwrite === 'write',
        item: ()=> story,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [story, readwrite])

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.STORY,
        drop: (item:StoryInterface) => switchStoryPosition(stepStories!.map(story => ({id: story.id, position: story.position}))),
        collect: (monitor) => ({
          isOver: monitor.isOver() && (monitor.getItem().stepId === props.stepId) && (monitor.getItem().releaseId === props.releaseId),
        }),
        hover(item: StoryInterface, monitor) {
            if (story.stepId === item.stepId && story.releaseId === item.releaseId){
                if (!ref.current) {
                    return
                }
                const dragIndex = {...item}.position
                const hoverIndex = {...story}.position
                if (dragIndex === hoverIndex) {
                    return
                }

                dispatch(switchPositionOfStory({
                    activityId: props.activityId,
                    stepId: props.stepId,
                    storyId1: item.id,
                    storyId2: story.id,
                }))

                item.position = hoverIndex
            }
        },
      }),
      [story]
    )
    drag(drop(ref))

    return(
        <StoryStyled
            className={'story'}
            key={story.id}
            ref={ref}
            onClick={()=>dispatch(setStory(story))}
            $isDragging={isDragging}
            $isOver={isOver}
            $isInDetails={storyInDetails.id === story.id}
            $isDone={story.status === 'done'}
        >
            <StoryStatusLine $status={story.status} />
            {story.name}
            {
                story.status === 'done' ?
                    <StoryPointsDone>{story.storyPoints}</StoryPointsDone>
                    :
                    <StoryPointsActive>{story.storyPoints}</StoryPointsActive>
            }
        </StoryStyled>
    )
}