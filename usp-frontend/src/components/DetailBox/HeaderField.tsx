import {H2, H2Input, H2InputWrapper, SaveWrapper} from "./DetailBox.styles";
import {Save} from "react-feather";
import {useState} from "react";
import {
    useChangeActivityMutation, useChangeProjectMutation,
    useChangeReleaseMutation,
    useChangeStepMutation,
    useChangeStoryMutation
} from "../../slices/apiSlice";
import {Activity, Project, Release, Step, Story} from "../../models/project";
import {useAppSelector} from "../../app/hooks";

interface Props{
    item: Story | Activity | Step | Release | Project
}

function instanceOfStory(object: any): object is Story {
    return object.hasOwnProperty('storyPoints');
}
function instanceOfStep(object: any): object is Step {
    return object.hasOwnProperty('activityId');
}
function instanceOfActivity(object: any): object is Activity {
    return object.hasOwnProperty('projectId');
}
function instanceOfProject(object: any): object is Project {
    return object.hasOwnProperty('shortName');
}
function instanceOfRelease(object: any): object is Release {
    return !(instanceOfActivity(object) || instanceOfStep(object) || instanceOfStory(object) || instanceOfProject(object))
}
export default function HeaderField(props:Props){
    const item = props.item
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const [editName, setEditName] = useState(false)
    const [currentName, setCurrentName] = useState(item.name)
    const currentProject = useAppSelector((state) => state.project.project)

    const [changeStory, changeStoryResult] = useChangeStoryMutation()
    const [changeActivity, changeActivityResult] = useChangeActivityMutation()
    const [changeStep, changeStepResult] = useChangeStepMutation()
    const [changeRelease, changeStoryRelease] = useChangeReleaseMutation()
    const [changeProject, changeProjectRelease] = useChangeProjectMutation()

    const handleEditStoryName = () =>{
        setEditName(false)
        if (instanceOfStory(item)){
            changeStory({id: item.id, name: currentName, projectId: currentProject.id})
        } else if (instanceOfStep(item)){
            changeStep({id: item.id, name: currentName, projectId: currentProject.id})
        } else if (instanceOfActivity(item)){
            changeActivity({id: item.id, name: currentName, projectId: currentProject.id})
         } else if (instanceOfProject(item)){
            changeProject({id: item.id, name: currentName})
        } else {
            changeRelease({id: item.id, name: currentName, projectId: currentProject.id})
        }
    }

    return(
        <>
            {
                editName
                    ?
                    <H2InputWrapper>
                        <H2Input
                            onKeyDown={e => e.key === 'Enter' && handleEditStoryName()}
                            onChange={(e)=>setCurrentName(e.target.value)}
                            value={currentName}
                            type="text"
                        />
                        <SaveWrapper><Save onClick={handleEditStoryName} height={34} width={34} /></SaveWrapper>
                    </H2InputWrapper>
                    :
                    <H2
                        onClick={()=>(!instanceOfRelease(item) && readwrite === 'write') && setEditName(true)}
                    >{currentName}</H2>
            }

        </>
    )
}