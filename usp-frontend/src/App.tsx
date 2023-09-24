import React, {useEffect, useState} from 'react';
import {AppWrapper, ClickableBorder, ClickableBorderChild} from './App.styles'
import Navigation from "./components/Navigation/Navigation";
import Overview from "./components/Overview/Overview";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import StoryDetails from "./components/DetailBox/StoryDetails";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import GlobalStyle from "./GlobalStyle";
import ActivityDetails from './components/DetailBox/ActivityDetails';
import StepDetails from './components/DetailBox/StepDetails';
import ReleaseDetails from './components/DetailBox/ReleaseDetails';
import {
    useDeleteActivityMutation,
    useDeleteReleaseMutation,
    useDeleteStepMutation,
    useDeleteStoryMutation, useLazyGetProjectByIdQuery
} from "./slices/apiSlice";
import ProjectDetails from "./components/DetailBox/ProjectDetails";
import LoginForm from "./components/LoginForm/LoginForm";
import {useCookies} from "react-cookie";
import {useJwt} from "react-jwt";
import {AllReadwriteTypes, ReadwriteType, setRight} from "./slices/loginSlice";
import {AccessToken, RefreshToken} from "./models/token";
import {setOpenedProject} from "./slices/projectSlice";

function instanceOfReadwriteType(value: string): value is ReadwriteType {
  return AllReadwriteTypes.includes(value as ReadwriteType)
}


function App() {
    const dispatch = useAppDispatch()
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const [navigationIsOpened, setNavigationIsOpened] = useState(true)
    const [detailsIsOpened, setDetailsIsOpened] = useState(true)
    const [detailsIsClickable, setDetailsIsClickable] = useState(false)


    const story = useAppSelector((state) => state.details.story)
    const activity = useAppSelector((state) => state.details.activity)
    const step = useAppSelector((state) => state.details.step)
    const release = useAppSelector((state) => state.details.release)
    const project = useAppSelector((state) => state.details.project)
    const detailsOpened = useAppSelector((state) => state.details.detailsOpened)
    const currentProject = useAppSelector((state) => state.project.project)

    const [loggedIn, setLoggedIn] = useState(false)

    const [cookies, setCookie, removeCookie] = useCookies(['access_token_content', 'refresh_token_content'])
    const accessToken = useJwt<AccessToken>(cookies.access_token_content + '.x')
    const refreshToken = useJwt<RefreshToken>(cookies.refresh_token_content + '.x')

    useEffect(()=>{
        const rights = accessToken.decodedToken?.scope
        let uspRight = rights?.find(right=>right.includes('usp:'))
        if (!!uspRight){
            uspRight = uspRight.replace('usp:', '')
            if (instanceOfReadwriteType(uspRight)){
                dispatch(setRight(uspRight))
            }
        }
    }, [accessToken])

    useEffect(()=>{
        if (!!cookies.refresh_token_content && !refreshToken.isExpired){
            setLoggedIn(true)
        } else {
            setLoggedIn(false)
        }
    }, [refreshToken])

    const [deleteStory] = useDeleteStoryMutation()
    const [deleteStep] = useDeleteStepMutation()
    const [deleteActivity] = useDeleteActivityMutation()
    const [deleteRelease] = useDeleteReleaseMutation()
    const [getProjectById, getProjectByIdResult] = useLazyGetProjectByIdQuery()

    useEffect(()=>{
        if (!detailsIsOpened && (story.name !== "" || activity.name !== "" || step.name !== "" || release.name !== "")){
            setDetailsIsOpened(true)
        }
        if (story.name !== "" || activity.name !== "" || step.name !== "" || release.name !== ""){
            setDetailsIsClickable(true)
        } else {
            setDetailsIsClickable(false)
        }
    }, [story, activity, step, release])

    useEffect(()=>{
        setDetailsIsOpened(detailsOpened)
    }, [detailsOpened])

    useEffect(()=>{
        if (getProjectByIdResult.isSuccess){
            dispatch(setOpenedProject(getProjectByIdResult.data))
        }
    }, [dispatch, getProjectByIdResult])

    useEffect(()=>{
        getProjectById(Number(localStorage.getItem("project")))
    }, [])

    const handleDeleteKey = () => {
        if (story.name !== ""){
            if (window.confirm(`Do you really want to delete Story ${story.name}`)){
                deleteStory({storyId: story.id, projectId: currentProject.id})
            }
        } else if (activity.name !== ""){
            if (window.confirm(`Do you really want to delete Activity ${activity.name}`)){
                deleteActivity({activityId: activity.id, projectId: currentProject.id})
            }
        } else if (step.name !== ""){
            if (window.confirm(`Do you really want to delete Step ${step.name}`)){
                deleteStep({stepId: step.id, projectId: currentProject.id})
            }
        } else if (release.name !== ""){
            if (window.confirm(`Do you really want to delete Release ${release.name}`)){
                deleteRelease({releaseId: release.id, projectId: currentProject.id})
            }
        }
    }


    return (
        <AppWrapper tabIndex={0} onKeyDown={e=>(readwrite === 'write' && e.key === 'Delete') && handleDeleteKey()} >
            <GlobalStyle />
            <LoginForm loggedIn={loggedIn}/>
            {
                loggedIn
                    &&
                    <>
                        <Navigation navigationIsOpened={navigationIsOpened} />
                        <ClickableBorder onClick={()=>setNavigationIsOpened(!navigationIsOpened)}/>
                        <DndProvider backend={HTML5Backend}>
                            <Overview />
                        </DndProvider>
                        <ClickableBorder onClick={()=>detailsIsClickable && setDetailsIsOpened(!detailsIsOpened)} $small={detailsIsOpened}>
                            {detailsIsOpened && <ClickableBorderChild onClick={()=>setDetailsIsOpened(!detailsIsOpened)} />}
                        </ClickableBorder>
                        {(detailsIsOpened && story.name !== "") && <StoryDetails />}
                        {(detailsIsOpened && activity.name !== "") && <ActivityDetails />}
                        {(detailsIsOpened && step.name !== "") && <StepDetails />}
                        {(detailsIsOpened && release.name !== "") && <ReleaseDetails />}
                        {(detailsIsOpened && project.name !== "") && <ProjectDetails />}
                    </>
            }
        </AppWrapper>
    );
}

export default App;
