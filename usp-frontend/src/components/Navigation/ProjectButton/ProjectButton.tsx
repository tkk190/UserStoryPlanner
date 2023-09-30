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
import {useNavigate, useSearchParams} from "react-router-dom";

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
            localStorage.setItem("project", project.id.toString())
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
    let [searchParams, setSearchParams] = useSearchParams({projectId: ""});
    const navigate = useNavigate()
    const handleProjectButton = () =>{
        searchParams.set("projectId", project.id.toString());
        // setSearchParams(prev=>{
        //     prev.set("projectId", project.id.toString())
        //     return prev
        // })
        navigate(`/project?${searchParams.toString()}`)
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

    const mouseDownHandler = () => {
      setSearchParams({projectId: project.id.toString()})
      searchParams.set("projectId", project.id.toString());
      window.open(`/project?${searchParams.toString()}`,'_blank', 'rel=noopener noreferrer')
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
                    onMouseDown={(e)=>e.button === 1 && mouseDownHandler()}
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
                onMouseDown={(e)=>e.button === 1 && mouseDownHandler()}
                $activeProject={!!currentProject && currentProject.id === project.id}
                $navigationIsOpened={props.navigationIsOpened}
            >
                {!!project.shortName ? project.shortName : project.name.slice(0, 3)}
            </ProjectButtonWrapper>
    )
}