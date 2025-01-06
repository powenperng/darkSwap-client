import { BaseDto } from "src/common/dto/base.dto";


export class TakerConfirmDto extends BaseDto {
    orderId: string;
    swapMessage: string;
}