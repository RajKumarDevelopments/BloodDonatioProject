import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-donorguide',
  templateUrl: './donorguide.page.html',
  styleUrls: ['./donorguide.page.scss'],
})
export class DonorguidePage implements OnInit {
  UserDetails1: any; UserDetails: any;
  isClosed: boolean = false;
  items = []; EligibilityCriteria: any;
  selectedId: any; accordionState: any;
  guidequestions: any; faqs: any;
  openIndex: number = -1; myval: any; closeid: any;
  isMoreClicked: boolean = false; // Flag to control "More" content visibility
  isMore: boolean = false; // Initialize as closed
  mystring: any;
  TypesofDonations: any; Mythfacts: any; BloodDonationProcess: any; ComponentsBlood: any;
  constructor(public navCtrl: NavController, public activeRoute: ActivatedRoute, ) {

    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.mystring = this.activeRoute.snapshot.paramMap.get("string");

    if (this.mystring == 'ComponentsBlood') {
      this.myval = 'ComponentsBlood'

    } else if (this.mystring == 'TypesofDonations') {

      this.myval = 'TypesofDonations'
    }
    else if (this.mystring == 'BloodDonationProcess') {
      this.myval = 'BloodDonationProcess'

    }
    else if (this.mystring == 'Mythfacts') {
      this.myval = 'Mythfacts'

    }
    else if (this.mystring == 'EligibilityCriteria') {
      this.myval = 'EligibilityCriteria'

    } else if (this.mystring == 'Donatetypes') {
      this.myval = 'Donatetypes'

    }

    this.ComponentsBlood = [
      {
        question: '1. What are Red Blood Cells (RBCs)?',
        answer: 'Red Blood Cells (RBCs) are cells that carry oxygen from your lungs to the rest of your body and return carbon dioxide back to the lungs to be exhaled.',
        open: false
      },
      {
        question: '2. What is the function of Red Blood Cells?',
        answer: 'RBCs carry oxygen from the lungs to the body and transport carbon dioxide back to the lungs for exhalation.',
        open: false
      },
      {
        question: '3. Why are Red Blood Cells important?',
        answer: 'They are used for patients with severe blood loss, anaemia, or during surgery.',
        open: false
      },
      {
        question: '4. What is the lifespan of Red Blood Cells in the body?',
        answer: 'RBCs have a lifespan of about 120 days in the body.',
        open: false
      },
      {
        question: '5. What are White Blood Cells (WBCs)?',
        answer: 'White Blood Cells (WBCs) are cells that fight infections by attacking bacteria, viruses, and other foreign invaders in the body.',
        open: false
      },
      {
        question: '6. What is the function of White Blood Cells?',
        answer: 'WBCs attack and destroy bacteria, viruses, and other foreign invaders to protect the body from infections.',
        open: false
      },
      {
        question: '7. Why are White Blood Cells important?',
        answer: 'They are a critical component of the immune system, though not commonly transfused except in very specific cases.',
        open: false
      },
      {
        question: '8. What is the lifespan of White Blood Cells in the body?',
        answer: 'WBCs have a lifespan ranging from a few hours to a few days.',
        open: false
      },
      {
        question: '9. What are Platelets?',
        answer: 'Platelets are small cell fragments that help blood clot and stop bleeding.',
        open: false
      },
      {
        question: '10. What is the function of Platelets?',
        answer: 'Platelets assist in blood clotting to prevent excessive bleeding.',
        open: false
      },
      {
        question: '11. Why are Platelets important?',
        answer: 'They are essential for cancer patients, those undergoing surgeries, and people with blood disorders.',
        open: false
      },
      {
        question: '12. What is the lifespan of Platelets in the body?',
        answer: 'Platelets have a lifespan of 7-10 days in the body.',
        open: false
      },
      {
        question: '13. What is Plasma?',
        answer: 'Plasma is the liquid portion of blood that transports water, salts, and proteins throughout the body.',
        open: false
      },
      {
        question: '14. What is the function of Plasma?',
        answer: 'Plasma transports water, salts, and proteins, playing a crucial role in maintaining blood volume and pressure.',
        open: false
      },
      {
        question: '15. Why is Plasma important?',
        answer: 'Plasma is used to treat burn victims, trauma patients, and individuals with clotting disorders.',
        open: false
      },
      {
        question: '16. What is the composition of Plasma?',
        answer: 'Plasma is about 90% water and 10% proteins, hormones, and salts.',
        open: false
      },
      {
        question: '17. What is the lifespan of Plasma in the body?',
        answer: 'Plasma itself is renewed constantly, but transfused plasma can be stored for up to a year when frozen.',
        open: false
      },
      {
        question: '18. What are Plasma Proteins?',
        answer: 'Plasma proteins are key proteins in the plasma that have specific functions in maintaining health.',
        open: false
      },
      {
        question: '19. What are the key types of Plasma Proteins?',
        answer: 'Key plasma proteins include Albumin (maintains blood pressure and volume), Fibrinogen (helps blood to clot), and Globulins (play a role in the immune system and fighting infections).',
        open: false
      }];


    this.TypesofDonations = [
      {
        question: '#1 What is Whole Blood Donation?',
        answer: 'Whole blood is the most flexible type of donation. It can be transfused in its original form, or used to help multiple people when separated into its specific components of red cells, plasma, and platelets. Whole blood is frequently given to trauma patients and people undergoing surgery. The donation takes about 1 hour. All blood types can donate, and donations can be made every 56 days, up to 6 times a year.',
        open: false
      },
      {
        question: '#2 What is Platelet Donation?',
        answer: 'Platelets are tiny cells in the blood that help form clots and stop bleeding. During platelet donation, a machine collects platelets and some plasma, returning most of the blood back to the donor. Platelet donations are vital for cancer patients, organ transplants, and surgeries. It takes about 2.5 to 3 hours. Ideal blood types for platelet donation include A positive, A negative, B positive, O positive, AB positive, and AB negative. You can donate platelets every 7 days, up to 24 times a year.',
        open: false
      },
      {
        question: '#3 What is Plasma Donation?',
        answer: 'Plasma is the liquid part of your blood that carries nutrients, hormones, and proteins. Plasma donations are collected through an automated process that separates plasma from other blood components and returns red blood cells and platelets to the donor. Plasma is used in emergency and trauma situations to stop bleeding. It takes about 1 hour and 15 minutes, and AB plasma can be given to anyone regardless of blood type. Donations can be made every 28 days, up to 13 times a year.',
        open: false
      },
      {
        question: '#4 What is Power Red Donation?',
        answer: 'Power Red donation involves giving a concentrated dose of red blood cells, which are essential for carrying oxygen throughout the body. This type of donation uses an automated process to separate red blood cells from other blood components, safely returning your plasma and platelets. Power Red donations are typically given to trauma patients, newborns, people with sickle cell anemia, and those experiencing blood loss. It takes about 1.5 hours. Ideal blood types include O positive, O negative, A negative, and B negative. You can donate every 112 days, up to 3 times a year.',
        open: false
      }
    ];



    this.BloodDonationProcess = [

      {
        question: '#1 Where does the blood donation process start?',
        answer: 'Through this app, donors can connect directly with those in need, bypassing traditional blood banks. The process involves:\n1. Hospital Visit: The matched donor goes directly to the hospital where the recipient is being treated.\n2. Donation: The donor provides blood at the hospital for direct use by the patient.',
        open: false
      },
      {
        question: '#2 What should I do before donating blood?',
        answer: 'To ensure a smooth and safe donation process, here’s what you need to do before donating blood:\n1. Eligibility Check: Ensure you meet the eligibility criteria (age, weight, health status). The app may provide a quiz for this.\n2. Hydrate: Drink plenty of water or fluids 24 hours before donating.\n3. Eat a Healthy Meal: Consume iron-rich foods such as spinach, red meat, or beans.\n4. Avoid Fatty Foods: Fatty foods can affect blood tests used for safety checks.\n5. Get Enough Sleep: Be well-rested before donation.\n6. Bring Necessary Identification: Bring a government ID or your app-based donor profile.',
        open: false
      },
      {
        question: '#3 What happens during the blood donation process?',
        answer: 'Here’s what to expect during the donation:\n1. Registration: Upon arrival, you will be registered, and your identity will be verified.\n2. Health Check: A medical professional will check your vitals, such as blood pressure, pulse, and hemoglobin levels to ensure you’re fit to donate.\n3. Donation Process: The donation itself takes about 8-10 minutes. You will be comfortably seated, and blood will be drawn from your arm, typically around 1 pint (470 ml).\n4. Relax and Stay Calm: It is important to relax during the process to ensure a smooth flow of blood.',
        open: false
      },
      {
        question: '#4 What should I do after donating blood?',
        answer: 'After donating blood, follow these steps for recovery:\n1. Rest for a Few Minutes: Stay seated for 15 minutes post-donation, and enjoy a snack and drink to help replenish fluids.\n2. Stay Hydrated: Drink water for the next 24-48 hours to maintain fluid balance.\n3. Eat Nutritious Food: Consume an iron-rich meal to restore energy.\n4. Avoid Strenuous Activity: Refrain from heavy exercise or lifting for the remainder of the day.\n5. Watch for Side Effects: Mild dizziness is normal; sit or lie down if you feel faint. If symptoms persist, seek medical help.',
        open: false
      },
      {
        question: '#5 What happens to the blood after donation?',
        answer: 'After your donation, the blood undergoes the following steps:\n1. Testing: Blood is tested for type and screened for infections to ensure safety.\n2. Separation: Blood is separated into components (red cells, plasma, platelets), each serving different patient needs.\n3. Direct Usage: Since the donation happens at the hospital, your blood may be used immediately for the recipient.\n4. Storage: If not used right away, red blood cells can be stored for up to 42 days, while plasma can be frozen and stored for up to a year.',
        open: false
      }
    ];


    this.Mythfacts = [
      {
        question: '#1 Is donating blood painful?',
        answer: 'Donating blood is relatively painless. You might feel a slight pinch when the needle is inserted, but most people find it to be a quick and tolerable experience. Many donors report that it is much easier than expected.',
        open: false
      },
      {
        question: '#2 Can you get sick from donating blood?',
        answer: 'Donating blood is a safe procedure. All equipment used is sterile, and each needle is used only once. You cannot catch any diseases from donating blood.',
        open: false
      },
      {
        question: '#3 Do I have enough blood to donate?',
        answer: 'The average adult has about 10-12 pints of blood, and a typical donation is only about one pint. Your body replenishes the lost blood within a few days.',
        open: false
      },
      {
        question: '#4 Can I donate blood if I have a chronic illness like diabetes?',
        answer: 'People with well-managed chronic conditions, such as diabetes, are often eligible to donate. However, it’s important to check with a doctor before donating.',
        open: false
      },
      {
        question: '#5 Does blood donation take too much time?',
        answer: 'The actual blood donation process takes only about 10 minutes. With registration, screening, and recovery, the total process usually takes less than an hour.',
        open: false
      },
      {
        question: '#6 Can I only donate blood once a year?',
        answer: 'You can donate whole blood every 56 days, up to six times a year.',
        open: false
      },
      {
        question: '#7 Will frequent blood donation weaken my body?',
        answer: 'A healthy person can donate blood up to four times a year without any adverse effects. Platelet donors can donate even more frequently—every 7 to 14 days, up to 24 times a year.',
        open: false
      },
      {
        question: '#8 Do blood banks have enough blood?',
        answer: 'The belief that blood banks have enough blood is false. Due to the limited shelf life of blood and the small number of regular donors, maintaining sufficient supplies is a constant challenge. More volunteers are urgently needed.',
        open: false
      },
      {
        question: '#9 Am I too old to donate blood?',
        answer: 'There’s no upper age limit for blood donation as long as you are in good health and meet other eligibility criteria. Many older adults continue to donate blood into their 70s and beyond.',
        open: false
      },
      {
        question: '#10 Is my rare blood type not needed?',
        answer: 'If you have a rare blood type, your donation is especially valuable. Blood banks need all types of blood, especially rare ones like O-negative, which is the universal donor.',
        open: false
      },
      {
        question: '#11 Can I donate blood if I’m taking medication?',
        answer: 'Most medications do not prevent you from donating blood. Eligibility depends on the specific medication and condition being treated, but many donors on common medications like those for diabetes, blood pressure, or cholesterol can still donate.',
        open: false
      },
      {
        question: '#12 Is blood donation only for men?',
        answer: 'Women are equally eligible to donate blood. Many women donate blood regularly. The only requirement is meeting the health and weight criteria.',
        open: false
      },
      {
        question: '#13 Does donating blood weaken my immune system?',
        answer: 'Donating blood does not weaken the immune system. Your body replenishes the blood you donate quickly, and there is no evidence to suggest it affects immunity.',
        open: false
      },
      {
        question: '#14 Do I need to rest for a long time after donating blood?',
        answer: 'Most people feel fine after donating and can resume normal activities within a short time. It is recommended to rest for 10-15 minutes, drink plenty of fluids, and avoid strenuous exercise for the rest of the day after donating.',
        open: false
      }
    ];

    this.EligibilityCriteria = [
      {
        question: '#1 Is donating blood painful?',
        answer: 'Donating blood is relatively painless. You might feel a slight pinch when the needle is inserted, but most people find it to be a quick and tolerable experience. Many donors report that it is much easier than expected.',
        open: false
      },
      {
        question: '#2 Can you get sick from donating blood?',
        answer: 'Donating blood is a safe procedure. All equipment used is sterile, and each needle is used only once. You cannot catch any diseases from donating blood.',
        open: false
      },
      {
        question: '#3 Do I have enough blood to donate?',
        answer: 'The average adult has about 10-12 pints of blood, and a typical donation is only about one pint. Your body replenishes the lost blood within a few days.',
        open: false
      },
      {
        question: '#4 Can I donate blood if I have a chronic illness like diabetes?',
        answer: 'People with well-managed chronic conditions, such as diabetes, are often eligible to donate. However, it’s important to check with a doctor before donating.',
        open: false
      },
      {
        question: '#5 Does blood donation take too much time?',
        answer: 'The actual blood donation process takes only about 10 minutes. With registration, screening, and recovery, the total process usually takes less than an hour.',
        open: false
      },
      {
        question: '#6 Can I only donate blood once a year?',
        answer: 'You can donate whole blood every 56 days, up to six times a year.',
        open: false
      },
      {
        question: '#7 Will frequent blood donation weaken my body?',
        answer: 'A healthy person can donate blood up to four times a year without any adverse effects. Platelet donors can donate even more frequently—every 7 to 14 days, up to 24 times a year.',
        open: false
      },
      {
        question: '#8 Do blood banks have enough blood?',
        answer: 'The belief that blood banks have enough blood is false. Due to the limited shelf life of blood and the small number of regular donors, maintaining sufficient supplies is a constant challenge. More volunteers are urgently needed.',
        open: false
      },
      {
        question: '#9 Am I too old to donate blood?',
        answer: 'There’s no upper age limit for blood donation as long as you are in good health and meet other eligibility criteria. Many older adults continue to donate blood into their 70s and beyond.',
        open: false
      },
      {
        question: '#10 Is my rare blood type not needed?',
        answer: 'If you have a rare blood type, your donation is especially valuable. Blood banks need all types of blood, especially rare ones like O-negative, which is the universal donor.',
        open: false
      },
      {
        question: '#11 Can I donate blood if I’m taking medication?',
        answer: 'Most medications do not prevent you from donating blood. Eligibility depends on the specific medication and condition being treated, but many donors on common medications like those for diabetes, blood pressure, or cholesterol can still donate.',
        open: false
      },
      {
        question: '#12 Is blood donation only for men?',
        answer: 'Women are equally eligible to donate blood. Many women donate blood regularly. The only requirement is meeting the health and weight criteria.',
        open: false
      },
      {
        question: '#13 Does donating blood weaken my immune system?',
        answer: 'Donating blood does not weaken the immune system. Your body replenishes the blood you donate quickly, and there is no evidence to suggest it affects immunity.',
        open: false
      },
      {
        question: '#14 Do I need to rest for a long time after donating blood?',
        answer: 'Most people feel fine after donating and can resume normal activities within a short time. It is recommended to rest for 10-15 minutes, drink plenty of fluids, and avoid strenuous exercise for the rest of the day after donating.',
        open: false
      }

    ];



  }

  ngOnInit() {
  }

  toggleAccordion(index: number) {
    if (this.openIndex === index) {
      // If the clicked accordion is already open, close it
      this.openIndex = -1;
    } else {
      // Open the clicked accordion and close others
      this.openIndex = index;
    }
  }
  //toggle(index: number) {
  //  // Assuming faqs is an array of FAQ objects with an 'open' property
  //  this.faqs.forEach((faq:any, i:any) => {
  //    faq.open = i === index ? !faq.open : false;
  //  });
  //  this.openIndex = index;
  //}

  GotoSignup() {
    this.navCtrl.navigateForward(['/home']);
  }
  more(val: any) {
    this.isMore = !this.isMore; // Toggle the condition (open/close)

  }

  buton(val: any) {
    
    this.myval = val
    this.navCtrl.navigateForward(['/guidedlist', { string: val }]);

  }
  //toggleAccordion(index: number) {
  //  this.accordionState[index] = !this.accordionState[index];
  //}
  open1(state: number) {
    // Set all accordions back to closed (headers visible)
    if (this.guidequestions) {
      this.accordionState = Array(this.guidequestions.length).fill(state === 0 ? false : true);


    }
  }
}
