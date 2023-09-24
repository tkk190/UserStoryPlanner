import styled from "styled-components";
import {Box} from "../Overview.styles";

interface NewItemStyledProps{
    itemType: 'activity' | 'step' | 'story'
}
export const NewItemStyled = styled(Box)<NewItemStyledProps>`
  opacity: 0.3;
  position: relative;
  ${p=>p.itemType === 'step' && `width: 132px;`}
`

export const NewItemInput = styled.input`
  width: calc(100% - 8px);
`

const NewItemIcon = styled.div`
  position: absolute;
  bottom: 10px;
  &:hover{
    opacity: 0.7;
  }
`

export const NewItemIconRight = styled(NewItemIcon)`
  right: 10px;
`

export const NewItemIconLeft = styled(NewItemIcon)`
  left: 10px;
`
