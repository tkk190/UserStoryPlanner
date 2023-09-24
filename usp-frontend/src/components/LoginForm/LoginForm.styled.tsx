import styled from "styled-components";
import {H2InputWrapper} from "../DetailBox/DetailBox.styles";
import exp from "constants";

export const LoginFormWrapper = styled.form`
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 400px;
  height: 260px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid gray;
  border-radius: 4px;
  padding: 16px;
  background-color: var(--primary-light);
  box-shadow: 0px 0px 4px 2px var(--background-dark);
  user-select: none;
`

export const LogoutWrapper = styled.div`
  position: absolute;
  left: 7px;
  top: 7px;
  z-index: 1;
  padding: 2px;
  border: 2px solid black;
  border-radius: 4px;
  line-height: 0.5rem;
  &:hover{
    opacity: 0.5;    
    cursor: pointer;
  }
`

export const CredentialInput = styled.input`
  font-size: 1.3rem;
  width: 250px;
  border-style: solid;
  border-radius: 3px;
  padding: 3px 4px;
`

export const CredentialLabel = styled.label`
  width: min-content;
  &:last-of-type{
    margin-bottom: 34px;
  }
`

export const CredentialButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  justify-content: space-evenly;
`
export const CredentialButton = styled.button`
  font-size: 1.3rem;
  width: 100%;
  background-color: var(--secondary);
  box-shadow: 0 0 6px -1px var(--accent);
  border: 1px solid var(--background-dark);
  border-radius: 4px;
  padding: 6px;
  &:hover{
    cursor: pointer;
    opacity: 0.75;
  }
  
`

export const LoginButton = styled(CredentialButton)`
  background-color: var(--accent);
  box-shadow: 0 0 5px -3px var(--secondary), 0 0 6px -1px var(--accent);
  &:hover{
    opacity: 0.9;
  }
  margin-bottom: 6px;
`