import { QueryServiceDtoType } from "../../dtos/query-service.dto";

export class GetAllToClientServiceQuery {
     constructor(public readonly query: QueryServiceDtoType) {}
}