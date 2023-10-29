import { Injectable } from '@angular/core';

/*
import { calendar_v3, google } from 'googleapis';
import { OAuth2Client, Credentials } from 'google-auth-library';
import Calendar = calendar_v3.Calendar;
import Schema$Event = calendar_v3.Schema$Event;
*/

//import { google } from 'googleapis';

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  // private readonly API_KEY = 'AIzaSyBvG_ojyd5n4c26fQD-PKK5cVhl__CHuGw';
  /*
  private readonly CLIENT_ID = 'Angular with WordpressAccess';
  private readonly DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  ];
  */
  //  private readonly SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';
  /*
private  auth: OAuth2Client = new google.auth.OAuth2({clientId:this.CLIENT_ID});
	
	);
const calendar: Calendar = google.calendar({ version: 'v3', auth });
const schemaEvent: Schema$Event = (await calendar.events.get({ calendarId, eventId })).data;
*/

  constructor() {
    //  this.testGooogle();
  }
  /*
  async testGooogle() {
    //this.auth.setCredentials(new ())
    console.log('loginto Google1');

    const auth = new google.auth.GoogleAuth({
      scopes: [this.SCOPES],
    });
    console.log(await auth.getClient());
    //const auth: Auth.GoogleAuth = new google.auth.GoogleAuth();
    const calendar = google.calendar({
      version: 'v3',
      auth,
    });
    console.log('loginto Google');
    const list = calendar.calendarList.get();
    console.log('loginto Google', list);
    /*
    gapi.load('client:auth2', () => {
      gapi.client
        .init({
          apiKey: this.API_KEY,
          clientId: this.CLIENT_ID,
          discoveryDocs: this.DISCOVERY_DOCS,
          scope: this.SCOPES,
        })
        .then(
          () => {
            // Authentication successful
            console.log('auth success');
          },
          (error: unknown) => {
            console.log('Google Error:', error);
            // Error occurred during authentication
          },
        );
    });
    */
  // }

  /*
  getEvents(calendarId: string): Promise<any> {
    return gapi.client.calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: 'startTime',
    });
  }
  */
}
