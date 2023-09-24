import { useAppSelector } from "../../app/hooks";
import {SwitchPageTopBorder, Wrapper} from "./DetailBox.styles";
import HeaderField from "./HeaderField";
import Status from "./Status";
import StoryPoints from "./StoryPoints";
import StoryTextFields from "./StoryTextFields";
import {ActivityStatusType, ReleaseStatusType, StoryStatusType} from "../../models/types";
import {useAddNewReleaseMutation, useCheckPossibleReleaseVersionsQuery} from "../../slices/apiSlice";
import NewReleases from "./NewReleases";
import ReleaseTextFields from "./ReleaseTextFields";
import {useState} from "react";
import StatusHistory from "./StatusHistory";
import {useGetStatusHistoryReleaseQuery} from "../../slices/apiStatusHistorySlice";
import SwitchPage from "./SwitchPage";

interface Props{
}


const statusList:ReleaseStatusType[] = [
    'opened',
    'running',
    'testing',
    'releasing',
    'done',
    'archived'
]
const pageList = ['Content', 'History']

export default function ReleaseDetails(props:Props){
    const release = useAppSelector((state) => state.details.release)

    const [activePage, setActivePage] = useState<string>('Content')
    const {data} = useGetStatusHistoryReleaseQuery(release.id)

    return(
        <Wrapper>
            {release.name !== 'not planned' && <Status statusList={statusList} item={release} />}
            <HeaderField item={release} />
            {
                (activePage === 'Content' && release.name !== 'not planned') &&
                <>
                    <NewReleases release={release}/>
                    <ReleaseTextFields release={release}/>
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
