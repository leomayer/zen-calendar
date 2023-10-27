import {
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zen-calendar';

  protected useConfigInterface: boolean = false;
  @ViewChild('configComponent', { read: ViewContainerRef })
  configComponent!: ViewContainerRef;

  constructor(private elementRef: ElementRef) {
    this.useConfigInterface = this.stringToBoolean(
      this.elementRef.nativeElement.getAttribute('useConfigInterface'),
    );
  }

  stringToBoolean(value: unknown) {
    return (
      !!value &&
      (String(value) === '1' || String(value).toLowerCase() === 'true')
    );
  }
}
