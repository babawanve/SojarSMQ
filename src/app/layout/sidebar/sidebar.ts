import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  @Input() isCollapsed: boolean = false;
  openSections: { [key: string]: boolean } = {};

  toggle(section: string) {
    // If we click to open while collapsed, optionally expand it first (handled via dashboard generally).
    if (this.isCollapsed) return;
    this.openSections[section] = !this.openSections[section];
  }

  isOpen(section: string): boolean {
    return !!this.openSections[section] && !this.isCollapsed;
  }
}
