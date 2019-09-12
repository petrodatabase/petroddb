/**
 * Created by nxphi47 on 25/8/17.
 */
import {Routes} from "@angular/router";
import {AccountComponent} from "./account.component";
import {AuthLoggedInGuard} from "../auth/auth.guard";
export const ACCOUNT_ROUTES: Routes = [
	{path: '', component: AccountComponent, canActivate: [AuthLoggedInGuard]}
];