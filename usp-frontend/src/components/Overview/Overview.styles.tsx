import styled from "styled-components";
import {StoryStatusType} from "../../models/types";
import {statusColors} from "../../models/statusColors";

export const Wrapper = styled.div`
  width: 100%;
  //background-color: var(--background);
  overflow-x: auto;
  overflow-y: auto;
  position: relative;
`

export const Header = styled.div`
  position: sticky;
  left: 0;
  margin-bottom: 6px;
  background-color: var(--secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
`


export const H2 = styled.h2`
  display: flex;
  align-items: center;
  padding: 0px 8px 6px;
  gap: 10px;
`
export const H1 = styled.h1`
  padding: 0px 8px 6px;
  cursor: pointer;
`
export const HeaderIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  &:hover{
    opacity: 0.5;
  }
`
export const Row = styled.div`
  display: flex;
  //&:last-child{
  //  position: absolute;
  //  bottom: 0;
  //}
  &:nth-last-child(2){
    flex-grow: 1;
  }
`
export const HeaderRowStyled = styled(Row)`
  background-color: var(--background);
  position: sticky;
  top: 0;
  z-index: 1;
`


export const Box = styled.div`
  //width: 150px;
  width: calc(150px - 24px);
  min-width: calc(150px - 24px);
  //height: 100px;
  height: calc(100px - 24px);
  border: 1px solid var(--primary);
  background-color: var(--background-light);
  box-shadow: 0 0 4px -1px var(--primary);
  margin: 4px;
  padding: 8px;
  user-select: none;
  cursor: pointer;
  position: relative;
  &:hover{
    box-shadow: 0 0 5px 0px var(--primary);
  }
`

interface StoryProps{
    $isDragging: boolean
    $isOver: boolean
    $isInDetails: boolean
    $isDone: boolean
}

export const StoryStyled = styled(Box)<StoryProps>`
    ${props=>props.$isDragging && `opacity: 0.5;`}
    ${p=>p.$isOver && `background-color: var(--accent);`}
    ${p=>p.$isInDetails && `background-color: var(--secondary)`}
    ${p=>p.$isDone && `opacity: 0.7;`}
  
  
`

interface StoryStatusLineProps{
    $status: StoryStatusType
}
export const StoryStatusLine = styled.div<StoryStatusLineProps>`
  border: 2px solid ${p=>statusColors[p.$status].primary};
  background-color: ${p=>statusColors[p.$status].secondary};
  height: 2px;
  border-radius: 2px;
  opacity: 0.5;
`

export const ActivityStyled = styled(Box)`
  background-color: var(--background-dark);
`

interface StepProps{
    $small: boolean
    $isDragging: boolean
    $isOver: boolean
}
export const StepStyled = styled(Box)<StepProps>`
  background-color: var(--background-dark);
  // ${p=>p.$small && `width: 132px`}
  ${props=>props.$isDragging && `opacity: 0.5;`}
  ${p=>p.$isOver && `background-color: var(--accent);`}
`

interface ReleaseProps{
    $done: boolean
}
export const Release = styled(Box)<ReleaseProps>`
  background-color: var(--background-dark);
  ${p=>p.$done && `height: 20px;`}
`



export const Placeholder = styled(Box)`
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`

interface ItemPlaceholderProps{
    $small?: boolean
}

export const ItemPlaceholder = styled(Placeholder)<ItemPlaceholderProps>`
    opacity: 0.3;
`

export const StoryPlaceholder = styled(ItemPlaceholder)<ItemPlaceholderProps>`
    ${p=>p.$small && `height: 20px;`}
`


export const ActivityPlaceholer = styled(ItemPlaceholder)`
`

export const StepPlaceholder = styled(ItemPlaceholder)<ItemPlaceholderProps>`
    ${p=>p.$small && `
        padding-left: 0;
        padding-right: 0;
        margin-left: -2px;
        width: 16px;
        min-width: 16px;
    `}
`

interface ActivityWrapperProps{
    $isDragging?: boolean
    $isOver?: boolean
}
export const ActivityWrapperStyled = styled.div<ActivityWrapperProps>`
  display: flex;
  flex-direction: column;
  ${p=>p.$isDragging && `opacity: 0.5;`}
  ${p=>p.$isOver && `background-color: var(--accent);`}
`

export const StepWrapperStyled = styled.div`
  display: flex;
`

interface StoryWrapperProps{
    $isOver: boolean
    $lastStep: boolean
}
export const StoryWrapperStyled = styled.div<StoryWrapperProps>`
  display: flex;
  flex-direction: column;
  ${p => p.$isOver && `background-color: var(--accent);`}
  ${p => p.$lastStep && `margin-right: 20px;`}
  // ${p => p.$lastStep && `background-color: blue`}
`

export const StoryPoints = styled.div`
  position: absolute;
  bottom: 4px;
  background-color: snow;
  border: 2px solid black;
  border-radius: 1px;
  padding: 2px;
  line-height: 13px;
`

export const StoryPointsActive = styled(StoryPoints)`
  left: 4px;

`
export const StoryPointsDone = styled(StoryPoints)`
  right: 4px;
  opacity: 0.4;
`

