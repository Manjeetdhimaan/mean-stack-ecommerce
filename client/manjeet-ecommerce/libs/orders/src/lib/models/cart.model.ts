export class Cart {
  constructor( public items: CartItem[] ) {}
}

export class CartItem {
  constructor( public productId: string, public quantity: number ) {}
}
