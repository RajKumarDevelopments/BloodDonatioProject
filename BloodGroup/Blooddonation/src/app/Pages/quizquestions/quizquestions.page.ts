import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Swiper,  } from 'swiper';
import { ModalController, NavController, Platform, ActionSheetController, LoadingController, MenuController, AlertController } from '@ionic/angular';
import { GeneralService } from '../../Services/Generalservice/generalservice.service';


@Component({
  selector: 'app-quizquestions',
  templateUrl: './quizquestions.page.html',
  styleUrls: ['./quizquestions.page.scss'],
})
export class QuizquestionsPage implements OnInit {
  selectedAnswer: string | null = null; // Track the selected answer
  isAnswered = false; // Track if an answer is selected
  total: any; UserDetails: any; UserDetails1:any
  donationForm: FormGroup;
  eligibilityMessage: any;
  @ViewChild('swiper') swiperRef!: ElementRef;
  openAccordionIndex: number | null = null;
  selectedAnswers: string[] = [];
  questions: any; resultMessage: any;
  answers: string[] = [];
  myoption: any;
  swiper: Swiper | undefined; Questions1: any;
  ans: boolean = false;
  nill: boolean = false;
  isRedButton = false; // Tracks button color state
  not = false; // Tracks button color state

  constructor(private fb: FormBuilder, private alrt: AlertController, public general: GeneralService,) {
    this.UserDetails1 = localStorage.getItem("UserDetails");
    this.UserDetails = JSON.parse(this.UserDetails1);
    this.donationForm = this.fb.group(

    //  this.questions.reduce((group, question, index) => {
    //    group= new FormControl('', Validators.required); // Add FormControl for each question
    //    return group;
    //  }, {})
      {});
}

  ngOnInit() {
    this.getquiz();
  }

