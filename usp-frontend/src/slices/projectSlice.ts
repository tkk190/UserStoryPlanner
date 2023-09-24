import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {Activity, FullProject, NewStory, Step, Story} from "../models/project";


const initialState: { project: FullProject } = {
  project: {name: "", id: -1, releases: [], status: "development", shortName: ''}
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setOpenedProject: (state, action: PayloadAction<FullProject>) => {
      state.project = action.payload
    },

    addEmptyActivityToProject: (state, action: PayloadAction<Activity>) =>{
      if (state.project.activities) {
        const emptyActivities = state.project.activities.filter(activity => activity.name === '')
        if (emptyActivities.length === 0){
          state.project.activities = [...state.project.activities, action.payload]
        }
      }
    },
    removeActivityfromProject: (state, action: PayloadAction<number>) =>{
      if (state.project.activities){
        const filteredActivities = state.project.activities.filter(activity=>activity.id !== action.payload)
        state.project.activities = filteredActivities
      }
    },
    switchPositionOfActivity: (state, action: PayloadAction<{ activityId1: number, activityId2: number }>) => {
      if (state.project.activities){
        const activityIdx1 = state.project.activities.findIndex(activity => activity.id === action.payload.activityId1)
        const activityIdx2 = state.project.activities.findIndex(activity => activity.id === action.payload.activityId2)
        if (activityIdx1 >= 0 && activityIdx2 >= 0){
          const oldPosition1 = state.project.activities[activityIdx1].position
          const oldPosition2 = state.project.activities[activityIdx2].position
          state.project.activities[activityIdx1].position = oldPosition2
          state.project.activities[activityIdx2].position = oldPosition1
        } else {
          console.warn('activity indexes not found')
        }
      }
    },

    addEmptyStepToActivity: (state, action: PayloadAction<{ step: Step, activityId: number }>) =>{
      if (state.project.activities){
        const idx = state.project.activities.findIndex((activity)=> activity.id === action.payload.activityId)
        if (state.project.activities[idx].name !== ''){
          const steps = state.project.activities[idx].steps
          const emptySteps = steps.filter(step => step.name === '')
          if (emptySteps.length === 0){
            state.project.activities[idx].steps = [...steps, action.payload.step]
          }
        }
      }
    },
    removeStepfromActivity: (state, action: PayloadAction<{ stepId: number, activityId: number }>) =>{
      if (state.project.activities){
        const idx = state.project.activities.findIndex((activity)=> activity.id === action.payload.activityId)
        const steps = state.project.activities[idx].steps
        state.project.activities[idx].steps = steps.filter(step=>step.id !== action.payload.stepId)
      }
    },
    switchPositionOfStep: (state, action: PayloadAction<{ activityId: number, stepId1: number, stepId2: number }>) => {
      if (state.project.activities){
        const activityIdx = state.project.activities.findIndex(activity => activity.id === action.payload.activityId)
        const steps = state.project.activities[activityIdx].steps
        const stepIdx1 = steps.findIndex(step => step.id === action.payload.stepId1)
        const stepIdx2 = steps.findIndex(step => step.id === action.payload.stepId2)
        if (stepIdx1 >= 0 && stepIdx2 >= 0){
          const oldPosition1 = state.project.activities[activityIdx].steps[stepIdx1].position
          const oldPosition2 = state.project.activities[activityIdx].steps[stepIdx2].position
          state.project.activities[activityIdx].steps[stepIdx1].position = oldPosition2
          state.project.activities[activityIdx].steps[stepIdx2].position = oldPosition1
        } else {
          console.warn('step indexes not found')
        }
      }
    },
    assignStepToActivity: (state, action: PayloadAction<{ step: Step, oldActivityId: number }>) => {
      if (state.project.activities){
        const activityIdxOld = state.project.activities.findIndex(activity => activity.id === action.payload.oldActivityId)
        const activityIdxNew = state.project.activities.findIndex(activity => activity.id === action.payload.step.activityId)
        if (activityIdxOld >= 0 && activityIdxNew >= 0){
          const stepsOld = state.project.activities[activityIdxOld].steps
          const stepsNew = state.project.activities[activityIdxNew].steps
          const stepIdxOld = stepsOld.findIndex(step => step.id === action.payload.step.id)
          if (stepIdxOld >= 0){
            // remove
            state.project.activities[activityIdxOld].steps = stepsOld.filter(step=>step.id !== action.payload.step.id)
            // add
            state.project.activities[activityIdxNew].steps = [...stepsNew, action.payload.step]
          } else {
            console.warn('step indexes not found')
          }
        } else {
          console.warn('activity indexes not found')
        }
      }
    },


    addEmptyStoryToStep: (state, action: PayloadAction<{ story: Story, activityId: number  }>) =>{
      if (state.project.activities){
        const activityIdx = state.project.activities.findIndex((activity)=> activity.id === action.payload.activityId)
        const steps = state.project.activities[activityIdx].steps
        const emptySteps = steps.filter(step => step.name === '')
        if (emptySteps.length === 0) {
          const stepIdx = steps.findIndex((step) => step.id === action.payload.story.stepId)
          const stories = steps[stepIdx].stories
          const emptyStories = stories.filter(story => story.name === '')
          if (emptyStories.length === 0) {
            state.project.activities[activityIdx].steps[stepIdx].stories = [...stories, action.payload.story]
          }
        }
      }
    },
    removeStoryfromStep: (state, action: PayloadAction<{ storyId: number, stepId: number, activityId: number }>) =>{
      if (state.project.activities){
        const activityIdx = state.project.activities.findIndex((activity)=> activity.id === action.payload.activityId)
        const steps = state.project.activities[activityIdx].steps
        const stepIdx = steps.findIndex((step)=> step.id === action.payload.stepId)
        const stories = steps[stepIdx].stories
        state.project.activities[activityIdx].steps[stepIdx].stories = stories.filter(story=>story.id !== action.payload.storyId)
      }
    },
    switchPositionOfStory: (state, action: PayloadAction<{ activityId: number, stepId: number, storyId1: number, storyId2: number }>) => {
      if (state.project.activities){
        const activityIdx = state.project.activities.findIndex(activity => activity.id === action.payload.activityId)
        const steps = state.project.activities[activityIdx].steps
        const stepIdx = steps.findIndex(step => step.id === action.payload.stepId)
        const stories = steps[stepIdx].stories
        const storyIdx1 = stories.findIndex(story => story.id === action.payload.storyId1)
        const storyIdx2 = stories.findIndex(story => story.id === action.payload.storyId2)
        if (storyIdx1 >= 0 && storyIdx2 >= 0){
          const oldPosition1 = state.project.activities[activityIdx].steps[stepIdx].stories[storyIdx1].position
          const oldPosition2 = state.project.activities[activityIdx].steps[stepIdx].stories[storyIdx2].position
          state.project.activities[activityIdx].steps[stepIdx].stories[storyIdx1].position = oldPosition2
          state.project.activities[activityIdx].steps[stepIdx].stories[storyIdx2].position = oldPosition1
        } else {
          console.warn('story indexes not found')
        }
      }
    },
  },
})

export const {
    setOpenedProject,

    addEmptyActivityToProject,
    switchPositionOfActivity,
    removeActivityfromProject,

    addEmptyStepToActivity,
    removeStepfromActivity,
    switchPositionOfStep,
    assignStepToActivity,

    addEmptyStoryToStep,
    removeStoryfromStep,
    switchPositionOfStory
} = projectSlice.actions


export default projectSlice.reducer