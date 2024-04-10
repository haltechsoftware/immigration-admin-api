import { UpdateVisaCategoryType } from "../../dto/update-visa_category.dto";

export class UpdateVisaCategoryCommand {
    constructor(
      public readonly id: number,
      public readonly input: UpdateVisaCategoryType,
    ) {}
  }