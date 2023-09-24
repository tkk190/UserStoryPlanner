import {StatusHistory as StatusHistoryInterface} from "../../models/project";
import {StatusHistoryWrapper, Table, Tr, Th, Td} from "./DetailBox.styles";

interface Props{
    statusHistory: StatusHistoryInterface[]
}

export default function StatusHistory(props:Props){

    return(
        <StatusHistoryWrapper>
            <Table>
                <thead>
                    <Tr>
                        <Th>DateTime</Th>
                        <Th>Old Status</Th>
                        <Th>New Status</Th>
                    </Tr>
                </thead>
                <tbody>
                    {
                        props.statusHistory.map((item, idx)=>
                            <Tr key={idx}>
                                <Td>{item.updated}</Td>
                                <Td>{item.statusOld}</Td>
                                <Td>{item.statusNew}</Td>
                            </Tr>
                        )
                    }
                </tbody>
            </Table>
        </StatusHistoryWrapper>
    )
}