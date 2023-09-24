import styled from "styled-components";

interface WrapperProps {
    $navigationIsOpened: boolean
}

export const Wrapper = styled.div<WrapperProps>`
  min-width: ${p => p.$navigationIsOpened ? `260` : `40`}px;
  background-color: var(--secondary);
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: scroll;
  &::-webkit-scrollbar{
    display: none;
  }
`

export const H2 = styled.h2`
  text-align: center;
  margin: 4px 0 12px;
`

export const NewProjectButton = styled.button`
  width: calc(100% - 12px);
  height: 32px;
  margin: 8px 6px 8px;
  border-radius: 4px;
  border: 1px solid gray;
  background-color: ghostwhite;
  cursor: pointer;
`

interface IconWrapperProps{
    $showIconState: boolean
    $state?: boolean
}

const IconWrapper = styled.div<IconWrapperProps>`
  display: none;
  position: absolute;
  cursor: pointer;
  top: 12px;
  &:hover{
    color: gray;
  }
  transition: opacity 500ms;
  opacity: 0.1;
  ${props => props.$state && `display: inline;`}
  ${p => p.$showIconState && `
    display: inline;
    opacity: 1;
  `}
`
interface ProjectButtonWrapperProps{
    $activeProject?: boolean
    $navigationIsOpened: boolean
}
export const ProjectButtonWrapper = styled.div<ProjectButtonWrapperProps>`
  width: 100%;
  cursor: pointer;
  height: fit-content;
  background-color: ghostwhite;
  border-bottom: 1px solid gray;
  box-shadow: none;
  position: relative;
  line-height: 28px;
  ${p=>p.$navigationIsOpened ? `
      &:last-child{
        margin-top: 8px;
        border-bottom: none;
      }
      &:nth-last-child(2) {
        border-bottom: none;
      }
  
  ` : `
      &:last-child{
        border-bottom: none;
      }
  `}
  &:first-of-type{
    margin-top: 0.667px;
  }
  ${p => p.$activeProject && `
    box-shadow: inset 0px 0px 4px gray; 
    &:last-child{
      border-bottom: 1px solid gray;
    }
    &:first-of-type{
      border-top: 1px solid gray;
      margin-top: 0px;
    }
  `}
  &:hover{
    box-shadow: inset 0px 0px 2px gray;
  }
`

interface SetProjectButtonProps {
    $showIconState: boolean
    $disabled: boolean
}
export const SetProjectButton = styled.div<SetProjectButtonProps>`
  cursor: pointer;
  padding: 8px 0;
  height: 32px;
  line-height: inherit;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  
  ${p => p.$showIconState && `
    width: calc(100% - 80px);
    margin: 0 40px;
    border-left: 1px solid gray;
    border-right: 1px solid gray;
  `}
  ${p=>p.$disabled && `cursor: initial;`}
  

`

export const LeftIcon = styled(IconWrapper)`
  left: 8px;
`

export const RightIcon = styled(IconWrapper)`
  right: 8px;

`

export const EditProjectInput = styled.input`
  line-height: 28px;
  width: 120px;
  padding: 0 10px;
  transition: opacity 500ms;
  opacity: 0.4;
  &:hover{
    opacity: 1;
  }
  &:focus{
    opacity: 1;
  }
  
`