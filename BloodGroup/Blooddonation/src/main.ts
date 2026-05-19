import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//import 'swiper/element/bundle';
import { register } from 'swiper/element/bundle';

if (environment.production) {
  enableProdMode();
}

register();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

