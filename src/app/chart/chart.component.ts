import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BackendService } from '../service/backend.service';
import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  sensorLocation: string;
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  pageTitle: string
  tempDataList: any[] = []
  humidDataList: any[] = []
  chartDataLabels: any[] = []
  invalidSensorError = false;
  validRoutes: string[] = ['basement', 'bedroom'];
  dataLabels: any[] = this.chartDataLabels;
  public chartType: ChartType = "line";

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

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const sensorLocation = params['sensor'];
      this.sensorLocation = sensorLocation;
    });

    if (this.validRoutes.includes(this.sensorLocation)) {
      this.backendService.getSensorChartData().subscribe(sensorData => this.buildList(sensorData))
    } else {
      this.invalidSensorError = true;
    }

  }

  buildList(sensorData: any[]) {
    if (this.sensorLocation === "basement") {
      this.pageTitle = "Basement";
      for (let i = 0; i < sensorData['basementData'].length; i++) {
        let obj = sensorData['basementData'][i];
        this.tempDataList.push(parseInt(obj.temp));
        this.humidDataList.push(parseInt(obj.humid));
        this.chartDataLabels.push(obj.normalTime);
      }
    } else if (this.sensorLocation === "bedroom") {
      this.pageTitle = "Bedroom";
      for (let i = 0; i < sensorData['bedroomData'].length; i++) {
        let obj = sensorData['bedroomData'][i];
        this.tempDataList.push(parseInt(obj.temp));
        this.humidDataList.push(parseInt(obj.humid));
        this.chartDataLabels.push(obj.normalTime);
      }
    }

    // update each chart with the api data
    this.charts.forEach((child) => {
      child.update()
    });
  }
}

