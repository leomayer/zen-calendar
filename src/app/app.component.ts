import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'zen-calendar';

  useConfigInterface: boolean = false;
  @ViewChild('configComponent', { read: ViewContainerRef })
  configComponent!: ViewContainerRef;

  constructor(private elementRef: ElementRef) {
    this.useConfigInterface = this.stringToBoolean(
      this.elementRef.nativeElement.getAttribute('useConfigInterface'),
    );
  }

  async ngOnInit(): Promise<void> {
    console.log('configSetting: ', this.useConfigInterface);
    if (this.useConfigInterface) {
      console.log('loading configSettings');
      const { CalConfigComponent } = await import(
        './calender-config/cal-config/cal-config.component'
      );
      this.configComponent.clear();
      this.configComponent.createComponent(CalConfigComponent);
    }
  }

  stringToBoolean(value: unknown) {
    return String(value) === '1' || String(value).toLowerCase() === 'true';
  }
}
