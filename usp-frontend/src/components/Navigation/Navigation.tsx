import {H2, NewProjectButton, Wrapper} from "./Navigation.styles";
import { useGetProjectsQuery} from "../../slices/apiSlice";
import { useEffect, useState } from "react";
import { Project } from "../../models/project";
import ProjectButton from "./ProjectButton/ProjectButton";


interface Props{
    navigationIsOpened: boolean
}

export default function Navigation(props:Props){
    const [projects, setProjects] = useState<Project[]>([])
    const [newProjectState, setNewProjectState] = useState(false)
    const {
        data,
        isFetching,
        isSuccess,
      } = useGetProjectsQuery()

    useEffect(()=>{
        !!data && setProjects(data)
    }, [isSuccess, isFetching, data])



    return(
        <Wrapper $navigationIsOpened={props.navigationIsOpened}>
            <H2>Projects</H2>
            {
                projects.map((project)=> <ProjectButton key={project.id} project={project} navigationIsOpened={props.navigationIsOpened}/>)
            }
            {
                props.navigationIsOpened &&
                <>
                    {/*<NewProjectButton onClick={()=>setNewProjectState(!newProjectState)}>new</NewProjectButton>*/}
                    {/*{newProjectState &&*/}
                        <ProjectButton
                            key={0}
                            project={{name: "", id: 0, status: "development", shortName: ''}}
                            editProject={true}
                            setNewProjectState={setNewProjectState}
                            navigationIsOpened={props.navigationIsOpened}
                        />
                    {/*}*/}
                </>
            }

        </Wrapper>
    )
}