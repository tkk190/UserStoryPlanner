import { useAppSelector } from "../../app/hooks";
import {EmptySpace, H3, H3Input, H3InputWrapper, SaveWrapper, Wrapper} from "./DetailBox.styles";
import HeaderField from "./HeaderField";
import Status from "./Status";
import {ProjectStatusType} from "../../models/types";
import StatusHistory from "./StatusHistory";
import SwitchPage from "./SwitchPage";
import {useState} from "react";
import {useGetStatusHistoryProjectQuery} from "../../slices/apiStatusHistorySlice";
import {useChangeProjectMutation} from "../../slices/apiSlice";
import {Save} from "react-feather";

interface Props{
}


const statusList:ProjectStatusType[] = [
    'development',
    'active',
    'deactivated',
    'archived'
]
const pageList = ['Content', 'History']
export default function ProjectDetails(props:Props){
    const project = useAppSelector((state) => state.details.project)

    const [activePage, setActivePage] = useState<string>('Content')
    const {data} = useGetStatusHistoryProjectQuery(project.id)

    const [shortName, setShortName] = useState(project.shortName)
    const [editName, setEditName] = useState(false)

    const [changeProject] = useChangeProjectMutation()
    const handleSaveShortName = () => {
        changeProject({id: project.id, shortName: shortName})
        setEditName(false)
    }

    return(
        <Wrapper>
            <Status statusList={statusList} item={project} />
            <HeaderField item={project} />
            {
                activePage === 'Content' &&
                <EmptySpace>
                    {/*<H2Input></H2Input>*/}
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    value={shortName}*/}
                    {/*    onChange={e=>setShortName(e.target.value)}*/}
                    {/*    onKeyDown={e=>e.key === 'Enter' && handleSaveShortName()}*/}
                    {/*    maxLength={3}*/}
                    {/*/>*/}
                    {
                        editName
                            ?
                            <H3InputWrapper>
                                <H3Input
                                    onKeyDown={e => e.key === 'Enter' && handleSaveShortName()}
                                    onChange={(e)=>setShortName(e.target.value)}
                                    value={shortName}
                                    type="text"
                                    maxLength={3}
                                />
                                <SaveWrapper><Save onClick={handleSaveShortName} height={34} width={34} /></SaveWrapper>
                            </H3InputWrapper>
                            :
                            <H3
                                onClick={()=>setEditName(true)}
                            >{shortName.length === 0 ? 'Set Acronym' : `Acronym: ${shortName}`}</H3>
                    }
                </EmptySpace>
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