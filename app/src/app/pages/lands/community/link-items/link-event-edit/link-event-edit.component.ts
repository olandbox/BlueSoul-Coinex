import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';
import { DateRangeDialog } from '../../../dialogs/date-range-dialog/date-range-dialog';
import { EventDialog } from '../../../dialogs/event-dialog/event-dialog';
import { CommunityActionService } from '../../community-action.service';
import { CommunityApiService } from '../../community-api.service';
import { CommunityStoreService } from '../../community-store.service';
import { Link } from '../../community.model';

@Component({
  selector: 'app-link-event-edit',
  templateUrl: './link-event-edit.component.html',
  styleUrls: ['../../community.component.less', './link-event-edit.component.less']
})
export class LinkEventEditComponent implements OnInit {
  @Input() link: Link;
  baseLogo: string;

  constructor(
    public communityActionService: CommunityActionService, 
    private communityApiService: CommunityApiService,
    private communityStoreService: CommunityStoreService,
    private httpService: HttpService,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    this.getBaseLogo();
  }

  getBaseLogo() {
    this.httpService.configFromDatabase.subscribe(res => {
      const eventsData = JSON.parse(res.properties.events);
      this.baseLogo = eventsData.baseEvent.default.logo;
    })
  }


  openEventDialog(eventType: string) {
    const eventDialog = this.matDialog.open(EventDialog, {
      panelClass: 'recommend-dialog',
      width: 'calc(100vw - 30px)',
      maxWidth: '1110px',
      data: eventType
    })
    eventDialog.afterClosed().subscribe(result => {
      if (!result) {return}
      this.link.properties.type = result;
      this.link.properties.alias = this.link.properties.alias ? this.link.properties.alias : result;
      this.communityApiService.updateLink(this.link).subscribe((updateLink: Link) => {
        this.communityStoreService.replaceLink(this.link, updateLink)
        // link.actions.isChanging = false;
      }) 
    })
  }
  openDateDialog(dateType: 'start' | 'end') {
    const dateDialog = this.matDialog.open(DateRangeDialog, {
      panelClass: 'recommend-dialog',
      width: 'calc(100vw - 30px)',
      maxWidth: '1110px',
      data: {startDate: this.link.properties.startDate, endDate: this.link.properties.endDate, type: dateType}
    })

    dateDialog.afterClosed().subscribe(result => {
      if (!result) {return}
      if (dateType === 'start') {
        this.link.properties.startDate = new Date(result).valueOf().toString();
        if (new Date(this.link.properties.endDate).valueOf() < new Date(result).valueOf()) {
          this.link.properties.endDate = this.link.properties.startDate
        }
      }
      if (dateType === 'end') {
        this.link.properties.endDate = new Date(result).valueOf().toString();
      }
      this.communityApiService.updateLink(this.link).subscribe((updateLink: Link) => {
        this.communityStoreService.replaceLink(this.link, updateLink)

      }) 
    })
  }
}
