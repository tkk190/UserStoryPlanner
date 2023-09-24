import styled from 'styled-components'


export const AppWrapper = styled.div`
    display: flex;
    min-height: 100%;
    height: min-content;
    width: 100%;
    position: relative;
    background-color: var(--background);
    z-index: 1;
`

export const ClickableBorderChild = styled.div<ClickableBorderProps>`
  position: absolute;
  
  top: calc(100% - 2px);
  left:-2px;
  
  //bottom: 38px;

  
  background-color: lightgray;
  height: 0;
  border-top: 2px solid gray;
  border-bottom: 2px solid gray;
  border-left: 2px solid gray;
  //border-top-width: 50px;
  
  &:hover{
    min-height: 2px;
  }
  cursor: row-resize;
  user-select: none;
  width: 522px;
  z-index: -1;
  
`


interface ClickableBorderProps{
    $small?: boolean
}
export const ClickableBorder = styled.div<ClickableBorderProps>`
  background-color: lightgray;
  width: 0;
  border-left: 2px solid gray;
  border-right: 2px solid gray;
  &:hover{
    min-width: 2px;
  }
  &:hover ${ClickableBorderChild}{
    min-height: 2px;
    width: 524px;
  }
  cursor: col-resize;
  user-select: none;
  ${p=>p.$small && `height: calc(100vh - 38px);`}
  position: relative;
  
  //height: calc(100% + 2px);
  
`
