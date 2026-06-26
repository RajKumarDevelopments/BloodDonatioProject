import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-requestaccepteddetails',
  templateUrl: './requestaccepteddetails.page.html',
  styleUrls: ['./requestaccepteddetails.page.scss'],
})
export class RequestaccepteddetailsPage implements OnInit {
  BloodRequestedId: any;
  BloodAcceptedDetalis: any[] = [];
  filteredParticipants: any[] = [];
  searchTerm: string = '';
  activeAccordion: number | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    public general: GeneralService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.BloodRequestedId = params['BloodRequestedId'];
      if (this.BloodRequestedId) {
        this.GetAcceptedUsers(this.BloodRequestedId);
      }
    });
  }

  GetAcceptedUsers(Val: any) {
    this.isLoading = true;
    this.general.present();

    var UploadFile = new FormData();
    UploadFile.append("Param1", Val);
    UploadFile.append("Param2", '1');
    var url = "api/BG/BloodAcceptedUser";
    this.general.PostData(url, UploadFile).subscribe(
      (data: any) => {
        this.BloodAcceptedDetalis = Array.isArray(data) ? data : [];
        this.filteredParticipants = [...this.BloodAcceptedDetalis];
        this.general.dismiss();
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error fetching participant details:', error);
        this.general.dismiss();
        this.isLoading = false;
        this.general.presentToast('Failed to load participant details');
      }
    );
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredParticipants = [...this.BloodAcceptedDetalis];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredParticipants = this.BloodAcceptedDetalis.filter(p => 
        p.FullName && p.FullName.toLowerCase().includes(term)
      );
    }
    this.activeAccordion = null;
  }

  formatAddress(person: any): string {
    const parts = [
      person.Address, 
      person.Area, 
      person.RegCity, 
      person.RegDistrict, 
      person.RegState
    ].filter(p => p && p.toString().trim() !== '');
    
    let addr = parts.join(', ');
    if (person.RegPin && person.RegPin.toString().trim() !== '') {
      addr += (addr ? ' - ' : '') + person.RegPin;
    }
    return addr;
  }

  goBack() {
    this.navCtrl.back();
  }

  makeCall(phoneNumber: string) {
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  }

  openWhatsApp(phoneNumber: string) {
    if (phoneNumber) {
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      const url = `whatsapp://send?phone=91${formattedPhone}`;
      window.open(url, '_system');
    }
  }
}
