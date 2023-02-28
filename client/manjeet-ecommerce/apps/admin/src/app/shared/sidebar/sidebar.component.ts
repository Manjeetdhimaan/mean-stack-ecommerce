import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Output() closeMenuEmitter = new EventEmitter();

  closeMenu(){
    this.closeMenuEmitter.emit(null)
  }
}
