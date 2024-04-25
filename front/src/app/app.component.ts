import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'edusign-test';
  students = [];

    constructor() {
        fetch('http://localhost:3001/students')
        .then(response => response.json())
        .then(data => {
            this.students = data;
        });
    }
}
