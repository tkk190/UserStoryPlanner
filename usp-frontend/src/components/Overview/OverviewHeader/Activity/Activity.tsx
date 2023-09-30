import {
    ActivityStyled,
    ActivityWrapperStyled,
    StepPlaceholder,
    StepWrapperStyled, StoryPointsActive, StoryPointsDone
} from "../../Overview.styles";
import NewItem from "../../NewItem/NewItem";
import {Plus} from "react-feather";
import {
    Activity as ActivityInterface,
    Step as StepInterface
} from "../../../../models/project";
import {comparePosition, createRandomId} from "../../../../utils/utils";
import {
    addEmptyStepToActivity,
    switchPositionOfActivity,
    assignStepToActivity
} from "../../../../slices/projectSlice";
import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "../../Overview";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks";
import {useEffect, useRef, useState} from "react";
import {useSetStepToActivityMutation, useSwitchActivityPositionMutation} from "../../../../slices/apiSlice";
import Step from "./Step/Step";
import {setActivity, unsetDetails} from "../../../../slices/detailsSlice";

interface Props {
    activity:ActivityInterface
}

export default function Activity(props:Props){
    const dispatch = useAppDispatch()
    const activity = props.activity
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const currentProject = useAppSelector((state) => state.project.project)
    const ref = useRef<HTMLDivElement>(null)
    let steps:StepInterface[] = [...activity.steps]
    steps.sort(comparePosition)

    const [storyPointsActive, setStoryPointsActive] = useState(0)
    const [storyPointsDone, setStoryPointsDone] = useState(0)

    useEffect(()=>{
        let storyPointsActive = 0
        let storyPointsDone = 0
        activity.steps.forEach(step=>{
            step.stories.forEach(story => {
                if (!!story.storyPoints){
                    if (story.status === 'done'){
                        storyPointsDone += story.storyPoints
                    } else {
                        storyPointsActive += story.storyPoints
                    }
                }
            })
        })
        setStoryPointsActive(storyPointsActive)
        setStoryPointsDone(storyPointsDone)
    }, [activity])


    const activities = useAppSelector((state) => state.project.project!.activities!)

    const [switchActivityPosition, switchActivityPositionResult] = useSwitchActivityPositionMutation()
    const [setStepToActivity, setStepToActivityResult] = useSetStepToActivityMutation()

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.ACTIVITY,
        canDrag: readwrite === 'write',
        item: ()=> ({...activity}),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [activity])

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.ACTIVITY,
        drop: (item:ActivityInterface) => switchActivityPosition(activities.map(activity => ({id: activity.id, position: activity.position}))),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
        hover(item: ActivityInterface, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = {...item}.position
            const hoverIndex = {...activity}.position
            if (dragIndex === hoverIndex) {
                return
            }

            dispatch(switchPositionOfActivity({
                activityId1: item.id,
                activityId2: activity.id,
            }))

            item.position = hoverIndex
        }
      }),
      [activity]
    )
    const handleDropStepToActivity = (step:StepInterface) => {
        const oldActivitytId = activity.id
        if (!!oldActivitytId && oldActivitytId !== step.activityId){
            const newStep = {...step, activityId: activity.id, projectId: currentProject.id}
            dispatch(assignStepToActivity({step: newStep, oldActivityId: oldActivitytId}))
            setStepToActivity(newStep)
        }
    }

    const [{ isOver2 }, drop2] = useDrop(
      () => ({
          accept: ItemTypes.STEP,
          drop: handleDropStepToActivity,
          collect: (monitor) => ({
              isOver2: monitor.isOver()
          })
      }),
      []
    )

    const handleNewStep = (activityId:number) =>{
        dispatch(unsetDetails())
        const newStep:StepInterface = {
            id: createRandomId(),
            name: '',
            stories: [],
            position: 'zzz',
            status: "active"
        }
        dispatch(addEmptyStepToActivity({step: newStep, activityId: activityId}))
    }

    drag(drop(drop2(ref)))

    return(
        <ActivityWrapperStyled
            key={activity.id}
            ref={ref}
            $isDragging={isDragging}
            $isOver={isOver || isOver2}

        >
            <StepWrapperStyled>
                {
                    activity.name.length > 0
                        ?
                        <ActivityStyled onClick={()=>dispatch(setActivity(activity))}>
                            {activity.name}
                            <StoryPointsActive>{storyPointsActive}</StoryPointsActive>
                            <StoryPointsDone>{storyPointsDone}</StoryPointsDone>
                        </ActivityStyled>
                        :
                        <NewItem itemType={'activity'} itemId={activity.id}  />
                }
            </StepWrapperStyled>
            <StepWrapperStyled>
                {
                    steps.map((step, idx)=> step.name.length > 0
                        ?
                        <Step key={step.id} step={{...step, activityId: activity.id}} small={idx === activity.steps.length -1} />
                        :
                        <NewItem itemType={'step'} activityId={activity.id} itemId={step.id}/>  )
                }
                {
                    readwrite === 'write' &&
                    <StepPlaceholder
                        $small={steps.length > 0}
                        onClick={()=>handleNewStep(activity.id)}
                    ><Plus/></StepPlaceholder>
                }
            </StepWrapperStyled>
        </ActivityWrapperStyled>
    )
}