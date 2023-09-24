import {
    ActivityPlaceholer,
    ActivityWrapperStyled,
    Placeholder,
    HeaderRowStyled
} from "../Overview.styles";
import {
    FullProject,
    Activity as ActivityInterface
} from "../../../models/project";
import {comparePosition, createRandomId} from "../../../utils/utils";
import {Plus} from "react-feather";
import {addEmptyActivityToProject} from "../../../slices/projectSlice";
import {useMemo} from "react";
import {useAppDispatch, useAppSelector} from "../../../app/hooks";
import Activity from "./Activity/Activity";
import {setActivity, setRelease, unsetDetails} from "../../../slices/detailsSlice";

interface Props{
    project: FullProject
}

export default function OverviewHeader(props:Props){
    const dispatch = useAppDispatch()
    const project = props.project
    const readwrite = useAppSelector((state) => state.login.readwrite)

    const handleNewActivity = () =>{
        dispatch(unsetDetails())
        if (!!project.activities){
            const newActivity:ActivityInterface = {
                id: createRandomId(),
                name: '',
                steps: [],
                position: 'zzz',
                status: 'active',
                projectId: -1
            }
            dispatch(addEmptyActivityToProject(newActivity))
        }
    }


    let activities:ActivityInterface[] = []
    if (!!project.activities){
        activities = [...project.activities]
        activities.sort(comparePosition)
    }

    return(
        <HeaderRowStyled  id={'OverviewHeader'}>
            <Placeholder />
            {activities.map((activity)=> <Activity key={activity.id} activity={activity} />)}
            {
                readwrite === 'write' &&
                <ActivityWrapperStyled>
                    <ActivityPlaceholer
                        onClick={handleNewActivity}
                    ><Plus/></ActivityPlaceholer>
                </ActivityWrapperStyled>
            }
        </HeaderRowStyled>
    )
}