import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css'],
})
export class GroupComponent implements OnInit {
  groupName: string = '';
  channelName: string = '';
  selectedGroupId: number | null = null;
  groups: {
    id: number;
    name: string;
    channels: { id: number; name: string }[];
  }[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.groupService.getGroups().subscribe((groups) => {
      this.groups = groups;
    });
  }

  // Method to load groups and update the view
  loadGroups(): void {
    this.groupService.getGroups().subscribe((groups) => {
      this.groups = groups;
    });
  }

  onCreateGroup(): void {
    if (this.groupName.trim()) {
      this.groupService.createGroup(this.groupName);
      this.groupName = '';
      this.loadGroups();
    } else {
      alert('Please enter a valid group name.');
    }
  }

  onCreateChannel(): void {
    if (this.selectedGroupId) {
      if (this.channelName.trim()) {
        console.log('hehehe');
        console.log(this);
        this.groupService.createChannel(this.channelName, this.selectedGroupId);
        this.channelName = '';
        this.loadGroups();
      } else {
        alert('Please enter a valid channel name.');
      }
    } else {
      alert('Please select a group first.');
    }
  }

  onRemoveGroup(groupId: number): void {
    this.groupService.removeGroup(groupId);
    this.loadGroups(); // Reload groups to reflect the removal
  }

  onRemoveChannel(groupId: number, channelId: number): void {
    this.groupService.removeChannel(groupId, channelId);
    this.loadGroups(); // Reload groups to reflect the removal
  }

  onBanUserFromChannel(groupId: number, channelId: number): void {
    const userId = 1; // Example: assuming user ID 1 is to be banned
    alert(`User ${userId} has been banned from channel ${channelId}.`);
  }
}
