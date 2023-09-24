import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {Activity, Project, Release, Step, Story} from "../models/project";
import { StoryStatusType, ReleaseStatusType } from "../models/types";

interface InitialState {
  story: Story, 
  activity: Activity,
  step: Step,
  release: Release
  project: Project
  detailsOpened: boolean,
}

const initialState:InitialState = {
  story: {
    name: "",
    id: -1,
    position: "",
    status: "",
    storyPoints: 0,
    description: '',
    definitionOfDone: '',
    definitionOfReady: '',
    releaseText: ''
  },
  activity: {
    id: -1,
    name: '',
    position: '',
    status: 'active',
    steps: [],
    projectId: -1
  },
  step: {
    id: -1,
    name: '',
    position: '',
    status: 'active',
    stories: []
  },
  release: {
    id: -1,
    name: '',
    status: 'opened'
  },
  project: {
    id: -1,
    name: '',
    status: "development",
    shortName: ''
  },
  detailsOpened: false,
}

export const detailsSlice = createSlice({
  name: 'details',
  initialState,
  reducers: {

    setStoryPoint: (state, action: PayloadAction<number>) => {
      state.story.storyPoints = action.payload
    },
    setStatus: (state, action: PayloadAction<StoryStatusType>) => {
      state.story.status = action.payload
    },
    setName: (state, action: PayloadAction<string>) => {
      state.story.name = action.payload
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.story.description = action.payload
    },
    setDefinitionOfDone: (state, action: PayloadAction<string>) => {
      state.story.definitionOfDone = action.payload
    },
    setDefinitionOfReady: (state, action: PayloadAction<string>) => {
      state.story.definitionOfReady = action.payload
    },
    setReleaseText: (state, action: PayloadAction<string>) => {
      state.story.definitionOfReady = action.payload
    },

    unsetDetails: (state, action: PayloadAction<void>) => {
      state.story = initialState.story
      state.step = initialState.step
      state.activity = initialState.activity
      state.release = initialState.release
      state.project = initialState.project
      state.detailsOpened = false
    },

    setStory: (state, action: PayloadAction<Story>) => {
      state.step = initialState.step
      state.activity = initialState.activity
      state.release = initialState.release
      state.project = initialState.project
      if (state.story.id !== action.payload.id){
        state.story = action.payload
        state.detailsOpened = true
      } else {
        state.detailsOpened = false
        state.story = initialState.story
      }
    },

    setStep: (state, action: PayloadAction<Step>) => {
      state.story = initialState.story
      state.activity = initialState.activity
      state.release = initialState.release
      state.project = initialState.project
      if (state.step.id !== action.payload.id){
        state.step = action.payload
        state.detailsOpened = true
      } else {
        state.detailsOpened = false
        state.step = initialState.step
      }
    },

    setActivity: (state, action: PayloadAction<Activity>) => {
      state.step = initialState.step
      state.story = initialState.story
      state.release = initialState.release
      state.project = initialState.project
      if (state.activity.id !== action.payload.id){
        state.activity = action.payload
        state.detailsOpened = true
      } else {
        state.detailsOpened = false
        state.activity = initialState.activity
      }
    },
    
    setRelease: (state, action: PayloadAction<Release>) => {
      state.step = initialState.step
      state.story = initialState.story
      state.activity = initialState.activity
      state.project = initialState.project
      if (state.release.id !== action.payload.id){
        state.release = action.payload
        state.detailsOpened = true
      } else {
        state.detailsOpened = false
        state.release = initialState.release
      }
    },
    setProject: (state, action: PayloadAction<Project>) => {
      state.step = initialState.step
      state.story = initialState.story
      state.activity = initialState.activity
      state.release = initialState.release
      if (state.project.id !== action.payload.id){
        state.project = action.payload
        state.detailsOpened = true
      } else {
        state.detailsOpened = false
        state.project = initialState.project
      }
    },
  },
})

export const {
    setStory,
    setDescription,
    setName,
    setStatus,
    setDefinitionOfReady,
    setDefinitionOfDone,
    setStoryPoint,
    setReleaseText,
    setStep,
    setRelease,
    setActivity,
    setProject,
    unsetDetails
} = detailsSlice.actions


export default detailsSlice.reducer