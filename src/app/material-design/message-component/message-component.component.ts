import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { MessageData } from './messageData';

@Component({
	selector: 'app-message-component',
	template: '<span>NotUsed</span>',
})
export class MessageComponentComponent {
	constructor(private snackBar: MatSnackBar) {}

	displayMessage(data: MessageData): MatSnackBarRef<MessageDisplayComponent> {
		return this.snackBar.openFromComponent(MessageDisplayComponent, {
			panelClass: 'msg-snack',
			duration: 5000,
			data,
		});
	}
}
@Component({
	selector: 'app-message-component-display',
	templateUrl: './message-component.component.html',
	styleUrls: ['./message-component.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class MessageDisplayComponent {
	constructor(@Inject(MAT_SNACK_BAR_DATA) public data: MessageData) {}
}
