import {
    H1, H2, Header, HeaderIconWrapper,
    Release, Row, StoryPlaceholder, StoryPointsActive, StoryPointsDone, Wrapper
} from "./Overview.styles";
import {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import StoryWrapper from "./Story/StoryWrapper";
import { comparePosition } from "../../utils/utils"
import OverviewHeader from "./OverviewHeader/OverviewHeader";
import {Activity as ActivityInterface, FullProject, Step as StepInterface} from "../../models/project";
import {setRelease} from "../../slices/detailsSlice";
import {Activity, CheckSquare, TrendingUp} from "react-feather";
import {api_url} from "../../utils/urls";
import ScrollContainer from "react-indiana-drag-scroll";
import {setOpenedProject} from "../../slices/projectSlice";
import {setProject} from "../../slices/detailsSlice";
import {useLazyGetProjectByIdQuery} from "../../slices/apiSlice";
import {useSearchParams} from "react-router-dom";


interface Props {
}



export const ItemTypes = {
    STORY: 'story',
    STEP: 'step',
    ACTIVITY: 'activity'
}

export default function Overview(props:Props) {
    const dispatch = useAppDispatch()
    let [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId')
    const project = useAppSelector((state) => state.project.project)
    const readwrite = useAppSelector((state) => state.login.readwrite)

    const [height, setHeight] = useState(0)

    const [getProjectById, getProjectByIdResult] = useLazyGetProjectByIdQuery()
    const [currentProject, setCurrentProject] = useState<FullProject>({name: "", id: -1, releases: [], status: "development", shortName: ''})

    useEffect(()=>{
        if (getProjectByIdResult.isSuccess){
            console.log(getProjectByIdResult.data)
            dispatch(setOpenedProject(getProjectByIdResult.data))
            setCurrentProject(getProjectByIdResult.data)
        }
    }, [dispatch, getProjectByIdResult])

    useEffect(()=>{
        if (projectId !== undefined){
            getProjectById(Number(projectId))
        }
    }, [projectId])

    useEffect(() => {
        console.log('project', project)
        setCurrentProject(project)
    }, [project]);


    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!!ref && !!ref.current){
            setHeight(ref.current.clientHeight)
        }
    }, [ref])



    let activities:ActivityInterface[] = []
    if (!!currentProject.activities){
        activities = [...currentProject.activities]
        activities.sort(comparePosition)
    }

    const [storyPointsActive, setStoryPointsActive] = useState(0)
    const [storyPointsDone, setStoryPointsDone] = useState(0)
    const [storyPointsRatio, setStoryPointsRatio] = useState(100)

    useEffect(()=>{
        console.log('currentProject', currentProject)
        let storyPointsActive = 0
        let storyPointsDone = 0
        currentProject.activities?.forEach(activity=>
            activity.steps.forEach(step=> {
                step.stories.forEach(story => {
                    if (!!story.storyPoints) {
                        if (story.status === 'done') {
                            storyPointsDone += story.storyPoints
                        } else {
                            storyPointsActive += story.storyPoints
                        }
                    }
                })
            })
        )
        setStoryPointsActive(storyPointsActive)
        setStoryPointsDone(storyPointsDone)
        let storyPointsRatio = Number((100 * storyPointsDone / (storyPointsDone + storyPointsActive)).toFixed())
        setStoryPointsRatio(storyPointsRatio)
    }, [currentProject])

    const handleNewTab = (type:string) => window.open(`${api_url}export/project_backlog/${currentProject.id}/${type}`, "_blank")

    const projectHeader = !!currentProject.ideas ? `${currentProject.name} (+)` : currentProject.name

    return(
        <Wrapper>
            {currentProject.id > 0 &&
                <>
                    <Header>
                        <H1 onClick={()=>dispatch(setProject(currentProject))}>aa{projectHeader}</H1>
                        <H2>
                            <HeaderIconWrapper onClick={()=>handleNewTab('active')}><Activity /> {storyPointsActive} SP</HeaderIconWrapper>
                            |
                            <HeaderIconWrapper onClick={()=>handleNewTab('done')}><CheckSquare /> {storyPointsDone} SP</HeaderIconWrapper>
                            |
                            <HeaderIconWrapper onClick={()=>handleNewTab('full')}><TrendingUp /> {storyPointsRatio}%</HeaderIconWrapper>
                        </H2>
                    </Header>
                    <ScrollContainer style={{height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column'}} ignoreElements={'input, #OverviewHeader,.story'}>
                        <OverviewHeader project={currentProject}/>
                        {currentProject.releases.map((release)=>{
                            let storyPointsActive = 0
                            let storyPointsDone = 0
                            currentProject.activities?.forEach(activity => {
                                activity.steps.forEach(step=>{
                                    step.stories.forEach(story => {
                                        if (!!story.storyPoints && story.release?.id === release.id){
                                            if (story.status === 'done'){
                                                storyPointsDone += story.storyPoints
                                            } else {
                                                storyPointsActive += story.storyPoints
                                            }
                                        }
                                    })
                                })
                            })
                            let notPlanned = release.name === 'not planned' && storyPointsActive === 0
                            let releaseDone = release.status === 'done'
                            let smallRelease = releaseDone || notPlanned
                            return(
                                <Row key={release.id}>
                                    <Release
                                        onClick={()=>dispatch(setRelease(release))}
                                        $done={smallRelease}
                                    >
                                        {release.name}
                                        {(!releaseDone && !notPlanned) && <StoryPointsActive>{storyPointsActive}</StoryPointsActive>}
                                        <StoryPointsDone>{storyPointsDone}</StoryPointsDone>
                                    </Release>
                                    {activities.map((activity)=> {
                                        let steps:StepInterface[] = [...activity.steps]
                                        if (steps.length > 0){
                                            steps.sort(comparePosition)
                                            return steps.map((step, idx)=> {
                                                const stories = step.stories
                                                    .filter((story)=> story.release?.name === release.name || story.releaseId === release.id)
                                                    .sort(comparePosition)

                                                return(
                                                    (!releaseDone) &&
                                                    <StoryWrapper
                                                        lastStep={steps.length === idx + 1}
                                                        key={step.id}
                                                        releaseId={release.id}
                                                        stepId={step.id}
                                                        activityId={activity.id}
                                                        stories={stories}
                                                        notPlanned={notPlanned}
                                                    />
                                                )
                                            })
                                        } else {
                                            return(
                                                (release.status !== 'done' && readwrite === 'write') && <StoryPlaceholder />
                                            )
                                        }
                                    })}
                                </Row>
                            )
                        })}
                    </ScrollContainer>
                </>
            }
        </Wrapper>
    )
}
