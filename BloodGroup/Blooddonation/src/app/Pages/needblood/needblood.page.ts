import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-needblood',
  templateUrl: './needblood.page.html',
  styleUrls: ['./needblood.page.scss'],
})
export class NeedbloodPage implements OnInit {
  constructor(private general: GeneralService) {
  }

  ngOnInit() {
  }

}
