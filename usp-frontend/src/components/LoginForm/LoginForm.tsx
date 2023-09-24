import {useCreateUserMutation, useGetTokenMutation, useResetPasswordMutation} from "../../slices/apiLoginSlice";
import {
    CredentialButton,
    CredentialButtonWrapper,
    CredentialInput, CredentialLabel, LoginButton,
    LoginFormWrapper,
    LogoutWrapper
} from "./LoginForm.styled";
import {useForm} from "react-hook-form";
import {useCookies} from "react-cookie";
import {LogOut} from "react-feather";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setNoRight} from "../../slices/loginSlice";

interface Props {
    loggedIn: boolean
}


export default function LoginForm(props:Props){
    const dispatch = useAppDispatch()
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const [getToken, getTokenResult] = useGetTokenMutation()
    const [createUser, createUserResult] = useCreateUserMutation()
    const [resetPassword, resetPasswordResult] = useResetPasswordMutation()
    const [cookies, setCookie, removeCookie] = useCookies(['access_token_content', 'refresh_token_content'])

    const { register, handleSubmit } = useForm();

    const handleRemoveCookies = ()=>{
        removeCookie('access_token_content')
        removeCookie('refresh_token_content')
        dispatch(setNoRight())
        window.location.reload()
    }

    return(
        <>
            {!props.loggedIn ?
                <LoginFormWrapper>
                    <CredentialLabel>
                        User:
                        <CredentialInput
                            type="text"
                            placeholder={'user'}
                            {...register("username")}
                        />
                    </CredentialLabel>
                    <CredentialLabel>
                        Password:
                        <CredentialInput
                            type="password"
                            placeholder={'password'}
                            {...register("password")}
                        />
                    </CredentialLabel>
                    <LoginButton onClick={handleSubmit(getToken)}>login</LoginButton>
                    <CredentialButtonWrapper>
                        <CredentialButton onClick={handleSubmit(resetPassword)}>forgot password</CredentialButton>
                        <CredentialButton onClick={handleSubmit(createUser)}>register</CredentialButton>
                    </CredentialButtonWrapper>
                </LoginFormWrapper>
                :
                <>
                    <LogoutWrapper>
                        <LogOut onClick={handleRemoveCookies} />
                    </LogoutWrapper>
                </>
            }
        </>
    )
}