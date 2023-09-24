import { uspApi } from './apiSlice'
import {StatusHistory} from "../models/project";

const statusHistoryApi = uspApi.injectEndpoints({
  endpoints: (build) => ({
    getStatusHistoryProject: build.query<StatusHistory[], number>({
      query: (id) => `status_history/project/${id}`,
    }),
    getStatusHistoryRelease: build.query<StatusHistory[], number>({
      query: (id) => `status_history/release/${id}`,
    }),
    getStatusHistoryActivity: build.query<StatusHistory[], number>({
      query: (id) => `status_history/activity/${id}`,
    }),
    getStatusHistoryStep: build.query<StatusHistory[], number>({
      query: (id) => `status_history/step/${id}`,
    }),
    getStatusHistoryStory: build.query<StatusHistory[], number>({
      query: (id) => `status_history/story/${id}`,
    }),
  }),
  overrideExisting: false,
})



export const {
    useGetStatusHistoryProjectQuery,
    useGetStatusHistoryReleaseQuery,
    useGetStatusHistoryActivityQuery,
    useGetStatusHistoryStepQuery,
    useGetStatusHistoryStoryQuery
} = statusHistoryApi