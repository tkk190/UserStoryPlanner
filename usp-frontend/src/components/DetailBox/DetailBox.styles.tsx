import styled from "styled-components";
import { statusColors } from "../../models/statusColors";
import {
    ActivityStatusType,
    ProjectStatusType,
    ReleaseStatusType,
    StepStatusType,
    StoryStatusType
} from "../../models/types"

export const Wrapper = styled.div`
  min-width: 500px;
  background-color: var(--secondary);
  padding: 10px;
  height: calc(100vh - 60px);
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
`



interface StatusProps{
    $status: StoryStatusType | ReleaseStatusType | StepStatusType | ActivityStatusType | ProjectStatusType
}

export const StatusLine = styled.div<StatusProps>`
  width: calc(100% - 12px);
  display: flex;
  
  border: 3px solid ${p=>statusColors[p.$status].primary};
  background-color: ${p=>statusColors[p.$status].secondary};
  height: 2px;
  border-radius: 3px;
  user-select: none;
`
export const StatusDisplay = styled.div`
  display: flex;
  justify-content: right;
  width: calc(100% - 16px);
  min-height: 22px;
  height: 22px;
  user-select: none;
  position: relative;
`
interface StatusDisplayTextProps extends StatusProps{
    $disabled: boolean

}
export const StatusDisplayText = styled.div<StatusDisplayTextProps>`
  color: ${p=>statusColors[p.$status].primary};
  width: fit-content;  
  ${p=>!p.$disabled && `cursor: pointer;`}
`
export const StatusOptionList = styled.div`
  position: absolute;
  top: 22px;
  right: -4px;
  z-index: 9;
  display: grid;
  width: fit-content;
  height: fit-content;
  background-color: white;
  box-shadow: 1px 2px 10px -4px black;
  border-radius: 2px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
`
export const StatusOption = styled.ul<StatusProps>`
  color: ${p=>statusColors[p.$status].primary};
  text-align: right;
  padding: 1px 4px 1px 30px;
  height: 20px;
  line-height: 16px;
  margin: 0;
  cursor: pointer;
  user-select: none;
  background-color: hsla(${p=>statusColors[p.$status].secondary_hsl_value}, 60%);
  &:hover{
    background-color: hsla(${p=>statusColors[p.$status].secondary_hsl_value}, 100%);
  }
`

export const H2 = styled.h2`
  margin-bottom: 24px;
`

export const H2InputWrapper = styled.div`
  display: flex;
`
export const H2Input = styled.input`
  margin-bottom: 24px;
  font-size: 1.5em;
`
export const H3 = styled.h3`
  margin-bottom: 24px;
  cursor: pointer;
`

export const H3InputWrapper = styled.div`
  display: flex;
`
export const H3Input = styled.input`
  margin-bottom: 24px;
  font-size: 1.5em;
  width: 60px;
`
export const SaveWrapper = styled.div`
  width: 34px;
  height: 34px;
  &:hover{
    opacity: 0.5;
    cursor: pointer;
  }
`

export const StoryPointWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  gap: 8px;
  margin-bottom: 20px;
`
export const NewReleaseWrapper = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: 8px;
  margin-bottom: 20px;
`

