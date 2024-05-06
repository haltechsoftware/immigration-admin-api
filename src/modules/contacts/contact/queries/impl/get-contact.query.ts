import { Contact } from 'src/modules/contacts/entities/contacts';
import { IOffsetBasePaginate } from '../../../../../common/interface/pagination/pagination.interface';
export default class GetContactQuery {
    constructor(public readonly paginate: IOffsetBasePaginate<Contact>) {}
}