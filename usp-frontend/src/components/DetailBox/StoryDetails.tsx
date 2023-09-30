import { useAppSelector } from "../../app/hooks";
import { Wrapper } from "./DetailBox.styles";
import HeaderField from "./HeaderField";
import Status from "./Status";
import StoryPoints from "./StoryPoints";
import StoryTextFields from "./StoryTextFields";
import { StoryStatusType } from "../../models/types";
import StatusHistory from "./StatusHistory";
import SwitchPage from "./SwitchPage";
import {useState} from "react";
import {useGetStatusHistoryStoryQuery} from "../../slices/apiStatusHistorySlice";

interface Props{
}


const statusList:StoryStatusType[] = [
    "",
    "created",
    "planned",
    "exporting",
    "exported",
    "started",
    "done",
    "archived"
]
const pageList = ['Content', 'History']
export default function StoryDetails(props:Props){
    const story = useAppSelector((state) => state.details.story)
    const [activePage, setActivePage] = useState<string>('Content')
    const {data} = useGetStatusHistoryStoryQuery(story.id)

    return(
        <Wrapper>
            <Status statusList={statusList} item={story} />
            <HeaderField item={story} />
            {
                activePage === 'Content' &&
                <>
                    <StoryPoints story={story} />
                    <StoryTextFields story={story} />
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