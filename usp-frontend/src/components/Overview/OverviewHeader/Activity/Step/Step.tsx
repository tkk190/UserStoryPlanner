import { Step as StepInterface } from "../../../../../models/project";
import {StepStyled, StoryPointsActive, StoryPointsDone} from "../../../Overview.styles";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "../../../Overview";
import { switchPositionOfStep } from "../../../../../slices/projectSlice";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import {useEffect, useRef, useState} from "react";
import {useSwitchStepPositionMutation} from "../../../../../slices/apiSlice";
import {setStep} from "../../../../../slices/detailsSlice";

interface Props{
    step: StepInterface
    small: boolean
}

export default function Step(props:Props){
    const dispatch = useAppDispatch()
    const step = props.step
    const ref = useRef<HTMLDivElement>(null)
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const [storyPointsActive, setStoryPointsActive] = useState(0)
    const [storyPointsDone, setStoryPointsDone] = useState(0)
    useEffect(()=>{
        let storyPointsActive = 0
        let storyPointsDone = 0
        step.stories.forEach(story => {
            if (!!story.storyPoints){
                if (story.status === 'done'){
                    storyPointsDone += story.storyPoints
                } else {
                    storyPointsActive += story.storyPoints
                }
            }
        })
        setStoryPointsActive(storyPointsActive)
        setStoryPointsDone(storyPointsDone)
    }, [step])

    const steps = useAppSelector((state) => state.project.project?.activities?.find(activity => activity.id === props.step.activityId)?.steps!)
    const [switchStepPosition, switchStepPositionResult] = useSwitchStepPositionMutation()

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.STEP,
        canDrag: readwrite === 'write',
        item: ()=> ({...step}),
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [step])

    const handleDropStep = (item:StepInterface) => {
        if (item.activityId === step.activityId){
            switchStepPosition(steps.map(step => ({id: step.id, position: step.position})))
        }
    }

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.STEP,
        drop: handleDropStep,
        collect: (monitor) => ({
          isOver: monitor.isOver(),
        }),
        hover(item: StepInterface, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = {...item}.position
            const hoverIndex = {...step}.position
            if (dragIndex === hoverIndex || item.activityId !== step.activityId) {
                return
            }
            if (item.activityId === step.activityId){
                dispatch(switchPositionOfStep({
                    activityId: step.activityId!,
                    stepId1: item.id,
                    stepId2: step.id,
                }))
            }


            item.position = hoverIndex
        }
      }),
      [step]
    )

    drag(drop(ref))

    const stepName = !!props.step.ideas ? `${props.step.name} (+)` : props.step.name

    return(
        <StepStyled
            ref={ref}
            $small={props.small}
            $isDragging={isDragging}
            $isOver={isOver}
            onClick={()=>dispatch(setStep(step))}
        >
            {stepName}
            <StoryPointsActive>{storyPointsActive}</StoryPointsActive>
            <StoryPointsDone>{storyPointsDone}</StoryPointsDone>
        </StepStyled>
    )
}