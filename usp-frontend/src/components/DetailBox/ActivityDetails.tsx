import { useAppSelector } from "../../app/hooks";
import {EmptySpace, Wrapper} from "./DetailBox.styles";
import HeaderField from "./HeaderField";
import Status from "./Status";
import {ActivityStatusType} from "../../models/types";
import StatusHistory from "./StatusHistory";
import SwitchPage from "./SwitchPage";
import {useState} from "react";
import { useGetStatusHistoryActivityQuery } from "../../slices/apiStatusHistorySlice";
import NewIdeasField from "./NewIdeasField";

interface Props{
}


const statusList:ActivityStatusType[] = [
    "active",
    "done",
    "archived"
]
const pageList = ['Content', 'History']
export default function ActivityDetails(props:Props){
    const activity = useAppSelector((state) => state.details.activity)

    const [activePage, setActivePage] = useState<string>('Content')
    const {data} = useGetStatusHistoryActivityQuery(activity.id)

    return(
        <Wrapper>
            <Status statusList={statusList} item={activity} />
            <HeaderField item={activity} />
            {
                activePage === 'Content' &&
                <>
                    <NewIdeasField
                        type={'activity'}
                        currentIdeas={!!activity.ideas ? activity.ideas : ''}
                        currentId={activity.id}
                    />
                </>
            }
            {
                activePage === 'History' &&
                <>
                    <StatusHistory statusHistory={!!data ? data : []}/>
                </>
            }
            <SwitchPage
                pageList={pageList}
                activePage={activePage}
                setActivePage={setActivePage}
            />

        </Wrapper>
    )
}