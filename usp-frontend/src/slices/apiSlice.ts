import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Activity, ChangeActivity, ChangeProject, ChangeRelease,
  ChangeStep,
  ChangeStory,
  FullProject,
  NewStory,
  PositionSwitch,
  Project, Release,
  Step,
  Story
} from "../models/project";
import {baseQueryWithReauth} from "./reAuth";


export const uspApi = createApi({
  reducerPath: 'uspApi',
  // baseQuery: fetchBaseQuery({ baseUrl: api_url }),
  baseQuery: baseQueryWithReauth,
  tagTypes: ['projects', 'overview', 'newReleases'],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => `project/overview`,
      providesTags: ['projects'],
    }),
    getProjectById: builder.query<FullProject, number>({
      query: (id) => `project/overview/${id}`,
      // providesTags: ['overview'],
      providesTags: (result, error, arg) =>{
        console.log('p-result', result)
        console.log('p-error', error)
        console.log('p-arg', arg)
        return (
             !!result
               ? [{ type: 'overview' as const, id: result.id }, 'overview']
               : ['overview']
        )
      },
    }),
    createProject: builder.mutation<Project, string>({
      query: (name) => ({
        url: `project/${name}`,
        method: 'POST'
      }),
      invalidatesTags : ['projects'],
    }),
    deleteProject: builder.mutation<void, number>({
      query: (id) => ({
        url: `project/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags : ['projects'],
    }),
    renameProject: builder.mutation<Project, Project>({
      query: (data) => ({
        url: `project`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags : (result, error, arg) => ['projects', { type: 'overview', id: arg.id }],
    }),

    createActivity: builder.mutation<Activity, {projectId: number, name: string}>({
      query: (data) => ({
        url: `activity/${data.projectId}`,
        method: 'POST',
        body: {name: data.name}
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    deleteActivity:  builder.mutation<Activity, {activityId: number, projectId: number}>({
      query: (data) => ({
        url: `activity/${data.activityId}`,
        method: 'DELETE',
      }),
      // invalidatesTags : ['overview'],
      invalidatesTags: (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),

    createStep: builder.mutation<Step, {activityId: number, name: string, projectId: number}>({
      query: (data) => ({
        url: `step/${data.activityId}`,
        method: 'POST',
        body: {name: data.name}
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    deleteStep:  builder.mutation<void, {stepId: number, projectId: number}>({
      query: (data) => ({
        url: `step/${data.stepId}`,
        method: 'DELETE',
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),

    createStory: builder.mutation<Story, NewStory>({
      query: (data) => ({
        url: `story`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    deleteStory:  builder.mutation<void, {storyId: number, projectId: number}>({
      query: (data) => ({
        url: `story/${data.storyId}`,
        method: 'DELETE',
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    changeStory: builder.mutation<Story, ChangeStory>({
            query: (data) => ({
        url: `story`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    changeProject: builder.mutation<Project, ChangeProject>({
      query: (data) => ({
        url: `project`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.id }, 'projects'],
    }),
    changeStep: builder.mutation<Step, ChangeStep>({
      query: (data) => ({
        url: `step`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    changeActivity: builder.mutation<Activity, ChangeActivity>({
      query: (data) => ({
        url: `activity`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    changeRelease: builder.mutation<Release, ChangeRelease>({
      query: (data) => ({
        url: `release`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    deleteRelease:  builder.mutation<void, {releaseId: number, projectId: number}>({
      query: (data) => ({
        url: `release/${data.releaseId}`,
        method: 'DELETE',
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    checkPossibleReleaseVersions: builder.query<{ type: string, version: string }[], number>({
      query: (id) => `release/check_possible_versions/${id}`,
      providesTags: ['newReleases'],
    }),
    addNewRelease: builder.mutation<void, {id: number, type: string, projectId: number}>({
      query: ({id, type}) => ({
        url: `release/${id}/${type}`,
        method: 'POST',
      }),
      invalidatesTags : (result, error, arg) => ['newReleases', { type: 'overview', id: arg.projectId }],
    }),
    getReleaseNotes: builder.query<string, number>({
      query: (id) => `release/notes/${id}`,
    }),

    switchActivityPosition: builder.mutation<void, PositionSwitch[]>({
      query: (data) => ({
        url: `activity/switch`,
        method: 'PATCH',
        body: data
      }),
    }),
    switchStepPosition: builder.mutation<void, PositionSwitch[]>({
      query: (data) => ({
        url: `step/switch`,
        method: 'PATCH',
        body: data
      }),
    }),
    setStepToActivity: builder.mutation<void, Step>({
      query: (data) => ({
        url: `step`,
        method: 'PATCH',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    switchStoryPosition: builder.mutation<void, PositionSwitch[]>({
      query: (data) => ({
        url: `story/switch`,
        method: 'PATCH',
        body: data
      }),
    }),

    addProjectIdeas: builder.mutation<void, {projectId: number, id: number, content: string}>({
      query: (data) => ({
        url: `project/ideas`,
        method: 'POST',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    addActivityIdeas: builder.mutation<void, {projectId: number, id: number, content: string}>({
      query: (data) => ({
        url: `activity/ideas`,
        method: 'POST',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),
    addStepIdeas: builder.mutation<void, {projectId: number, id: number, content: string}>({
      query: (data) => ({
        url: `step/ideas`,
        method: 'POST',
        body: data
      }),
      invalidatesTags : (result, error, arg) => [{ type: 'overview', id: arg.projectId }],
    }),


  }),
})


export const {
    useGetProjectsQuery,
    useLazyGetProjectByIdQuery,
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useRenameProjectMutation,
    useChangeStoryMutation,
    useChangeActivityMutation,
    useChangeReleaseMutation,
    useChangeStepMutation,
    useChangeProjectMutation,
    useCreateStoryMutation,
    useCreateActivityMutation,
    useCreateStepMutation,
    useSwitchActivityPositionMutation,
    useSwitchStepPositionMutation,
    useSetStepToActivityMutation,
    useSwitchStoryPositionMutation,
    useDeleteActivityMutation,
    useDeleteReleaseMutation,
    useDeleteStepMutation,
    useDeleteStoryMutation,
    useCheckPossibleReleaseVersionsQuery,
    useAddNewReleaseMutation,
    useGetReleaseNotesQuery,
    useAddProjectIdeasMutation,
    useAddActivityIdeasMutation,
    useAddStepIdeasMutation
} = uspApi