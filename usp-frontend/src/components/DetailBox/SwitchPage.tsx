import {
    SwitchPageButton,
    SwitchPageButtonInline,
    SwitchPageButtonText, SwitchPageTopBorder,
    SwitchPageWrapper, TopBorderSwichPageButton
} from "./DetailBox.styles";

interface Props{
    pageList: string[]
    activePage: string
    setActivePage: Function
}

export default function SwitchPage(props:Props){

    return(
        <SwitchPageWrapper>
            {
                props.pageList.map((page, idx) =>
                    <SwitchPageButton
                        key={idx}
                        $active={page === props.activePage}
                        $buttonCount={props.pageList.length}
                        onClick={()=>props.setActivePage(page)}
                    >
                        <SwitchPageButtonText
                            $active={page === props.activePage}
                        >{page}</SwitchPageButtonText>
                        <SwitchPageButtonInline
                            $active={page === props.activePage}
                            $buttonCount={props.pageList.length}
                        >{page !== props.activePage && <TopBorderSwichPageButton />}</SwitchPageButtonInline>
                    </SwitchPageButton>
                )
            }
        </SwitchPageWrapper>
    )
}