  Questions = [
    {
      //question: 'Are you at least 18 years old?',
      //yes: 'Next question',
      //no: 'Unfortunately, you must be at least 18 years old to donate.'
    },{
      question: 'Are you at least 18 years old?',
      yes: 'Next question',
      no: 'Unfortunately, you must be at least 18 years old to donate.'
    },
    {
      question: 'Have you donated blood in the past 56 days (whole blood)?',
      yes: 'Unfortunately, you need to wait 56 days from your last donation to donate again.',
      no: 'Next question'
    },
    {
      question: 'Do you weigh less than 50 kg (110 lbs)?',
      yes: 'Unfortunately, you must weigh at least 50 kg (110 lbs) to donate blood.',
      no: 'Next question'
    },
    {
      question: 'Have you been diagnosed with or treated for a clotting disorder, or are you on blood thinners?',
      yes: 'Unfortunately, you are not eligible to donate if you have a clotting issue or are taking blood thinners.',
      no: 'Next question'
    },
    {
      question: 'Are you on antibiotics now, or are you having an acute infection?',
      yes: 'Unfortunately, you need to wait until your infection is resolved and you\'ve completed your antibiotics.',
      no: 'Next question'
    },
    {
      question: 'Have you received a blood transfusion in the last 3 months?',
      yes: 'Unfortunately, you must wait 3 months after receiving a blood transfusion to donate.',
      no: 'Next question'
    },
    {
      question: 'Have you ever been diagnosed with leukaemia, lymphoma, myeloma, or any other blood cancers?',
      yes: 'Unfortunately, a history of blood cancer makes you ineligible to donate blood.',
      no: 'Next question'
    },
    {
      question: 'Do you have a cold, flu, or other respiratory infection?',
      yes: 'Please wait until your symptoms fully resolve before donating blood.',
      no: 'Next question'
    },
    {
      question: 'Have you ever had a dura mater transplant or been diagnosed with CJD, vCJD, or TSE?',
      yes: 'Unfortunately, you are not eligible to donate blood.',
      no: 'Next question'
    },
    {
      question: 'Have you consumed alcohol in the last 24 hours?',
      yes: 'You need to wait at least 24 hours to donate blood.',
      no: 'Next question'
    },
    {
      question: 'Have you had dental surgery or any oral procedure in the last 3 days?',
      yes: 'Please wait 3 days after oral surgery before donating blood.',
      no: 'Next question'
    },
    {
      question: 'Are you currently pregnant or recently given birth, or currently breastfeeding?',
      yes: 'Unfortunately, you must wait 3 months after stopping breastfeeding or 9 months after childbirth to donate.',
      no: 'Next question',
      na: 'Next question'
    },
    {
      question: 'Have you ever had Hepatitis B or C, Chagas disease, or been diagnosed with HIV/AIDS?',
      yes: 'Unfortunately, you are not eligible to donate blood.',
      no: 'Next question'
    },
    {
      question: 'In the last 6 months, have you had heart disease, a heart attack, angina, or heart surgery?',
      yes: 'You must wait at least 6 months to donate after these occurrences.',
      no: 'Next question'
    },
    {
      question: 'Do you have active tuberculosis (TB) or are you currently being treated for it?',
      yes: 'Please wait until you\'ve completed treatment for TB before donating.',
      no: 'Next question'
    },
    {
      question: 'Do you have any skin infections, rashes, or open sores at the donation site?',
      yes: 'Please wait until the skin condition clears before donating.',
      no: 'Next question'
    },
    {
      question: 'Have you been diagnosed with or treated for malaria in the past 3 years, or travelled to a malaria-risk area in the last 3 months?',
      yes: 'You must wait 3 years after malaria treatment or 3 months after returning from a malaria-risk area before donating.',
      no: 'Next question'
    },
    {
      question: 'Have you received an organ or tissue transplant in the last 3 months?',
      yes: 'You must wait 3 months after receiving an organ transplant before donating.',
      no: 'Next question'
    },
    {
      question: 'Have you had a piercing or tattoo in the last 3 months?',
      yes: 'Unfortunately, you must wait 3 months after a piercing or tattoo before donating.',
      no: 'Next question'
    },
    {
      question: 'Have you been diagnosed with and treated for syphilis or gonorrhoea in the last 3 months?',
      yes: 'You must wait 3 months after successful treatment for syphilis or gonorrhoea before donating.',
      no: 'Next question'
    },
    {
      question: 'Have you received any vaccinations recently (COVID-19 vaccination has no waiting time)?',
      yes: 'Depending on the vaccine, you may need to wait 2 to 4 weeks after vaccination.',
      no: 'Next question'
    },
    {
      question: 'Have you recently travelled to or lived in areas where the Zika virus or Ebola is prevalent?',
      yes: 'You need to wait 28 days for Zika virus and 56 days for Ebola before donating blood.',
      no: 'Next question'
    }
  ];
  // female
  femalequestions = [
    { value: 1, question: '  Have you had an abortion in the last 6 months?', answer: 'To carry oxygen from the lungs to the rest of the body and return carbon dioxide to the lungs for exhalation.' },
    { value: 2, question: ' What is the main function of red blood cells?', answer: 'To carry oxygen from the lungs to the rest of the body and return carbon dioxide to the lungs for exhalation.' },
    { value: 3, question: ' What are the four main blood types?', answer: 'A, B, AB, and O.' },
    { value: 4,question: '  Which blood type is known as the universal donor?', answer: 'O negative.' },
    { value: 5, question: '  Which blood type is known as the universal recipient?', answer: 'AB positive.' },
    // Add more questions as necessary
    {
      value: 6, question: '  How many chambers does the human heart have?',
      answer: 'Four chambers: two atria and two ventricles.',
      //gender: 'none'
    },
    {
      value: 7, question: '  What is the common term for a heart attack?',
      answer: 'Myocardial infarction.',
     // gender: 'none'
    },
    {
      value: 8, question: '  Did you drink alcohol in the last 48 hours?',
      answer: 'Risk to donate.',
      //gender: 'none'
    },
    {
      value: 9, question: ' Are you at least 18 years old?',
      answer: 'Myocardial infarction.',
      //gender: 'none'
    }
    // Continue for the rest of the questions
  ];


  slideOptions = {
    initialSlide: 0,
    speed: 400,
    allowTouchMove: true
  };


  answerQuestion(answer: string) {
    
    this.ans= true
    this.answers[this.currentQuestionIndex] = answer;
    const currentQuestion = this.Questions[this.currentQuestionIndex];
    if (answer === 'no' && currentQuestion.no !== 'Next question') {
      this.resultMessage = currentQuestion.no;
      this.selectedAnswer = answer;
      this.isAnswered = true; // Button turns red
    } else if (answer === 'yes' && currentQuestion.yes !== 'Next question') {
      this.resultMessage = currentQuestion.yes;
      this.selectedAnswer = answer;
      this.isAnswered = true; // Button turns red
      this.isRedButton = true; // Change button to red

    } else {
      this.resultMessage = null;
      //this.nextQuestion();
    }
  }