interface DetailsButtonProps {
    $disabled: boolean
}
export const DetailsButton = styled.div<DetailsButtonProps>`
  border: 2px solid gray;
  border-radius: 8px;
  user-select: none;
  background-color: whitesmoke;
  height: 34px;
  font-size: 1.6rem;
  text-align: center;
  line-height: 2rem;
  box-shadow: inset 0px 0px 2px darkgray, 0px 0px 2px darkgray;
  position: relative;
  cursor: pointer;
  &:after {
      --tap-increment: -8px;
      content: '';
      position: absolute;
      top: var(--tap-increment);
      left: var(--tap-increment);
      right: var(--tap-increment);
      bottom: var(--tap-increment);
  }
  ${p=>p.$disabled && `
    cursor: inherit;
    opacity: 0.5;
  `}
`
interface StoryPointButtonProps {
    $checked: boolean
    $disabled: boolean
}
export const StoryPointButton = styled(DetailsButton)<StoryPointButtonProps>`
  width: 34px;
  ${p => (p.$checked || p.$disabled) && `cursor: inherit;`}
  
  ${p => p.$checked && `
      background-color: lightgray;
      box-shadow: inset 0px 0px 4px darkgray;
  `}
  
  ${p => p.$disabled && `opacity: 0.5;`}
`
interface TextFieldWrapperProps {
    $childCount: number
}
export const TextFieldWrapper = styled.div<TextFieldWrapperProps>`
  flex-grow: 1;
  display: grid;
  margin: 10px 0;
  max-height: calc(100% - 150px);
  grid-template-rows: repeat(${p=>p.$childCount}, 1fr) ;
  gap: 16px;
`

interface TextFieldProps{
  $opened: boolean
  $height?: string
}
export const TextFieldStyled = styled.div<TextFieldProps>`
  padding: 2px;
  border: 2px dotted gray;
  overflow: auto;
  ${p=>p.$opened && `min-height: 350px;`};
`

export const Textarea = styled.textarea`
  width: calc(100% - 14px);
  height: 120px;
  margin: 2px 4px;
`


export const EmptySpace = styled.div`
  flex-grow: 1;
`
export const StatusHistoryWrapper = styled.div`
  flex-grow: 1;
`

export const Table = styled.table`
  border: 1px solid;
  border-collapse: collapse;
  width: 100%
`

export const Tr = styled.tr`
  border: 1px solid;
`

export const Th = styled.th`
  border: 1px solid;
  padding: 2px 10px;
`

export const Td = styled.td`
  border: 1px solid;
  padding: 2px 10px;
  text-align: center;
`

export const SwitchPageWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: -29px;
`

export const SwitchPageTopBorder = styled.div`
  background-color: lightgray;
  height: 0;
  border-top: 2px solid gray;
  border-bottom: 2px solid gray;
  &:hover{
    min-height: 2px;
  }
  cursor: col-resize;
  user-select: none;
  z-index: 4;
`

interface SwitchPageProps{
    $active: boolean
}
interface SwitchPageButtonProps extends SwitchPageProps{
    $buttonCount: number
}
export const SwitchPageButton = styled.div<SwitchPageButtonProps>`
  cursor: pointer;
  width: calc(calc(500px / ${p=>p.$buttonCount} ) - 80px);
  
  border-top:  28px solid gray;
  border-right: 28px solid transparent;
  border-left: 28px solid transparent;
  z-index: 2;
  margin-right: -50px;
  position: relative;
  
  ${p=>p.$active && `
      border-top:  28px solid gray;
      background-color: transparent;
      z-index: 3;
  `}
  
  height: 0;
  //margin: auto;
  //display: inline-block;
`

export const SwitchPageButtonInline = styled(SwitchPageButton)<SwitchPageProps>`
  scale: 0.97;
  //border-top: 28px solid gray;
  //border-top-color: gray;
  top: -50px;
  left: -28px;
  //z-index: 1;
  border-top-color: var(--primary);
  
  
    ${p=>p.$active && `
      border-top-color: var(--secondary);
      top: -51px;
    `}
    ${p=>p.$active ? `
        z-index: 5;
    ` : `
        z-index: 3;
    `}
  
`

export const TopBorderSwichPageButton = styled.div`
  background-color: gray;
  height: 2px;
  position: absolute;
  z-index: 5;
  top: -28px;
  width: calc(100% + 56px);
  left: -28px;
`

export const SwitchPageButtonText = styled.div<SwitchPageProps>`
  position: relative;
  text-align: center;
  top: -25px;
  z-index: 6;
  user-select: none;
`
