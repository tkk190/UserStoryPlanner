import {DetailsButton, NewReleaseWrapper} from "./DetailBox.styles";
import {Release} from "../../models/project";
import {
    useAddNewReleaseMutation,
    useCheckPossibleReleaseVersionsQuery
} from "../../slices/apiSlice";
import {useAppSelector} from "../../app/hooks";

interface Props{
    release: Release
}


export default function NewReleases(props:Props){
    const release = props.release
    const readwrite = useAppSelector((state) => state.login.readwrite)
    const currentProject = useAppSelector((state) => state.project.project)
    const {data} = useCheckPossibleReleaseVersionsQuery(release.id)
    const [addNewRelease] = useAddNewReleaseMutation()


    return(
        <NewReleaseWrapper>
            {
                !!data && data.map(newRelease =>
                    <DetailsButton
                        key={newRelease.version}
                        onClick={() => readwrite === 'write' && addNewRelease({id: release.id, type: newRelease.type, projectId: currentProject.id})}
                        $disabled={readwrite !== 'write'}
                    >
                        {newRelease.type} ({newRelease.version})
                    </DetailsButton>)
            }
        </NewReleaseWrapper>

    )
}