  // Handle NA answer for certain questions
  answerNA() {
    this.resultMessage = null;
    //this.nextQuestion();
  }
  getCurrentAnswer() {
    return this.answers[this.currentQuestionIndex] || '';
    
  }
  // Move to next question
  nextQuestion() {
    
    this.ans = true
    this.myoption = this.answers[this.currentQuestionIndex]
    if (this.myoption) {


      if (this.currentQuestionIndex < this.Questions.length - 1) {
        this.currentQuestionIndex++;
        this.resultMessage = null;
        this.isAnswered = false; // Reset button to white
        this.isRedButton = false; // Reset button to white
      } else {
        this.resultMessage = 'Congratulations! You’ve successfully passed all the eligibility requirements to donate blood.';
      }
    } else {
      this.general.presentAlert("Fail", "Please select the options.");

    }
  }

  nextQuestion2() {
    
    this.not = false,
      this.ans = false
    this.myoption = this.answers[this.currentQuestionIndex]
    if (this.myoption) {


      if (this.currentQuestionIndex < this.Questions.length - 1) {
        this.currentQuestionIndex++;
        this.resultMessage = null;
        this.isAnswered = false; // Reset button to white
        this.isRedButton = false; // Reset button to white
      } else {
        this.resultMessage = 'Congratulations! You’ve successfully passed all the eligibility requirements to donate blood.';
      }
    } else {
      this.general.presentAlert("Fail", "Please select the options.");

    }
  }

  // Reset the questionnaire
  reset() { 
    this.not = false,
      this.ans = false
    this.currentQuestionIndex = 1; // Start from the first question
    this.resultMessage = null;
    this.answers = []; // Clear the answers array
  }
  getquiz() {
    const gender = this.UserDetails[0]?.Gender;

      this.questions = this.questions;
   
      this.questions = [];
    

    // Clear existing controls before adding new ones
   
  }


  currentQuestionIndex = 1;

  nextQuestion22() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  isLastQuestion() {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  shouldShowAccordion(index: number): boolean {
    return index === this.currentQuestionIndex;
  }

  isAccordionOpen(index: number): boolean {
    return index === this.currentQuestionIndex;
  }
  resetQuiz(): void {
    this.currentQuestionIndex = 1;
    this.selectedAnswers = [];
    this.eligibilityMessage = '';
  }
  onSubmit() {
    if (this.donationForm.valid) {
      // Logic when form is valid
      console.log('Form Submitted:', this.donationForm.value);
      alert("You're eligible for donation!");
    } else {
      alert("Unfortunately, you're not eligible for donation.");
    }
  }
  //nextQuestion(): void {
  //  if (this.selectedAnswers[this.currentQuestionIndex]) {
  //    this.currentQuestionIndex++;
  //    if (this.currentQuestionIndex >= this.questions.length) {
  //      this.checkEligibility();
  //    }
  //  } else {
  //    this.showAlert('Please select an option before proceeding.');
  //  }
  

  async showAlert(message: string) {
    const alert = await this.alrt.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }


  checkEligibility(): void {
    // Implement your eligibility logic here
    // For demonstration, let's assume if all answers are "yes", user is eligible
    const allYes = this.selectedAnswers.every(answer => answer === 'yes');
    this.eligibilityMessage = allYes ? 'You are eligible!' : 'You are not eligible.';
  }

  checkEligibility1() {
    const formValues = this.donationForm.value;

    // Logic to check eligibility
    let eligible = true;

    // List of conditions where a "Yes" answer makes the person ineligible
    const ineligibleQuestions = [0, 1, 2, 3, 7, 9, 10, 12, 18, 20, 26];

    for (const key in formValues) {
      if (ineligibleQuestions.includes(parseInt(key)) && formValues[key] === 'yes') {
        eligible = false;
        break;
      }
    }

    if (eligible) {
      this.eligibilityMessage = "Congratulations! You are eligible to donate blood.";
    } else {
      this.eligibilityMessage = "Unfortunately, you are not eligible to donate blood.";
    }
  }

  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      slidesPerView: 1, // Show one slide at a time
      spaceBetween: 10, // Space between slides
      loop: false, // Disable looping
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      }
    });
  }
  toggleAccordion(index: number): void {
    this.openAccordionIndex = this.openAccordionIndex === index ? null : index;
  }
  

  nextQuestion202() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.donationForm.get(this.currentQuestionIndex.toString())?.setValue('');
    }
  }
}
