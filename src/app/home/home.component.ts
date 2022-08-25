import { Component, OnInit } from '@angular/core';
import { Room } from '../model/RoomData';
import { BackendService } from '../service/backend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  apiResult: Room[] = [];
  interval: number;
  basementTimeSince: string;
  bedroomTimeSince: string;

  constructor(private backendService: BackendService) {

  }

  ngOnInit(): void {
    this.backendService.getSensorData().subscribe(sensorData => this.buildList(sensorData))
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.refreshData();
    }, 300000); // 300000 ms = 5 minutes

    setInterval(() => {
      this.updateTimeSince();
    }, 1000); // 1 second
  }

  buildList(sensorData: any[]) {
    this.apiResult = [];
    var basement = new Room();

    basement.sensorName = "Basement Sensor"
    basement.temp = parseInt(sensorData['basementData']['temp']);
    basement.humid = parseInt(sensorData['basementData']['humid']);
    basement.lastUpdated = sensorData['basementData']['unixTime']
    basement.location = "basement";
    this.apiResult.push(basement);

    var bedroom = new Room();
    bedroom.sensorName = "Bedroom Sensor"
    bedroom.temp = parseInt(sensorData['bedroomData']['temp']);
    bedroom.humid = parseInt(sensorData['bedroomData']['humid']);
    bedroom.lastUpdated = sensorData['bedroomData']['unixTime'];
    bedroom.location = "bedroom";

    this.apiResult.push(bedroom);
  }

  refreshData() {
    this.backendService.getSensorData().subscribe(sensorData => this.buildList(sensorData))
  }

  updateTimeSince() {
    for (const Room of this.apiResult) {
      Room.lastUpdatedDisplay = this.timeSince(Room.lastUpdated);
    }
  }

  timeSince(date: number) {
    var now = Date.now();
    var seconds = Math.floor((now - date) / 1000);
    var intervalType;

    this.interval = Math.floor(seconds / 2592000);
    if (this.interval >= 1) {
      intervalType = 'month';
    } else {
      this.interval = Math.floor(seconds / 86400);
      if (this.interval >= 1) {
        intervalType = 'day';
      } else {
        this.interval = Math.floor(seconds / 3600);
        if (this.interval >= 1) {
          intervalType = "hour";
        } else {
          this.interval = Math.floor(seconds / 60);
          if (this.interval >= 1) {
            intervalType = "minute";
          } else {
            this.interval = seconds;
            intervalType = "second";
          }
        }
      }
    }

    if (this.interval > 1 || this.interval === 0) {
      intervalType += 's ago';
    } else if (this.interval == 1) {
      intervalType += ' ago';
    }

    return this.interval + ' ' + intervalType;
  }


}
