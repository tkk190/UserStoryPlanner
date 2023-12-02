import {ActivityStatusType, ProjectStatusType, ReleaseStatusType, StepStatusType, StoryStatusType} from "./types";

export interface Project {
    id: number
    name: string
    shortName: string
    status: ProjectStatusType
    ideas?: string
}
export interface FullProject extends Project{
    releases: Release[]
    activities?: Activity[]
}

export interface ChangeProject {
    id: number
    name?: string
    shortName?: string
    status?: string
}

export interface Story{
    id: number
    name: string
    position: string
    status: StoryStatusType
    release?: Release
    releaseId?: number
    stepId?: number
    storyPoints: number
    description: string
    definitionOfDone: string
    definitionOfReady: string
    releaseText: string
}
export interface ChangeStory{
    id: number
    name?: string
    position?: string
    status?: StoryStatusType
    release?: Release
    releaseId?: number
    stepId?: number
    storyPoints?: number
    description?: string
    definitionOfDone?: string
    definitionOfReady?: string
    releaseText?: string
    projectId?: number
}
export interface NewStory{
    id?: number
    name: string
    stepId: number
    releaseId?: number
    position?: string
    status?: string
    projectId?: number
}
export interface PositionSwitch{
    id: number,
    position: string,
}
export interface Step{
    id: number
    name: string
    position: string
    stories: Story[]
    activityId?: number
    status: StepStatusType
    projectId?: number
    ideas?: string
}
export interface ChangeStep{
    id: number
    name?: string
    status?: StepStatusType
    projectId?: number
}

export interface Release{
    id: number
    name: string
    status: ReleaseStatusType
}
export interface ChangeRelease{
    id: number
    name?: string
    status?: ReleaseStatusType
    projectId?: number
}

export interface Activity{
    id: number
    name: string
    position: string
    status: ActivityStatusType
    projectId: number
    steps: Step[]
    ideas?: string
}


export interface ChangeActivity{
    id: number
    name?: string
    status?: ActivityStatusType
    projectId?: number
}




export interface StatusHistory{
    statusOld: string
    statusNew: string
    updated: number
}