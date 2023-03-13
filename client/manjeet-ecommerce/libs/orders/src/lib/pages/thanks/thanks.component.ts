import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'orders-thanks',
  templateUrl: './thanks.component.html',
  styles: [],
})
export class ThanksComponent implements OnInit {

  constructor( private orderService: OrderService, private messageService: MessageService) {}

  ngOnInit(): void {
      const sesionId = localStorage.getItem('sessionOrderId');
      if(sesionId) {
        const parsedSessionID = JSON.parse(sesionId);
        this.orderService.confirmOrder(parsedSessionID).subscribe(res => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: res['message'] });
          localStorage.removeItem('sessionOrderId');
        }, err => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: err.error['message'] });
        })
      }
  }
}
