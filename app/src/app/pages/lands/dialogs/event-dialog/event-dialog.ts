import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { HttpService } from "src/app/service/http.service";
import { CommunityApiService } from "../../community/community-api.service";
import { CommunityStoreService } from "../../community/community-store.service";
import { EventTypes, CustomEvent } from "../../community/community.model";

@Component({
    selector: 'event-dialog',
    styleUrls: ['./event-dialog.less'],
    templateUrl: 'event-dialog.html',
  })
  export class EventDialog implements OnDestroy{
  
    loading: boolean = true;
    adding: boolean = false;
    eventTypes: EventTypes = {
      custom: [],
      default: []
    }

    eventsSub?: Subscription;
  

    constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      public dialogRef: MatDialogRef<EventDialog>,
      private httpService: HttpService,
      private communityApiService: CommunityApiService,
      private communityStoreService: CommunityStoreService
    ) {

      this.eventsSub = this.communityApiService.getEventType().subscribe((eventTypes: EventTypes) => {
        this.loading = false;
        this.eventTypes = eventTypes;
      })

    }

    ngOnDestroy(): void {
      this.eventsSub.unsubscribe();
    }

   

    addEvent() {
      this.adding = true;
      this.communityApiService.addEventType('Event').subscribe((res: CustomEvent) => {
        if (res.id) {
          this.eventTypes.custom.push(res)
        }
        this.adding = false;
      })
    }

    delEvent(custom: CustomEvent) {
      custom.actions.saving = true;
      this.communityApiService.deleteEventType(custom).subscribe(res => {
        this.eventTypes.custom = this.eventTypes.custom.filter((c: CustomEvent) => c.id !== custom.id)
      })
    }

    editEvent(custom: CustomEvent) {
      custom.actions.editing = true;
    }
    saveCustom(custom: CustomEvent, value: string) {
      const v = value.trim();
      if (custom.properties.alias === value) {
        custom.actions.valid = true;
        custom.actions.editing = false;
        custom.actions.saving = false;
        return;
      }

      const isValid = this.validCustom(v);
      if (!isValid) {
        custom.actions.valid = false;
        return;
      }
      
      custom.actions.valid = true;
      custom.actions.editing = false;
      custom.actions.saving = true;

      this.communityApiService.addEventType(v, custom.id).subscribe(res => {
        this.eventTypes.custom = this.eventTypes.custom.map((c: CustomEvent) => {
          if (c.id === custom.id) {
            c = res;
          }
          return c;
        });
        custom.actions.saving = false;
      })
    }
    validCustom(value: string) {
      if (value === '') {
        return false;
      }
      let events: string[] = [...this.eventTypes.default];
      this.eventTypes.custom.forEach((c: CustomEvent) => {
        events.push(c.properties.alias);
      })

      return events.includes(value) ? false : true;
    }
  
    close() {
      this.dialogRef.close()
    }
  }