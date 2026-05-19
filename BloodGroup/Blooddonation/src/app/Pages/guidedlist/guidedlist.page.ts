import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-guidedlist',
  templateUrl: './guidedlist.page.html',
  styleUrls: ['./guidedlist.page.scss'],
})
export class GuidedlistPage implements OnInit {
  myval: any; mystring: any; openIndex: number = -1;
  ComponentsBlood: any; TypesofDonations: any; BloodDonationProcess: any; Mythfacts: any; EligibilityCriteria: any; Donatetypes: any;
  titles: any;
  myval1: any;
  constructor(public activeRoute: ActivatedRoute, public navCtrl: NavController, private sanitizer: DomSanitizer) {
    this.mystring = this.activeRoute.snapshot.paramMap.get("string");
    this.setContent(this.mystring); // Call setContent in the constructor
    if (this.mystring == 'ComponentsBlood') {
      this.myval = 'ComponentsBlood'
      this.myval1 = 'Components Blood'

    } else if (this.mystring == 'TypesofDonations') {

      this.myval = 'TypesofDonations'
      this.myval1 = 'Types of Donations'
    }
    else if (this.mystring == 'BloodDonationProcess') {
      this.myval = 'BloodDonationProcess'
      this.myval1 = 'Blood Donation Process'

    }
    else if (this.mystring == 'Mythfacts') {
      this.myval = 'Mythfacts'
      this.myval1 = 'Myth facts'

    }
    else if (this.mystring == 'EligibilityCriteria') {
      this.myval = 'EligibilityCriteria'
      this.myval1 = 'Eligibility Criteria'

    } else if (this.mystring == 'Donatetypes') {
      this.myval = 'Donatetypes'
      this.myval1 = 'Compatible Blood Types'

    }

    this.ComponentsBlood = [
      {
        question: ' Components of Blood.',
        answer: `
    <img src="/assets/Images/bl.png" alt="Height and Weight Table" style="max-width: 100%; height: auto; margin-bottom: 10px;">
  `,
        open: false
      },
      {
        question: ' Red Blood Cells (RBCs).',
        answer: `
    <ul>
      <li><b>Function:</b> Carry oxygen from your lungs to the rest of your body and return carbon dioxide back to the lungs to be exhaled.</li><br>
      <li><b>Importance:</b> Used for patients with severe blood loss, anaemia, or during surgery.</li><br>
      <li><b>Lifespan in the Body:</b> About 120 days.</li>
    </ul>
  `,
        open: false
      },
      {
        question: ' White Blood Cells (WBCs).',
        answer: `
    <ul>
      <li><b>Function:</b> Fight infections by attacking bacteria, viruses, and other foreign invaders in the body.</li><br>
      <li><b>Importance:</b> A critical component of the immune system, though not commonly transfused except in very specific cases.</li><br>
      <li><b>Lifespan in the Body:</b> A few hours to a few days.</li>
    </ul>
  `,
        open: false
      },
      {
        question: ' Platelets.',
        answer: `
    <ul>
      <li><b>Function:</b> Help blood clot and stop bleeding.</li><br>
      <li><b>Importance:</b> Essential for cancer patients, those undergoing surgeries, and people with blood disorders.</li><br>
      <li><b>Lifespan in the Body:</b> 7-10 days.</li>
    </ul>
  `,
        open: false
      },
      {
        question: ' Plasma.',
        answer: `
    <ul>
      <li><b>Function:</b> The liquid portion of blood that transports water, salts, and proteins throughout the body.</li><br>
      <li><b>Importance:</b> : Used to treat burn victims, trauma patients, and individuals with clotting disorders.</li><br>
      <li><b>Composition:</b> : Plasma is about 90% water and 10% proteins, hormones, and salts.</li><br>
      <li><b>Lifespan in the Body:</b> Plasma itself is renewed constantly, but transfused plasma can be stored for up to a year when frozen.</li>
    </ul>
  `,
        open: false
      },
      {
        question: ' Plasma Proteins',
        answer: `
    <b>Key Proteins:</b>
    <ul>
      <li><b>Albumin:</b> Maintains blood pressure and volume.</li><br>
      <li><b>Fibrinogen:</b> Helps blood to clot.</li><br>
      <li><b>Globulins:</b> Play a role in the immune system and fighting infections.</li>
    </ul>
  `,
        open: false
      }
    ];


    this.Donatetypes = [
      {
        question: ' Who Can You Donate To.',
        answer: `
    <img src="/assets/Images/CompatibleBlood.jpg" alt="Height and Weight Table" style="max-width: 100%; height: auto; margin-bottom: 10px;">
  `,
        open: false
      },
      {
        question: ' Universal Donor.',
        answer: `
        <p>
          O- blood type can be donated to any blood type.
        </p>
    `,
        open: false,
      },
      {
        question: ' Universal Recipient.',
        answer: `
        <p>
          AB+ can receive blood from all other blood types.
        </p>
    `,
        open: false,
      },
      {
        question: ' Most Common Blood Type.',
        answer: `
        <p>
          O+ is the most common, making its donors highly in demand.
        </p>
    `,
        open: false,
      },
      {
        question: ' Rarest Blood Type.',
        answer: `
        <p>
          AB- is the rarest blood type.
        </p>
    `,
        open: false,
      },
      {
        question: ' Positive (+) vs. Negative (-).',
        answer: `
        <p>
          People with positive (+) blood types can receive from both positive and negative types, but negative (-) blood types can only receive from other negative blood types.
        </p>
    `,
        open: false,
      },
      {
        question: ' O- Compatibility.',
        answer: `
        <p>
          O- is often used in emergency transfusions because it's compatible with all recipients.
        </p>
    `,
        open: false,
      },
      {
        question: ' AB+ Plasma Donations.',
        answer: `
        <p>
          AB+ is the universal plasma donor, while O- is the universal blood donor.
        </p>
    `,
        open: false,
      },
      {
        question: ' Blood Type Distribution.',
        answer: `
        <p>
          Blood type distribution varies by ethnicity, affecting availability for transfusions in certain communities.
        </p>
    `,
        open: false,
      },
    ];


    this.TypesofDonations = [
      {
        question: ' Whole Blood Donation.',
        answer: `
      <p>Whole blood is the most flexible type of donation. It can be transfused in its original form, or used to help multiple people when separated into its specific components of red cells, plasma and platelets.</p>
      <p><b>Who it helps:</b> Whole blood is frequently given to trauma patients and people undergoing surgery.</p>
      <p><b>Time it takes:</b> About 1 hour.</p>
      <p><b>Ideal blood types:</b> All blood types.</p>
      <p><b>Donation frequency:</b> Every 56 days, up to 6 times a year.</p>
  `,
        open: false
      },
      {
        question: ' Platelet Donation.',
        answer: `
      <p>Platelets are tiny cells in the blood that help form clots and stop bleeding, often used by cancer patients and those with serious illnesses or injuries. During platelet donation, a special machine collects platelets and some plasma, returning most of the blood back to the donor. One platelet donation can provide several transfusable units, compared to the five whole blood donations needed to make a single unit of platelets.</p>
      <p><b>Who it helps:</b> Platelets are a vital element of cancer treatments and organ transplant procedures, as well as other surgical procedures.</p>
      <p><b>Time it takes:</b> About 2.5-3 hours.</p>
      <p><b>Ideal blood types:</b> A positive, A negative, B positive, O positive, AB positive and AB negative.</p>
      <p><b>Donation frequency:</b> Every 7 days, up to 24 times/year.</p>
  `,
        open: false
      },
      {
        question: ' Plasma Donation.',
        answer: `
      <p>Plasma is the liquid part of your blood that carries nutrients, hormones, and proteins to where they're needed. AB plasma can be given to anyone regardless of their blood type.</p>
      <p>Plasma is collected through an automated process that separates plasma from other blood components, then safely and comfortably returns your red blood cells and platelets to you.</p>
      <p><b>Who it helps:</b> Plasma is used in emergency and trauma situations to help stop bleeding.</p>
      <p><b>Time it takes:</b> About 1 hour and 15 minutes.</p>
      <p><b>Ideal blood types:</b> AB positive, AB negative.</p>
      <p><b>Donation frequency:</b> Every 28 days, up to 13 times/year, and one plasma donation can benefit multiple patients.</p>
  `,
        open: false
      },
      {
        question: ' Power Red Donation.',
        answer: `
      <p>Power Red donation involves giving a concentrated dose of red blood cells, which are essential for carrying oxygen throughout the body.</p>
      <p>During a Power Red donation, you give a concentrated dose of red cells, the part of your blood used every day for those needing transfusions as part of their care. This type of donation uses an automated process that separates your red blood cells from the other blood components and then safely and comfortably returns your plasma and platelets to you.</p>
      <p><b>Who it helps:</b> Red cells from a Power Red donation are typically given to trauma patients, newborns and emergency transfusions during birth, people with sickle cell anaemia, and anyone suffering blood loss.</p>
      <p><b>Time it takes:</b> About 1.5 hours.</p>
      <p><b>Ideal blood types:</b> O positive, O negative, A negative, and B negative.</p>
      <p><b>Donation frequency:</b> Every 112 days, up to 3 times/year.</p>
  `,
        open: false
      },
    ];



    this.BloodDonationProcess = [
      {
        question: ' Where It Starts.',
        answer: `
    <p>Through this app, donors can connect directly with those in need, bypassing traditional blood banks.</p>
    <p>The process involves:</p>
    <ol>  <li><b>Hospital Visit:</b> The matched donor goes directly to the hospital where the recipient is being treated.</li>
      <li><b>Donation:</b> The donor provides blood at the hospital for direct use by the patient.</li>
    </ol>
  `,
        open: false,
      },
      {
        question: ' What to do before Donation.',
        answer: `
    <p>To ensure a smooth and safe donation process, here’s what you need to do before donating blood:</p>
    <ol>
      <li><b>Eligibility Check:</b><br><br>
        <ul>
          <li>Ensure you meet the eligibility criteria (age, weight, health status). The app may provide a quiz for this.</li>
        </ul>
      </li>
      <br>
      <li><b>Hydrate:</b><br><br>
        <ul>
          <li>Drink plenty of water or other fluids 24 hours before the donation.</li>
        </ul>
      </li>
      <br>
      <li><b>Eat a Healthy Meal:</b><br><br>
        <ul>
          <li>Consume a meal rich in iron (spinach, red meat, beans) before donating.</li>
        </ul>
      </li>
      <br>
      <li><b>Avoid Fatty Foods:</b><br><br>
        <ul>
          <li>Fatty foods can affect the blood tests used to determine if your blood is safe to use.</li>
        </ul>
      </li>
      <br>
      <li><b>Get Enough Sleep:</b><br><br>
        <ul>
          <li>Make sure you’re well-rested before donating.</li>
        </ul>
      </li>
      <br>
      <li><b>Bring Necessary Identification:</b><br><br>
        <ul>
          <li>Bring a government ID or app-based donor profile when visiting the hospital.</li>
        </ul>
      </li>
    </ol>
  `,
        open: false,
      },
      {
        question: ' During Donation.',
        answer: `
    <p>Here's what to expect when you're at the hospital:</p>
    <ol>
      <li><b>Registration:</b><br><br>
        <ul>
          <li>Upon arrival, you'll be registered and your identity will be verified.</li>
        </ul>
      </li>
      <br>
      <li><b>Health Check:</b><br><br>
        <ul>
          <li>A medical professional will check your vital signs (blood pressure, pulse) and hemoglobin levels to ensure you're fit to donate.</li>
        </ul>
      </li>
      <br>
      <li><b>Donation Process:</b><br><br>
        <ul>
          <li>The donation itself takes about 8-10 minutes. You will be seated comfortably, and blood will be drawn from your arm.</li><br>
          <li>Typically, about 1 pint (around 470 ml) of blood is collected.</li>
        </ul>
      </li>
      <br>
      <li><b>Relax and Stay Calm:</b><br><br>
        <ul>
          <li>You’ll be asked to relax during the process to ensure a steady flow and comfortable experience.</li>
        </ul>
      </li>
    </ol>
  `,
        open: false,
      },
      {
        question: ' After Donation.',
        answer: `
    <p>Once you’ve donated blood, follow these steps for a quick recovery:</p>
    <ol>
      <li><b>Rest for a Few Minutes:</b><br><br>
        <ul>
          <li>Remain seated for about 15 minutes after donation. You may be offered a snack and a drink to help replenish fluids.</li>
        </ul>
      </li>
      <br>
      <li><b>Stay Hydrated:</b><br><br>
        <ul>
          <li>Continue drinking water over the next 24-48 hours to maintain fluid balance.</li>
        </ul>
      </li>
      <br>
      <li><b>Eat Nutritious Food:</b><br><br>
        <ul>
          <li>Have a light, iron-rich meal after donating to help restore energy levels.</li><br>
        </ul>
      </li>
      <br>
      <li><b>Avoid Strenuous Activity:</b><br><br>
        <ul>
          <li>Skip heavy exercise or lifting for the rest of the day to allow your body to recover.</li>
        </ul>
      </li>
      <li><b>Watch for Side Effects:</b><br><br>
        <ul>
          <li>Mild dizziness or lightheadedness is normal. Lie down or sit if you feel faint. If symptoms persist, seek medical attention.</li>
        </ul>
      </li>
    </ol>
  `,
        open: false,
      },
      {
        question: ' What Happens to Donated Blood.',
        answer: `
    <p>After donation, the blood goes through a few important steps before it’s used:</p>
    <ol>
      <li><b>Testing:</b><br><br>
        <ul>
          <li>Your blood will be tested for blood type and screened for infections to ensure it’s safe for use.</li>
        </ul>
      </li>
      <br>
      <li><b>Separation:</b><br><br>
        <ul>
          <li>Blood can be separated into components: red cells, plasma, and platelets. Each part can help different patients, depending on their needs.</li>
        </ul>
      </li>
      <br>
      <li><b>Direct Usage:</b><br><br>
        <ul>
          <li>Since the donation happens at the hospital, your blood can often be used immediately for the recipient in need.</li><br>
        </ul>
      </li>
      <br>
      <li><b>Storage (if necessary):</b><br><br>
        <ul>
          <li>If the donation isn’t used right away, red blood cells can be stored for up to 42 days, while plasma can be frozen and stored for up to a year.</li>
        </ul>
      </li>
    </ol>
  `,
        open: false,
      },
    ];


    this.Mythfacts = [
      {
        question: ' Myth 1: Donating blood is painful.',
        answer: `
        <p>
          <b>Fact:</b> Donating blood is relatively painless. You might feel a slight pinch when the needle is inserted, but most people find it to be a quick and tolerable experience. Many donors report that it's much easier than expected.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 2: You can get sick from donating blood.',
        answer: `
        <p>
          <b>Fact:</b> Donating blood is a safe procedure. All equipment used is sterile, and each needle is used only once. You cannot catch any diseases from donating blood.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 3: I don\'t have enough blood to donate.',
        answer: `
        <p>
          <b>Fact:</b> The average adult has about 10-12 pints of blood, and a typical donation is only about one pint. Your body replenishes the lost blood within a few days.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 4: I can’t donate if I have a chronic illness like diabetes.',
        answer: `
        <p>
          <b>Fact:</b> People with well-managed chronic conditions, such as diabetes, are often eligible to donate. However, it’s important to check with the doctor before donating.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 5: Blood donation takes too much time.',
        answer: `
        <p>
          <b>Fact:</b> The actual blood donation process takes only about 10 minutes. With registration, screening, and recovery, the total process usually takes less than an hour.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 6: You can only donate blood once a year.',
        answer: `
        <p>
          <b>Fact:</b> can donate whole blood every 56 days, up to six times a year.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 7: I should not donate blood frequently; it will weaken my body.',
        answer: `
        <p>
          <b>Fact:</b> A healthy person can donate blood up to four times a year without any adverse effects on one's body and Platelet donors can donate even more frequently—every 7 to 14 days, up to 24 times a year.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 8: Blood Banks have enough blood.',
        answer: `
        <p>
          <b>Fact:</b> The belief that blood banks have enough blood is, unfortunately, false. Due to the limited shelf life of blood—42 days for red blood cells and just 5 days for platelets—maintaining sufficient supplies is a constant challenge. Furthermore, the number of people who regularly donate is small, and even fewer are eligible after rigorous screening for infectious diseases and other conditions. To meet ongoing demand, we urgently need more volunteers to step forward and donate blood.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 9: I’m too old to donate blood.',
        answer: `
        <p>
          <b>Fact:</b> There’s no upper age limit for blood donation as long as you are in good health and meet other eligibility criteria. Many older adults continue to donate blood into their 70s and beyond.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 10: I have a rare blood type, so my blood isn’t needed.',
        answer: `
        <p>
          <b>Fact:</b> If you have a rare blood type, your donation is especially valuable. Blood banks need all types of blood, especially rare ones like O-negative, which is the universal donor.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 11: I can\'t donate blood if I\'m taking medication.',
        answer: `
        <p>
          <b>Fact:</b> Most medications do not prevent you from donating blood. Eligibility depends on the specific medication and condition being treated, but many donors on common medications like diabetes, blood pressure or cholesterol drugs can still donate.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 12: Blood donation is only for men.',
        answer: `
        <p>
          <b>Fact:</b> Women are equally eligible to donate blood. In fact, many women donate blood regularly. The only requirement is meeting the health and weight criteria.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 13: Donating blood can weaken your immune system.',
        answer: `
        <p>
          <b>Fact:</b> Donating blood does not weaken the immune system. Your body replenishes the blood you donate quickly, and there is no evidence to suggest it affects immunity.
        </p>
    `,
        open: false,
      },
      {
        question: ' Myth 14: I need to rest for a long time after donating blood.',
        answer: `
        <p>
          <b>Fact:</b> Most people feel fine after donating and can resume normal activities within a short time. It’s recommended to rest for 10-15 minutes after donating, drink plenty of fluids, and avoid strenuous exercise for the rest of the day.
        </p>
    `,
        open: false,
      },
    ];

    this.EligibilityCriteria = [
      {
        question: ' Acupuncture.',
        answer: 'Donors who have undergone acupuncture treatments are acceptable.',
        open: false
      },
      {
        question: ' Age.',
        answer: 'You must be at least 18 years old to donate in India.',
        open: false
      },
      {
        question: ' Allergy, Stuffy Nose, Itchy Eyes, Dry Cough.',
        answer: 'Acceptable as long as you feel well, have no fever, and have no problems breathing through your mouth.',
        open: false
      },
      {
        question: ' Alcohol and smoking.',
        answer: `
        <p>
          You should avoid consuming alcohol for at least 24 hours before donation, as it can lead to dehydration and affect your blood quality.
        </p>
        <p>
          It’s recommended to avoid smoking for at least one hour before donating blood to reduce the risk of dizziness or light-headedness.
        </p>
    `,
        open: false,
      },
      {
        question: ' Antibiotics.',
        answer: `
        <p>
          Acute infection: You cannot donate.
        </p>
        <p>
          Oral antibiotics: Eligible if you've finished the course (can take the last pill on the donation day).
        </p>
        <p>
          Injection antibiotics: Wait 10 days after your last injection.
        </p>
        <p>
          Preventive antibiotics: Eligible if taking antibiotics for acne, chronic prostatitis, peptic ulcer disease, periodontal disease, pre-dental work, rosacea, ulcerative colitis, after a splenectomy, or valvular heart disease.
        </p>
        <p>
          Fever: Cannot donate if your temperature is over 99.5°F.
        </p>
    `,
        open: false,
      },
      {
        question: ' Aspirin.',
        answer: `
        <p>
          Whole blood: No waiting period after taking aspirin.
        </p>
        <p>
          Platelets: Wait 2 full days after taking aspirin before donating. (e.g., if taken Monday, you can donate platelets on Thursday)
        </p>
    `,
        open: false,
      },
      {
        question: ' Asthma.',
        answer: `
        <p>
          Eligibility: You can donate if you have no limitations on daily activities, no difficulty breathing, and feel well.
        </p>
        <p>
          Medications: Asthma medications do not disqualify you
        </p>
    `,
        open: false,
      },
      {
        question: ' Birth Control.',
        answer: 'Individuals on oral contraceptives or using other forms of birth control are eligible to donate.',
        open: false
      },
      {
        question: ' Bleeding Condition.',
        answer: `
        <p>
          Clotting issues: You cannot donate if your blood doesn’t clot normally or if you're on blood thinners.
        </p>
        <p>
          Aspirin: OK for whole blood donation, but wait 2 full days to donate platelets (e.g., if taken Monday, you can donate platelets on Thursday).
        </p>
        <p>
          Clotting disorders: Donors with Factor V not on anticoagulants are eligible; others will be evaluated at the donation centre.
        </p>
        <p>
          Haemophilia: People with haemophilia have a bleeding disorder, making blood donation unsafe due to the risk of excessive bleeding from the needle.
        </p>
        <p>
          Thalassemia: People with moderate or severe thalassemia experience anaemia, spleen enlargement, and other health issues, requiring regular blood transfusions, making them ineligible to donate.
        </p>
        <p>
          However, individuals with thalassemia minor, who typically have mild or no symptoms, can donate blood if they meet the required haemoglobin levels and other criteria.
        </p>
    `,
        open: false,
      },
      {
        question: ' Blood Pressure, High.',
        answer: `
        <p>
          Acceptable as long as your blood pressure is below 180 systolic (first number) and below 100 diastolic (second number) at the time of donation.
        </p>
        <p>
          <b>Medications:</b> High blood pressure medications do not disqualify you.
        </p>
    `,
        open: false,
      },

      {
        question: ' Blood Pressure, Low.',
        answer: 'Acceptable as long as you feel well when you come to donate, and your blood pressure is at least 90/50 (systolic/diastolic).',
        open: false
      },
      {
        question: ' Blood Transfusion.',
        answer: 'Wait for 3 months after receiving a blood transfusion from another person.',
        open: false
      },
      {
        question: ' Cancer.',
        answer: `
        Eligibility to donate blood depends on the type of cancer you’ve had and your treatment history:

        <ul>
          <li><b>If you’ve had leukemia or lymphoma</b>, including <b>Hodgkin’s Disease</b> or any other cancers of the blood, <b>you are not eligible to donate</b>.</li>

          <li>For <b>other types of cancer</b>, you may be eligible to donate if:
            <ul>
              <li>The cancer has been <b>successfully treated</b>.</li>
              <li>It has been <b>more than 12 months</b> since your treatment was completed.</li>
              <li>There has been <b>no recurrence</b> of cancer during this time.</li>
            </ul>
          </li>

          <li>For <b>lower-risk, in-situ cancers</b>, such as <b>squamous or basal cell skin cancers</b>, you do not need to wait 12 months after complete removal and healing.</li>

          <li><b>Precancerous conditions of the uterine cervix</b> do not disqualify you, provided the abnormality has been successfully treated.</li>
        </ul>
      `,
        open: false,
      },

      {
        question: ' Chronic Illnesses.',
        answer: `
      
        <p>
          Most chronic illnesses are acceptable as long as you feel well, the condition is under control, and you meet all other eligibility requirements.
        </p>
    `,
        open: false,
      },
      {
        question: ' Cold, Flu.',
        answer: `
      
        <p>
          To donate, you must be symptom-free from productive cough (bringing up phlegm), cold, flu, or fever on the day of donation.
        </p>
          <p>Wait until you have completed antibiotic treatment for sinus, throat, or lung infection.
        </p>
    `,
        open: false,
      },

      {
        question: ' Creutzfeldt-Jakob Disease (CJD).',
        answer: `
          <ul>
            <li>If you ever received a dura mater (brain covering) transplant, you are not eligible to donate.</li>
            <li>If you received an injection of cadaveric pituitary human growth hormone (hGH), you cannot donate.</li>
            <li>If you have been diagnosed with vCJD, CJD, or any other TSE, or have a blood relative diagnosed with genetic CJD (e.g., fCJD, GSS, or FFI), you cannot donate.</li>
          </ul>
    `,
        open: false,
      },
      {
        question: ' Dental Procedures and Oral Surgery.',
        answer: `
      
        <p>
          Acceptable after dental procedures as long as there is no infection present. Wait until antibiotics are finished for a dental infection. Wait for 3 days after having oral surgery.
        </p>
    `,
        open: false,
      },
      {
        question: ' Diabetes.',
        answer: `
        <p>
          Diabetics who are well-controlled on insulin or oral medications are eligible to donate.
        </p>
    `,
        open: false,
      },
      {
        question: ' Donation Intervals.',
        answer: `
            <p>Wait at least 8 weeks (56 days) between whole blood (standard) donations up to 6 times a year*.</p>
            <p>Wait at least 7 days between platelet (pheresis) donations up to 24 times/year*.</p>
            <p>Wait at least 16 weeks (112 days) between Power Red (automated) donations up to 3 times/year*.</p>
    `,
        open: false,
      },
      
      {
        question: ' Ebola Virus.',
        answer: `
            <p>
          You are not eligible to donate if you have ever had Ebola virus infection or disease. If you've travelled to an area recently with widespread Ebola and are not affected, wait at least 8 weeks after returning.
            </p>
    `,
        open: false,
      },
      {
        question: ' Heart Disease.',
        answer: `
            <p>
          In general, acceptable as long as you have been medically evaluated and treated, have no current (within the last 6 months) heart-related symptoms such as chest pain and have no limitations or restrictions on your normal daily activities.
            <p>Wait at least 6 months following an episode of angina.</li>
            <p>Wait at least 6 months following a heart attack.</li>
            <p>Wait at least 6 months after bypass surgery or angioplasty.</li>
            <p>Wait at least 6 months after a change in your heart condition that resulted in a change to your medications.</li>
          If you have a pacemaker, you can donate as long as your pulse is between 50 and 100 beats per minute and you meet the other heart disease criteria. Discuss your particular situation with your doctor at the time of blood donation.
        </p>
    `,
        open: false,
      },
      {
        question: ' Heart Murmur, Heart Valve Disorder.',
        answer: `
            <p>
            Acceptable if medically evaluated, treated, symptom-free for 6 months, and have no restrictions on daily activities.
            </p>
    `,
        open: false,
      },
      {
        question: ' Hemochromatosis (Hereditary).',
        answer: `
           <p>
           Acceptable if you meet all eligibility criteria and donation intervals.
           </p>
    `,
        open: false,
      },
      {
        question: ' Haemoglobin (Hb), Haematocrit, Blood Count.',
        answer: `
           <p>
          Minimum levels: Women: 12.5 g/dL, Men: 13.0 g/dL.
          </p>
          <p>
          Maximum level: No greater than 20 g/dL.
          </p>
          <p>
          Power Reds: Minimum haemoglobin of 13.3 g/dL required for all donors.
          </p>
          <p>
          People with anaemia are not eligible to donate blood.
          </p>
    `,
        open: false,
      },
      {
        question: ' Hepatitis, Jaundice.',
        answer: `
            <p><b>Ineligibility:</b> If you have symptoms of hepatitis (inflammation of the liver) or unexplained jaundice (yellow discolouration of the skin), you cannot donate.</p>
    `,
        open: false,
      },
      {
        question: ' Hepatitis B or C.',
        answer: `
            <p>Tested positive at any age disqualifies you from donating, regardless of symptoms.</p>
            <p>Non-infective jaundice, which can be caused by conditions like medications, Gilbert's disease, bile duct obstruction, alcohol, gallstones, or liver trauma, does not automatically disqualify a person from donating blood. However, each case is evaluated individually by blood donation centres. They aim to ensure that neither the donor nor the recipient will be at risk, so a full health screening is performed.</p>
        </p>
    `,
        open: false,
      },
      {
        question: ' Hepatitis Exposure.',
        answer: `
            <p>
          If you live with or have had sexual contact with a person who has hepatitis, wait 3 months after the last contact.
        </p>
        <p>
          Persons who have been detained or incarcerated in a facility (juvenile detention, lockup, jail, or prison) for 72 hours or more consecutively (3 days) are deferred for 12 months from the date of last occurrence.
        </p>
    `,
        open: false,
      },
      {
        question: ' Hidradenitis Suppurativa.',
        answer: `
        <p>
          You are not eligible to donate if you have ever had Hidradenitis suppurativa.
        </p>
    `,
        open: false,
      },
      {
        question: ' HIV, AIDS.',
        answer: `
           <p>
            Do not donate if you have AIDS or ever tested positive for HIV, or if you have done something that puts you at risk for becoming infected with HIV.
            <br><br>
            You are at risk for getting infected if in the past 3 months you:
          </p>
          <ul>
            <li>Used needles for drugs or steroids or anything not prescribed by your doctor.</li>
            <li>Had anal sex with a new partner or multiple partners.</li>
            <li>Received payment for sex.</li>
            <li>Had sexual contact with someone who has tested positive for HIV or has engaged in risky behaviors.</li>
            <li>Have had sexual contact with anyone who has received money, drugs, or other payment for sex, or used needles to inject drugs, steroids, or anything not prescribed by their doctor.</li>
          </ul>
          <p>
            Do not give blood if you have any of the following conditions that can be signs or symptoms of HIV infection:
          </p>
          <ul>
            <li>Fever</li>
            <li>Enlarged lymph glands</li>
            <li>Sore throat</li>
            <li>Rash</li>
          </ul>
          <p>
            <b>Do not donate</b> if you have taken any medication for HIV (antiretroviral therapy).
          </p>
          <p>
            <b>Oral HIV preventative medications (PrEP/PEP):</b> Wait 3 months after the last dose to prevent HIV infection when exposed to it.
          </p>
          <p>
            <b>Injectable HIV preventative medications (PrEP/PEP):</b> Wait 2 years after the last injection (e.g., Apretude).
          </p>
    `,
        open: false,
      },
      {
        question: ' Hormone Replacement Therapy (HRT).',
        answer: `
          <p>
            Women on hormone replacement therapy for menopausal symptoms and prevention of osteoporosis are eligible to donate.
          </p>
    `,
        open: false,
      },
      {
        question: ' Immunisation, Vaccination.',
        answer: `
           <p>
            You can donate if you are symptom and fever-free after vaccines for flu, RSV, pneumonia, tetanus, meningitis (including Tdap), HPV, or SHINGRIX (shingles).
          </p>
            <p>Wait 4 weeks after vaccines for Rubella, MMR, Chicken Pox, or Zostavax (live shingles vaccine).</p>
            <p>Wait 2 weeks after vaccines for Rubeola, Mumps, Polio (oral), or Yellow Fever.</p>
            <p>Wait 21 days after a hepatitis B vaccine, unless given due to exposure.</p>
            <p><b>COVID-19 Vaccine/Booster:</b> No waiting period after receiving a non-replicating, inactivated, or RNA-based vaccine from Janssen/J&J, Moderna, Novavax, or Pfizer if you're symptom-free.</p>
            <p>Wait 2 weeks if you received a live attenuated COVID-19 vaccine or are unsure of the vaccine type.</p>
            <p><b>Smallpox/Monkeypox Vaccine:</b>
                <p>For ACAM2000 (live virus), wait 8 weeks to donate.</p>
                <p>For Jynneos, if exposed to monkeypox, wait 21 days after your last exposure; no waiting if no exposure.</p>
                <p>If you had close contact with someone vaccinated for smallpox:
                    <p>No symptoms: eligible to donate.</p>
                    <p>Developed skin lesions: wait 8 weeks from the first lesion.</p>
    `,
        open: false,
      },
      {
        question: ' Infections.',
        answer: `
           <p>
            Wait until your infection has fully resolved and you are fever-free before donating.
            After oral antibiotics, wait until your course is completed. For antibiotic injections, wait 10 days after the last dose.
          </p>
            <p>You cannot donate if you’ve had Chagas Disease or Leishmaniasis.</p>
            <p>If you’ve had Babesiosis, you can donate 2 years after diagnosis or a positive test. Check with your doctor before donating.</p>
            <p><b>Lyme Disease:</b> You must be fully recovered for 14 days before donating blood. If on antibiotics, wait 7 days after your last dose.</p>
          <p>See: Antibiotics, Hepatitis, HIV, Sexually Transmitted Disease, and Tuberculosis.</p>
    `,
        open: false,
      },
      {
        question: ' Insulin.',
        answer: `
           <p>
            Donors taking any type of insulin are eligible to donate if their diabetes is well-controlled.
          </p>
    `,
        open: false,
      },
      {
        question: ' Intravenous Drug Use.',
        answer: `
           <p>
            Wait 3 months after using needles to inject drugs that were not prescribed by a physician.
           </p>
    `,
        open: false,
      },
      {
        question: '  Men Who Have Had Sex With Men (MSM).',
        answer: `
            <p>
            As per the FDA’s updated 2023 final guidance regarding an individual donor assessment for all blood donors regardless of gender or sexual orientation. This change eliminated previous FDA eligibility criteria based on sexual orientation, which restricted sexually active gay and bisexual men from giving blood.
            </p>
    `,
        open: false,
      },
      {
        question: '  Malaria.',
        answer: `
          <ul>
            <li>3 years after completing malaria treatment.</li>
            <li>3 months after returning from a malaria-risk area.</li>
            <li>3 years after living more than 5 years in a malaria-endemic country.</li>
            <li>If you’ve travelled to a malaria-risk area, you need to wait 3 additional years unless you've lived for 3 consecutive years in a malaria-free country.</li>
          </ul>
          <p>Malaria is transmitted by mosquito bite in certain countries and may be transmitted to patients through blood transfusion. Be sure to disclose this information during the donation process to ensure patient safety.</p>
    `,
        open: false,
      },
      {
        question: '  Measles Exposure.',
        answer: `
           <p>
            Acceptable if you are healthy and well and have been vaccinated for measles more than 4 weeks ago or were born before 1956.
          </p>
          <p>
            If you have not been vaccinated or it has been less than 4 weeks since being vaccinated, wait 4 weeks from the date of the vaccination or exposure before donating.
          </p>
    `,
        open: false,
      },

      {
        question: '  Medications.',
        answer: `
          <ul>
          <li>Most medications do not disqualify you from donating blood; eligibility depends on the reason for the prescription and your health condition.</li>
          <li>Over-the-counter homeopathic medications, herbal remedies, and nutritional supplements are acceptable.</li>
          </ul>
          <p><b>Waiting periods for specific medications</b> that are of special significance in blood donation:</p>
          <ul>
            <li>Accutane, Amnesteem, Absorica, Claravis, Myorisan, Sotret or Zenatane (isotretinoin), Proscar (finasteride), and Propecia (finasteride): Wait 1 month after the last dose.</li>
            <li>Dutasteride (Avodart, Jalyn): Wait 6 months after the last dose.</li>
            <li>Aspirin: No waiting period for whole blood; wait 2 days for platelets (e.g., if taken Monday, earliest donation is Thursday).</li>
            <li>Brilinta (ticagrelor): No waiting for whole blood; wait 7 days for platelets.</li>
            <li>Effient (prasugrel): No waiting for whole blood; wait 3 days for platelets.</li>
            <li>Feldene (piroxicam): No waiting for whole blood; wait 2 days for platelets.</li>
            <li>Blood Thinners (Warfarin and Heparin): Do not donate; wait 7 days after discontinuation.</li>
            <li>Other blood thinners (Arixtra (fondaparinux), Fragmin (dalteparin), Eliquis (apixaban), Pradaxa (dabigatran), Savaysa (edoxaban), Xarelto (rivaroxaban), and Lovenox (enoxaparin): Do not donate; wait 2 days after discontinuation.</li>
            <li>Hepatitis B Immune Globulin: Given for exposure to hepatitis. Waiting period 3 months.</li>
            <li>Oral HIV PrEP/PEP medications: Wait 3 months after the last dose.</li>
            <li>Injectable HIV PrEP medications: Wait 2 years after the last dose.</li>
            <li>HIV treatment (ART): Not eligible to donate.</li>
            <li>Plavix (clopidogrel) and Ticlid (ticlopidine): No waiting for whole blood; wait 14 days for platelets.</li>
            <li>Zontivity (vorapaxar) – No waiting period for donating whole blood; wait 1 month after taking before donating platelets by apheresis.</li>
            <li>Rinvoq (upadacitinib) – wait 1 month</li>
            <li>Thalomid (thalidomide) – wait 1 month</li>
            <li>Revlimid (lenalidomide) – wait 1 month</li>
            <li>Cellcept (mycophenolate mofetil) – an immunosuppressant– wait 6 weeks</li>
            <li>Soriatane (acitretin) – wait 3 years</li>
            <li>Tegison (etretinate) at any time – you are not eligible to donate blood</li>
            <li>Arava (leflunomide), Erivedge (vismodegib) and Odomzo (sonidegib)– wait 2 years.</li>
            <li>Aubagio (teriflunomide) – wait 2 years.</li>
          </ul>
    `,
        open: false,
      },
      {
        question: '  Monkeypox (exposure or diagnosis)',
        answer: `
           <p>
            Monkeypox infection or exposure, wait a minimum of 21 days, then contact your doctor to discuss your particular situation to determine if you can donate.
          </p>
    `,
        open: false,
      },
      {
        question: '  Organ/Tissue Transplants.',
        answer: `
          <p><b>Organ/Tissue Transplants:</b></p>
            <p>Wait 3 months after receiving an organ transplant from another person.</p>
            <p>If you have received a dura mater transplant, you are not eligible to donate due to concerns about Creutzfeldt-Jakob Disease (CJD).</p>
            <p>Transplants of animal organs or living animal tissue also make you ineligible to donate.</p>
            <p>Non-living animal tissues (e.g., bone, tendon, heart valves) are acceptable for donation.</p>
    `,
        open: false,
      },
      {
        question: '  Piercing (ears, body).',
        answer: `
            <p>Piercing (disposable equipment & sterile procedure): You can donate immediately.</p>
            <p>Piercing (non-sterile or reusable equipment): Wait for 3 months to donate.</p>
            <p><b>Tattooing:</b> 3-month waiting period.</p>
    `,
        open: false,
      },

      {
        question: '  Pregnancy, Breastfeeding, PCOS.',
        answer: `
            <p>Persons who are pregnant are not eligible to donate. Wait 9 months after giving birth.</p>
            <p>Wait 3 months after you stop breastfeeding.</p>
            <p>Wait for 6 months if you had a miscarriage or abortion.</p>
            <p><b>PCOS:</b> If your condition is well-managed, you may still be eligible to donate.</p>
    `,
        open: false,
      },
      {
        question: '  Pulse (High or Low).',
        answer: `
            <p>
            Acceptable as long as your pulse is no more than 100 and no less than 50.
            </p>
    `,
        open: false,
      },
      {
        question: ' Sexually Transmitted Disease.',
        answer: `
          <p>Wait 3 months after treatment for syphilis or gonorrhea.</p>
          <p>Keep in mind that syphilis antibodies may persist for a long time, and confirmatory tests may remain positive for life even after successful treatment.</p>
          <p>You can donate if you have:</p>
          <ul>
            <li>Chlamydia, venereal warts (HPV), or genital herpes, as long as you feel healthy, well, and meet all other eligibility criteria.</li>
          </ul>
    `,
        open: false,
      },
      {
        question: ' Sickle Cell.',
        answer: `
          <p>
            Individuals with sickle cell disease are not eligible to donate. However, those with sickle cell trait can donate platelets and plasma but are not advised to give whole blood or Power Red donations. This restriction is an industry-wide policy, not a reflection on the donor.
          </p>
    `,
        open: false,
      },
      {
        question: ' Skin Disease, Rash, Acne.',
        answer: `
           <p>
            Donation is acceptable if the skin over the vein to be used is not affected.
          </p>
          <p>If that specific skin area is infected, wait until the infection has cleared before donating.</p>
          <p>Taking antibiotics for acne does not disqualify you from donating.</p>
    `,
        open: false,
      },
      {
        question: ' Surgery.',
        answer: `
          <p>
            Most surgeries are acceptable when healed, released from immediate doctor’s care, infection-free, without transfusions, and return to normal activities. A surgery with a blood transfusion needs a 3-month waiting period.
          </p>
          <p>It is not necessarily surgery but the underlying condition that precipitated the surgery that requires evaluation before donation. Evaluation is on a case-by-case basis. Discuss your particular situation with the doctor at the time of donation.</p>
    `,
        open: false,
      },
      {
        question: ' Tattoo.',
        answer: `
           <p>
            Wait three months before donating blood to reduce the risk of bloodborne infections.
          </p>
    `,
        open: false,
      },
      {
        question: ' Tuberculosis.',
        answer: `
          <p>You cannot donate blood if you have active tuberculosis or are currently being treated for it.</p>
          <p>You are eligible to donate if:</p>
          <ul>
            <li>You have a positive skin or blood test for TB but do not have active tuberculosis.</li>
            <li>You are not taking antibiotics for an active infection.</li>
          </ul>
          <p>If you’re being treated for a TB infection with antibiotics, you must wait until your treatment is successfully completed before donating.</p>
    `,
        open: false,
      },
      {
        question: ' Weight/Height.',
        answer: `
         <ul>
          <li>
          <p>You must weigh at least 50 kg (110 lbs) to donate, with no upper weight limit.</p>
          </li>
          </ul>
          <p>Donors 18 years of age must also meet additional height and weight requirements for whole blood donation (applies to girls shorter than 5'3" and boys shorter than 5').</p>
          <p><b>Height and Weight Chart:</b></p>
          <img src="/assets/Images/ta.png" alt="Height and Weight Table">    `,
        open: false,
      },

      {
        question: ' Zika Virus.',
        answer: `
          <p>
            If you have been diagnosed with Zika virus infection, wait more than 120 days after your symptoms resolve to donate.
          </p>
          <p>If you've travelled to an area with Zika virus, and are not affected, wait 28 days after returning.</p>
    `,
        open: false,
      },
    ];

  }

  ngOnInit() {
  }
  setContent(type: string) {
    // ... (Your existing setContent logic)
  }
  // **** VERY IMPORTANT: Correct toggleAccordion function ****
  toggleAccordion(index: number, array: any[]) {
    if (this.openIndex === index) {
      this.openIndex = -1;
      array[index].open = false; // Close the clicked item
    } else {
      if (this.openIndex !== -1) {
        array[this.openIndex].open = false; // Close the previously opened item
      }
      this.openIndex = index;
      array[index].open = true; // Open the clicked item
    }
  }

  getSafeHtml(htmlString: string): SafeHtml { // Corrected getSafeHtml
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  back(val: any) {
    this.myval = val
    this.navCtrl.navigateForward(['/donorguide', { string: val }]);
  }
}
