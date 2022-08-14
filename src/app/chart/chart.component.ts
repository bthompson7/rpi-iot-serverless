import { Component, OnInit } from '@angular/core';
import { BackendService } from '../service/backend.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  constructor(private backendService: BackendService) {

  }

  ngOnInit(): void {
    this.backendService.getSensorChartData().subscribe(sensorData => this.buildList(sensorData))

  }


  buildList(sensorData: any[]) {

  }

}
