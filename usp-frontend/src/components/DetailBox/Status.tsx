import {StatusDisplay, StatusDisplayText, StatusLine, StatusOption, StatusOptionList} from "./DetailBox.styles";
import {ActivityStatusType, ProjectStatusType, ReleaseStatusType, StepStatusType, StoryStatusType} from "../../models/types";
import {useEffect, useState} from "react";
import {
    useChangeActivityMutation, useChangeProjectMutation,
    useChangeReleaseMutation,
    useChangeStepMutation,
    useChangeStoryMutation
} from "../../slices/apiSlice";
import {Activity, Project, Release, Step, Story} from "../../models/project";
import {useAppSelector} from "../../app/hooks";



interface Props{
    statusList: StoryStatusType[] | ReleaseStatusType[] | StepStatusType[] | ActivityStatusType[] | ProjectStatusType[]
    item: Story | Activity | Step | Release | Project
}

function instanceOfStory(object: any): object is StoryStatusType {
    return object.hasOwnProperty('storyPoints');
}
function instanceOfStep(object: any) {
    return object.hasOwnProperty('activityId');
}
function instanceOfActivity(object: any): object is ActivityStatusType {
    return object.hasOwnProperty('projectId');
}
function instanceOfProject(object: any): object is ProjectStatusType {
    console.log(object)
    console.log(object.hasOwnProperty('shortName'))
    return object.hasOwnProperty('shortName');
}
function instanceOfRelease(object: any): object is ReleaseStatusType {
    return true;
}
export default function Status(props:Props){
    const readwrite = useAppSelector((state) => state.login.readwrite)

    type StatusType = StoryStatusType | ReleaseStatusType | StepStatusType | ActivityStatusType | ProjectStatusType
    let statusList:StoryStatusType[] | ReleaseStatusType[] | StepStatusType[] | ActivityStatusType[] | ProjectStatusType[] = []
    if (instanceOfStory(props.item)){
        statusList = props.statusList as StoryStatusType[]
    } else if (instanceOfStep(props.item)){
        statusList = props.statusList as StepStatusType[]
    } else if (instanceOfActivity(props.item)){
        statusList = props.statusList as ActivityStatusType[]
    } else if (instanceOfProject(props.item)){
        statusList = props.statusList as ProjectStatusType[]
    } else {
        statusList = props.statusList as ReleaseStatusType[]
    }

    const item = props.item


    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)
    const [statusOptionsOpen, setStatusOptionsOpen] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(item.status)
    const currentProject = useAppSelector((state) => state.project.project)

    const [changeStory, changeStoryResult] = useChangeStoryMutation()
    const [changeActivity, changeActivityResult] = useChangeActivityMutation()
    const [changeStep, changeStepResult] = useChangeStepMutation()
    const [changeRelease, changeReleaseResult] = useChangeReleaseMutation()
    const [changeProject, changeProjectResult] = useChangeProjectMutation()


    useEffect(()=>{
        setCurrentStatus(item.status)
    }, [item])

    const setNextStatus = (status: StatusType) =>{
        const statusId = statusList.findIndex(item => status === item)
        let newStatus = statusList[statusId +1]
        if (statusId < statusList.length - 2){
            setCurrentStatus(newStatus)
        }
        setStatusOptionsOpen(false)
        if (instanceOfStory(props.item)){
            newStatus = newStatus as StoryStatusType
            if (newStatus !== 'archived'){
                changeStory({id: item.id, status: newStatus, projectId: currentProject.id})
            }
        } else if (instanceOfStep(props.item)){
            newStatus = newStatus as StepStatusType
            if (newStatus !== 'archived') {
                changeStep({id: item.id, status: newStatus, projectId: currentProject.id})
            }
        } else if (instanceOfActivity(props.item)){
            newStatus = newStatus as ActivityStatusType
            if (newStatus !== 'archived') {
                changeActivity({id: item.id, status: newStatus, projectId: currentProject.id})
            }
        } else if (instanceOfProject(props.item)){
            newStatus = newStatus as ProjectStatusType
            if (newStatus !== 'archived') {
                changeProject({id: item.id, status: newStatus})
            }
        } else {
            newStatus = newStatus as ReleaseStatusType
            if (newStatus !== 'archived') {
                changeRelease({id: item.id, status: newStatus, projectId: currentProject.id})
            }
        }

    }

    const onClickHandler = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, ) => {
        event.preventDefault();
        event.stopPropagation();
        if (!timeoutId) {
            setTimeoutId(setTimeout(() => {
                setStatusOptionsOpen(!statusOptionsOpen)
                setTimeoutId(null)
            }, 300))
        }
    };

    const onDblClickHandler = (currentStatus:StatusType) => {
        !!timeoutId && clearTimeout(timeoutId)
        setTimeoutId(null)
        setNextStatus(currentStatus)
    }
    const handleStatusChange = (status: StatusType) =>{
        setCurrentStatus(status)
        setStatusOptionsOpen(!statusOptionsOpen)
        if (instanceOfStory(props.item)){
            status = status as StoryStatusType
            changeStory({id: item.id, status: status, projectId: currentProject.id})
        } else if (instanceOfStep(props.item)){
            status = status as StepStatusType
            changeStep({id: item.id, status: status, projectId: currentProject.id})
        } else if (instanceOfActivity(props.item)){
            status = status as ActivityStatusType
            changeActivity({id: item.id, status: status, projectId: currentProject.id})
        } else if (instanceOfProject(props.item)){
            status = status as ProjectStatusType
            changeProject({id: item.id, status: status})
        } else {
            status = status as ReleaseStatusType
            changeRelease({id: item.id, status: status, projectId: currentProject.id})
        }

    }
    return(
        <>
            <StatusLine $status={currentStatus}/>
            <StatusDisplay>
                <StatusDisplayText
                    $status={currentStatus}
                    onDoubleClick={()=>readwrite === 'write' && onDblClickHandler(currentStatus)}
                    onClick={(e)=>readwrite === 'write' && onClickHandler(e)}
                    $disabled={readwrite !== 'write'}
                >
                    {currentStatus.length === 0 ? 'kein Status' : currentStatus}
                </StatusDisplayText>

                {statusOptionsOpen &&
                    <StatusOptionList>
                        {
                            statusList.map((status, idx) =>
                                <StatusOption
                                    key={idx}
                                    $status={status}
                                    onClick={()=>handleStatusChange(status)}
                                >
                                    {status}
                                </StatusOption>)
                        }
                    </StatusOptionList>
                }
            </StatusDisplay>

        </>
    )
}