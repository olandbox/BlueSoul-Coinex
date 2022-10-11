import { Component, Inject, Input } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "src/app/service/http.service";
import { CommunityActionService } from "../../community/community-action.service";

@Component({
    selector: 'date-range-dialog',
    styleUrls: ['date-range-dialog.less'],
    templateUrl: 'date-range-dialog.html',
  })
  export class DateRangeDialog {

  
    events: string[];
    currentDate = this.communityActionService.toIsoString(new Date());
    maxDate = this.communityActionService.toIsoString(new Date(new Date().valueOf() + (10 * 365 * 24 * 60 * 60 * 1000)));
    minDate = this.currentDate;

    startDate;
    endDate;
  
    constructor(
      public dialogRef: MatDialogRef<DateRangeDialog>,
      private communityActionService: CommunityActionService,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      if (data.startDate) {this.startDate = this.communityActionService.toIsoString(new Date(+data.startDate))} 
      if (data.endDate) {this.endDate =  this.communityActionService.toIsoString(new Date(+data.endDate))} 
    }

   
    close() {
      this.dialogRef.close()
    }
  }