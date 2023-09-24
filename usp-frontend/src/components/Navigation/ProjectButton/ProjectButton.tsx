import {EditProjectInput, LeftIcon, ProjectButtonWrapper, RightIcon, SetProjectButton} from "../Navigation.styles";
import {Edit, Trash, Save, X} from "react-feather";
import {Project} from "../../../models/project";
import {
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useLazyGetProjectByIdQuery,
    useRenameProjectMutation
} from "../../../slices/apiSlice";
import {useEffect, useState} from "react";
import {setOpenedProject} from "../../../slices/projectSlice";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import {unsetDetails} from "../../../slices/detailsSlice";

interface Props{
    project: Project
    navigationIsOpened: boolean
    editProject?: boolean
    setNewProjectState?: Function
}

export default function ProjectButton(props:Props){
    const dispatch = useAppDispatch()
    const project = props.project
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const [editProject, setEditProject] = useState(!!props.editProject ? props.editProject : false)
    const [name, setName] = useState(project.name)
    const [showIconState, setShowIconState] = useState(false)
    const [delayHandler, setDelayHandler] = useState<NodeJS.Timeout>()

    const [deleteProject, deleteProjectResult] = useDeleteProjectMutation()
    const [renameProject, renameProjectResult] = useRenameProjectMutation()
    const [createProject, createProjectResult] = useCreateProjectMutation()
    const [getProjectById, getProjectByIdResult] = useLazyGetProjectByIdQuery()

    const currentProject = useAppSelector((state) => state.project.project)

    useEffect(()=>{
        if (getProjectByIdResult.isSuccess){
            dispatch(setOpenedProject(getProjectByIdResult.data))
        }
    }, [dispatch, getProjectByIdResult])

    const handleRightButton = () => {
        if (!props.editProject && editProject){
            renameProject({...project, name})
            setEditProject(false)
        }
        if (props.editProject){
            createProject(name)
            setName('')
        }
        if (!props.editProject && !editProject){
            setEditProject(!editProject)
        }
        if (!!props.setNewProjectState){
            props.setNewProjectState(false)
        }
    }
    const handleLeftButton = () => {
        if (!editProject && window.confirm("wirklich löschen?")){
            deleteProject(project.id)
        }
        setName('')
        !!props.setNewProjectState && props.setNewProjectState(false)
    }

    const handleProjectButton = () =>{
        console.warn('handleProjectButton', project.id)
        dispatch(unsetDetails())
        getProjectById(project.id)
    }

    const handleMouseEnter = (event:React.MouseEvent) => {
        setDelayHandler(setTimeout(() => {
            setShowIconState(true)
        }, 800))
    }

    const handleMouseLeave = () => {
        clearTimeout(delayHandler)
        setShowIconState(false)
    }


    return(
        (props.navigationIsOpened)
            ?
            <ProjectButtonWrapper
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                $activeProject={!!currentProject && currentProject.id === project.id}
                $navigationIsOpened={props.navigationIsOpened}
            >
                {
                    readwrite === 'write' &&
                    <LeftIcon $showIconState={showIconState} $state={editProject} onClick={handleLeftButton}>{editProject ? <X /> : <Trash/>}</LeftIcon>
                }
                <SetProjectButton
                    $showIconState={(showIconState && readwrite === 'write')}
                    onClick={handleProjectButton}
                    $disabled={editProject && readwrite !== 'write'}
                >
                    {editProject ?
                        <EditProjectInput
                            placeholder={'new project name'}
                            type="text"
                            // defaultValue={name}
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            onKeyDown={(e)=>e.key === 'Enter' && handleRightButton()}
                            disabled={readwrite !== 'write'}
                        />
                        :
                        project.name
                    }
                </SetProjectButton>
                {
                    readwrite === 'write' &&
                    <RightIcon $showIconState={showIconState} $state={editProject} onClick={handleRightButton}>{editProject ? <Save /> : <Edit />}</RightIcon>
                }
            </ProjectButtonWrapper>
            :
            <ProjectButtonWrapper
                onClick={handleProjectButton}
                $activeProject={!!currentProject && currentProject.id === project.id}
                $navigationIsOpened={props.navigationIsOpened}
            >
                {!!project.shortName ? project.shortName : project.name.slice(0, 3)}
            </ProjectButtonWrapper>
    )
}