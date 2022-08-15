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
  show = false;

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
  public chartType: ChartType = "line";

  constructor(private backendService: BackendService, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const sensorLocation = params['sensor'];
      console.log(sensorLocation);
      this.sensorLocation = sensorLocation;
    });

    this.backendService.getSensorChartData().subscribe(sensorData => this.buildList(sensorData))
  }

  buildList(sensorData: any[]) {
    if (this.sensorLocation === "basement") {
      this.pageTitle = "Basement";
      for (let i = 0; i < sensorData['data']['basementChartData'].length; i++) {
        let obj = sensorData['data']['basementChartData'][i];

        this.tempDataList.push(obj.temp);
        this.humidDataList.push(obj.humd);
        this.chartDataLabels.push(obj.date);
      }
    } else if (this.sensorLocation === "bedroom") {
      this.pageTitle = "Bedroom";
      for (let i = 0; i < sensorData['data']['bedroomChartData'].length; i++) {
        let obj = sensorData['data']['bedroomChartData'][i];

        this.tempDataList.push(obj.temp);
        this.humidDataList.push(obj.humd);
        this.chartDataLabels.push(obj.date);
      }
    } else {
      this.show = true;
    }

    // update each chart with the api data
    this.charts.forEach((child) => {
      child.update()
    });
  }
}

