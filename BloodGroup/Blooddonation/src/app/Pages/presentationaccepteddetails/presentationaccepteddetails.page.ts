import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-presentationaccepteddetails',
  templateUrl: './presentationaccepteddetails.page.html',
  styleUrls: ['./presentationaccepteddetails.page.scss'],
})
export class PresentationaccepteddetailsPage implements OnInit {
  presentationId: any;
  acceptedParticipants: any[] = [];
  filteredParticipants: any[] = [];
  searchTerm: string = '';
  activeAccordion: number | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private general: GeneralService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.presentationId = params['presentationId'];
      if (this.presentationId) {
        this.fetchAcceptedDetails();
      }
    });
  }

  fetchAcceptedDetails() {
    this.isLoading = true;
    this.general.present();
    
    const formData = new FormData();
    formData.append('Param1', this.presentationId);
    
    const url = 'api/BG/Get_PresentationAccetedDetails';
    this.general.PostData(url, formData).subscribe(
      (data: any) => {
        this.acceptedParticipants = Array.isArray(data) ? data : [];
        this.filteredParticipants = [...this.acceptedParticipants];
        this.general.dismiss();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching participant details:', error);
        this.general.dismiss();
        this.isLoading = false;
        this.general.presentToast('Failed to load participant details');
      }
    );
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredParticipants = [...this.acceptedParticipants];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredParticipants = this.acceptedParticipants.filter(p => 
        p.FullName && p.FullName.toLowerCase().includes(term)
      );
    }
    this.activeAccordion = null; // Close any open accordion on search
  }

  toggleAccordion(index: number) {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  open1(state: number) {
    if (this.activeAccordion === state) {
      this.activeAccordion = null;
    }
  }

  goBack() {
    this.navCtrl.back();
  }

  makeCall(phoneNumber: string) {
    if (phoneNumber) {
      // Using window.location.href is the standard way to trigger the native phone dialer in mobile applications
      window.location.href = `tel:${phoneNumber}`;
    }
  }

  openWhatsApp(phoneNumber: string) {
    if (phoneNumber) {
      const formattedPhone = phoneNumber.replace(/\D/g, '');
      // Using the whatsapp:// protocol to ensure the native WhatsApp application is opened directly
      const url = `whatsapp://send?phone=91${formattedPhone}`;
      window.open(url, '_system');
    }
  }
}
