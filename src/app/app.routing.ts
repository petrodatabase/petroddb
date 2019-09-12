/**
 * Created by nxphi47 on 25/8/17.
 */
import {Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {HOME_ROUTES} from "./home/home.routing";
import {InputComponent} from "./input/input.component";
import {INPUT_ROUTES} from "./input/input.routing";
import {AccessComponent} from "./access/access.component";
import {ACCESS_ROUTES} from "./access/access.routing";
import {AccountComponent} from "./account/account.component";
import {ACCOUNT_ROUTES} from "./account/account.routing";
import {AppComponent} from "./app.component";
import {QueryComponent} from "./query/query.component";
import {QUERY_ROUTES} from "./query/query.routing";
import {AuthLoggedInGuard} from "./auth/auth.guard";
import {PwaComponent} from "./pwa/pwa.component";
/**
 * Created by nxphi47 on 25/8/17.
 */
export const ROOT_ROUTES: Routes = [
	{path: '', redirectTo: '/home', pathMatch: 'full'},
  // TODO: all lazy loaded
	{path: 'home',  loadChildren: './home/home.module#HomeModule'},
	// {path: 'input',  loadChildren: './input/input.module#InputModule', canActivate: [AuthLoggedInGuard]},
  {path: 'input',  loadChildren: './input/input.module#InputModule'},

  {path: 'access',  loadChildren: './access/access.module#AccessModule'},
	// {path: 'account',  loadChildren: './account/account.module#AccountModule', canActivate: [AuthLoggedInGuard]},
	// {path: 'query',  loadChildren: './query/query.module#QueryModule', canActivate: [AuthLoggedInGuard]},
  {path: 'account',  loadChildren: './account/account.module#AccountModule'},
  {path: 'query',  loadChildren: './query/query.module#QueryModule'},
	{path: 'tutorial',  loadChildren: './tutorial/tutorial.module#TutorialModule'},


];
