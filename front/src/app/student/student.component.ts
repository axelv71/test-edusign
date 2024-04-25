import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import SignaturePad from "signature_pad";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit{
  studentId= '';
  student: any = {};
  signaturePad: SignaturePad | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
      const canvas = document.querySelector("canvas");
      this.signaturePad = new SignaturePad(canvas as HTMLCanvasElement, {
          backgroundColor: 'rgb(0,0,0)',
          penColor: 'rgb(255, 255, 255)'
      });

        this.initData();
  }

  initData() {
      this.route.paramMap.subscribe(params => {
          this.studentId = params.get('id') ?? '';

          fetch(`http://localhost:3001/students/${this.studentId}`)
              .then(response => response.json())
              .then(data => {
                  this.student = data;

                  if (this.student.signature) {
                      this.signaturePad?.fromDataURL(this.student.signature)
                  } else {
                      this.signaturePad?.clear();
                  }
              });
      });
  }

  sign() {
    const base64 = this.signaturePad?.toDataURL();

    fetch(`http://localhost:3001/students/${this.studentId}/sign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ signature: base64 })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        this.initData()
    });
  }

  markAsAbsent() {
    fetch(`http://localhost:3001/students/${this.studentId}/absent`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        this.signaturePad?.clear();
        this.initData()
    });
  }
}
