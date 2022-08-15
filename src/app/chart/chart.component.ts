import { Component, OnInit } from '@angular/core';
import { BackendService } from '../service/backend.service';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  private sensorLocation: string;

  tempDataList: any[] = []
  humidDataList: any[] = []
  chartDataLabels: any[] = []

  // temp data
  tempData: any[] = [
    {
      data: this.tempDataList,
      label: 'Temperature(Fahrenheit)'
    }
  ];

  // humid data
  humidData: any[] = [
    {
      data: this.humidDataList,
      label: 'Humdity(%)'
    }
  ];

  dataLabels: any[] = this.chartDataLabels;


  public lineChartType: ChartType = "line";

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.backendService.getSensorChartData().subscribe(sensorData => this.buildList(sensorData))
    this.activatedRoute.queryParams.subscribe(params => {
      const sensorLocation = params['sensor'];
      console.log(sensorLocation);
      this.sensorLocation = sensorLocation;
    });
  }


  buildList(sensorData: any[]) {
    if (this.sensorLocation === "basement") {

    } else if (this.sensorLocation === "bedroom") {

    }

  }

}

