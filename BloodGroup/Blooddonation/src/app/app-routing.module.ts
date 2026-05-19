import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  //{
  //  path: '',
  //  redirectTo: 'folder/Inbox',
  //  pathMatch: 'full'
  //},
  {
    path: '',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./Pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'donor-registration',
    loadChildren: () => import('./Pages/donor-registration/donor-registration.module').then( m => m.DonorRegistrationPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./Pages/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'contact',
    loadChildren: () => import('./Pages/contact/contact.module').then( m => m.ContactPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./Pages/about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'eligibilitycriteria',
    loadChildren: () => import('./Pages/eligibilitycriteria/eligibilitycriteria.module').then( m => m.EligibilitycriteriaPageModule)
  },
  {
    path: 'joincampaign',
    loadChildren: () => import('./Pages/joincampaign/joincampaign.module').then( m => m.JoincampaignPageModule)
  },
  {
    path: 'learnaboutblood',
    loadChildren: () => import('./Pages/learnaboutblood/learnaboutblood.module').then( m => m.LearnaboutbloodPageModule)
  },
  {
    path: 'myprofile',
    loadChildren: () => import('./Pages/myprofile/myprofile.module').then( m => m.MyprofilePageModule)
  },
  {
    path: 'postabloodrequest',
    loadChildren: () => import('./Pages/postabloodrequest/postabloodrequest.module').then( m => m.PostabloodrequestPageModule)
  },
  {
    path: 'shareyourservices',
    loadChildren: () => import('./Pages/shareyourservices/shareyourservices.module').then( m => m.ShareyourservicesPageModule)
  },
  {
    path: 'termsofusedisclaimer',
    loadChildren: () => import('./Pages/termsofusedisclaimer/termsofusedisclaimer.module').then( m => m.TermsofusedisclaimerPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./Pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  
  {
    path: 'needblood',
    loadChildren: () => import('./Pages/needblood/needblood.module').then( m => m.NeedbloodPageModule)
  },
  {
    path: 'searchdonors',
    loadChildren: () => import('./Pages/searchdonors/searchdonors.module').then( m => m.SearchdonorsPageModule)
  },
 
  {
    path: 'myrequest',
    loadChildren: () => import('./Pages/myrequest/myrequest.module').then( m => m.MyrequestPageModule)
  },
  {
    path: 'requsetform',
    loadChildren: () => import('./Pages/requsetform/requsetform.module').then( m => m.RequsetformPageModule)
  },
  {
    path: 'donordetails',
    loadChildren: () => import('./Pages/donordetails/donordetails.module').then( m => m.DonordetailsPageModule)
  },
  {
    path: 'searchdetails',
    loadChildren: () => import('./Pages/searchdetails/searchdetails.module').then( m => m.SearchdetailsPageModule)
  },
  {
    path: 'rquestpresentation',
    loadChildren: () => import('./Pages/rquestpresentation/rquestpresentation.module').then( m => m.RquestpresentationPageModule)
  },
  {
    path: 'stickbrouchers',
    loadChildren: () => import('./Pages/stickbrouchers/stickbrouchers.module').then( m => m.StickbrouchersPageModule)
  },
  {
    path: 'downloadbrochers',
    loadChildren: () => import('./Pages/downloadbrochers/downloadbrochers.module').then( m => m.DownloadbrochersPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./Pages/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'leaders',
    loadChildren: () => import('./Pages/leaders/leaders.module').then( m => m.LeadersPageModule)
  },
  {
    path: 'hospitaldetails',
    loadChildren: () => import('./Pages/hospitaldetails/hospitaldetails.module').then( m => m.HospitaldetailsPageModule)
  },
  {
    path: 'aboutus',
    loadChildren: () => import('./Pages/aboutus/aboutus.module').then( m => m.AboutusPageModule)
  },
  {
    path: 'donorguide',
    loadChildren: () => import('./Pages/donorguide/donorguide.module').then( m => m.DonorguidePageModule)
  },
  {
    path: 'quiz',
    loadChildren: () => import('./Pages/quiz/quiz.module').then( m => m.QuizPageModule)
  },
  {
    path: 'letshlpgallerry',
    loadChildren: () => import('./Pages/letshlpgallerry/letshlpgallerry.module').then( m => m.LetshlpgallerryPageModule)
  },
  {
    path: 'donatenow',
    loadChildren: () => import('./Pages/donatenow/donatenow.module').then( m => m.DonatenowPageModule)
  },
  {
    path: 'sharevideo',
    loadChildren: () => import('./Pages/sharevideo/sharevideo.module').then( m => m.SharevideoPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./Pages/tutorial/tutorial.module').then( m => m.TutorialPageModule)
  },
  {
    path: 'privacypolicy',
    loadChildren: () => import('./Pages/privacypolicy/privacypolicy.module').then( m => m.PrivacypolicyPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./Pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'feedback',
    loadChildren: () => import('./Pages/feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'general',
    loadChildren: () => import('./Pages/general/general.module').then( m => m.GeneralPageModule)
  },
  {
    path: 'usercontrol',
    loadChildren: () => import('./Pages/usercontrol/usercontrol.module').then( m => m.UsercontrolPageModule)
  },
  {
    path: 'registerdonation',
    loadChildren: () => import('./Pages/registerdonation/registerdonation.module').then( m => m.RegisterdonationPageModule)
  },
  {
    path: 'multipledonors',
    loadChildren: () => import('./Pages/multipledonors/multipledonors.module').then( m => m.MultipledonorsPageModule)
  },
  {
    path: 'supportletshelp',
    loadChildren: () => import('./Pages/supportletshelp/supportletshelp.module').then( m => m.SupportletshelpPageModule)
  },
  {
    path: 'language',
    loadChildren: () => import('./Pages/language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'partners',
    loadChildren: () => import('./Pages/partners/partners.module').then( m => m.PartnersPageModule)
  },
  {
    path: 'imagetemplates',
    loadChildren: () => import('./Pages/imagetemplates/imagetemplates.module').then( m => m.ImagetemplatesPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'profiledetails',
    loadChildren: () => import('./Pages/profiledetails/profiledetails.module').then( m => m.ProfiledetailsPageModule)
  },
  
  {
    path: 'finalreview',
    loadChildren: () => import('./Pages/finalreview/finalreview.module').then( m => m.FinalreviewPageModule)
  },
  
  {
    path: 'donorssearch',
    loadChildren: () => import('./Pages/donorssearch/donorssearch.module').then( m => m.DonorssearchPageModule)
  },
  {
    path: 'quizquestions',
    loadChildren: () => import('./Pages/quizquestions/quizquestions.module').then( m => m.QuizquestionsPageModule)
  },
  {
    path: 'termsandconditionsside',
    loadChildren: () => import('./Pages/termsandconditionsside/termsandconditionsside.module').then( m => m.TermsandconditionssidePageModule)
  },
  {
    path: 'privacypolicyside',
    loadChildren: () => import('./Pages/privacypolicyside/privacypolicyside.module').then( m => m.PrivacypolicysidePageModule)
  },
  {
    path: 'searchlocation',
    loadChildren: () => import('./Pages/searchlocation/searchlocation.module').then( m => m.SearchlocationPageModule)
  },
  {
    path: 'dashboarddetails',
    loadChildren: () => import('./Pages/dashboarddetails/dashboarddetails.module').then( m => m.DashboarddetailsPageModule)
  },
  {
    path: 'leaderguide',
    loadChildren: () => import('./Pages/leaderguide/leaderguide.module').then( m => m.LeaderguidePageModule)
  },
  {
    path: 'hospitallist',
    loadChildren: () => import('./Pages/hospitallist/hospitallist.module').then( m => m.HospitallistPageModule)
  },
  {
    path: 'guidedlist',
    loadChildren: () => import('./Pages/guidedlist/guidedlist.module').then( m => m.GuidedlistPageModule)
  },
  {
    path: 'donorssearch',
    loadChildren: () => import('./Pages/donorssearch/donorssearch.module').then( m => m.DonorssearchPageModule)
  },
  {
    path: 'presentationaccepteddetails',
    loadChildren: () => import('./Pages/presentationaccepteddetails/presentationaccepteddetails.module').then( m => m.PresentationaccepteddetailsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
