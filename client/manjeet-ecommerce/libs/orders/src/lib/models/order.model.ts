import { User } from "@manjeet-ecommerce/users"
import { OrderItem } from "./order-item.model"

export class Order {
  constructor(
    public _id: string,
    public orderItems: OrderItem[],
    public address: {
      shippingAddress1: string,
      shippingAddress2: string,
      city: string,
      zip: string,
      country: string,
      phone: string | number
    },
    public currency: string,
    public status: string,
    public totalPrice: number,
    public user: User,
    public dateOrdered: string,
    public id?: string
  ) { }
}
