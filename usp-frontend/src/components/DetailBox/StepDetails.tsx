import { useAppSelector } from "../../app/hooks";
import {EmptySpace, Wrapper} from "./DetailBox.styles";
import HeaderField from "./HeaderField";
import Status from "./Status";
import {StepStatusType} from "../../models/types";
import StatusHistory from "./StatusHistory";
import SwitchPage from "./SwitchPage";
import {useState} from "react";
import {useGetStatusHistoryStepQuery} from "../../slices/apiStatusHistorySlice";
import NewIdeasField from "./NewIdeasField";

interface Props{
}


const statusList:StepStatusType[] = [
    "active",
    "done",
    "archived"
]
const pageList = ['Content', 'History']
export default function StepDetails(props:Props){
    const step = useAppSelector((state) => state.details.step)
    const [activePage, setActivePage] = useState<string>('Content')
    const {data} = useGetStatusHistoryStepQuery(step.id)

    return(
        <Wrapper>
            <Status statusList={statusList} item={step} />
            <HeaderField item={step} />
            {
                activePage === 'Content' &&
                <>
                    <NewIdeasField
                        type={'step'}
                        currentIdeas={!!step.ideas ? step.ideas : ''}
                        currentId={step.id}
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