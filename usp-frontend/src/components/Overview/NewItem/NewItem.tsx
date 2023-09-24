import {
    NewItemIconLeft,
    NewItemIconRight,
    NewItemInput,
    NewItemStyled
} from "./NewItem.styles";
import {Save, X} from "react-feather";
import {useState} from "react";
import {useCreateActivityMutation, useCreateStepMutation, useCreateStoryMutation} from "../../../slices/apiSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {removeActivityfromProject, removeStepfromActivity, removeStoryfromStep} from "../../../slices/projectSlice";
import {NewStory} from "../../../models/project";

interface Props{
    itemId: number
    itemType: 'activity' | 'step' | 'story'
    activityId?: number
    releaseId?: number
    stepId?: number
}

export default function NewItem(props:Props){
    const dispatch = useAppDispatch()
    const project = useAppSelector((state) => state.project.project)
    const [itemName, setItemName] = useState('')

    const [createStep, createStepResult] = useCreateStepMutation()
    const [createActivity, createActivityResult] = useCreateActivityMutation()
    const [createStory, createStoryResult] = useCreateStoryMutation()

    const handleNewItem = ()=>{
        if (props.itemType === 'activity') {
            const newActivity = {
                name: itemName,
                projectId: project.id
            }
            createActivity(newActivity)
        } else if (props.itemType === 'step' && !!props.activityId){
            const newStep = {
                name: itemName,
                activityId: props.activityId,
                projectId: project.id
            }
            createStep(newStep)
        } else if (props.itemType === 'story' && !!props.releaseId && !! props.stepId && !!props.activityId){
            const newStory: NewStory = {
                name: itemName,
                releaseId: props.releaseId,
                stepId: props.stepId,
                projectId: project.id
            }
            createStory(newStory)
        }
        setItemName('')
    }

    const removeNewItem = ()=>{
        if (props.itemType === 'activity') {
            dispatch(removeActivityfromProject(props.itemId))
        } else if (props.itemType === 'step' && !!props.activityId){
            dispatch(removeStepfromActivity({activityId: props.activityId, stepId: props.itemId}))
        } else if (props.itemType === 'story' && !!props.releaseId && !! props.stepId && !!props.activityId){
            dispatch(removeStoryfromStep({storyId: props.itemId, stepId: props.stepId, activityId: props.activityId}))
        }
        setItemName('')
    }

    return(
        <NewItemStyled
            itemType={props.itemType}
        >
            <NewItemInput
                type="text"
                onChange={(e)=>setItemName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNewItem()}
            />
            <NewItemIconLeft onClick={removeNewItem}><X /></NewItemIconLeft>
            <NewItemIconRight onClick={handleNewItem}><Save /></NewItemIconRight>
        </NewItemStyled>
    )
}