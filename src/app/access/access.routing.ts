/**
 * Created by nxphi47 on 25/8/17.
 */
import {Routes} from "@angular/router";
import {AccessComponent} from "./access.component";
import {ProjectComponent} from "./project/project.component";
import {VolcanoComponent} from "./volcano/volcano.component";
import {ImageAlyComponent} from "./image-aly/image-aly.component";
import {SampleComponent} from "./sample/sample.component";
import {DisplayComponent} from "./display/display.component";
import {AuthLoggedInGuard} from "../auth/auth.guard";
export const ACCESS_ROUTES: Routes = [
	{path: '', component: AccessComponent, children: [
		{path: '', redirectTo: 'display', pathMatch: 'full'},
		{path: 'display', component: DisplayComponent},

		{path: 'project/:id', component: ProjectComponent},
		{path: 'volcano/:id', component: VolcanoComponent},
		{path: 'sample/:id', component: SampleComponent},
		{path: 'imagealy/:id', component: ImageAlyComponent, canActivate: [AuthLoggedInGuard]},
	]},
	// {path: '', redirectTo: 'volcano/asdasfasf'},
];