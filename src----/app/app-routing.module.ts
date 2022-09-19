import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule)
    // loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    // loadChildren: './welcome/welcome.module#WelcomePageModule'
  },
  {
    path: 'cashfree',
    loadChildren: () => import('./cashfree/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
    // loadChildren: './login/login.module#LoginPageModule' 
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)

  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then(m => m.SchedulePageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then(m => m.NewsPageModule)

  },
  {
    path: 'marketplace',
    loadChildren: () => import('./marketplace/marketplace.module').then(m => m.MarketplacePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'videos',
    loadChildren: () => import('./videos/videos.module').then(m => m.VideosPageModule)

  },
  {
    path: 'assistant',
    loadChildren: () => import('./assistant/assistant.module').then(m => m.AssistantPageModule)

  },
  {
    path: 'referrals',
    loadChildren: () => import('./referrals/referrals.module').then(m => m.ReferralsPageModule)

  },
  {
    path: 'wallet',
    loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletPageModule)

  },
  {
    path: 'doctor',
    loadChildren: () => import('./doctor/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'locationresult/:id',
    loadChildren: () => import('./locationresult/home.module').then(m => m.HomePageModule)

  },

  {
    path: 'allapointment',
    loadChildren: () => import('./allapointment/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'booking/:id/:type/:time',
    loadChildren: () => import('./booking/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'allprofiles/:id/:type/:time',
    loadChildren: () => import('./allprofiles/home.module').then(m => m.HomePageModule)

  },

  {
    path: 'bill/:userid',
    loadChildren: () => import('./bill/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'diag',
    loadChildren: () => import('./diag/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'hospital',
    loadChildren: () => import('./hospital/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'clinic',
    loadChildren: () => import('./clinic/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'offer',
    loadChildren: () => import('./offer/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'ht',
    loadChildren: () => import('./ht/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'ht_details/:id',
    loadChildren: () => import('./ht_details/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'per_blog',
    loadChildren: () => import('./per_blog/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'blog/:id',
    loadChildren: () => import('./blog/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'blog1/:id',
    loadChildren: () => import('./blog1/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'blogs/:id',
    loadChildren: () => import('./blogs/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'doctorprofile/:id/:time',
    loadChildren: () => import('./doctorprofile/home.module').then(m => m.HomePageModule)

  },
  {
    path: 'forgotpass',
    loadChildren: () => import('./forgotpass/login.module').then(m => m.LoginPageModule)

  },
  {
    path: '**',
    loadChildren: () => import('./error/error.module').then(m => m.ErrorPageModule)

  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
