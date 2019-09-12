/**
 * Created by nxphi47 on 25/8/17.
 */
import {NgModule} from '@angular/core';
import {
	MdAutocompleteModule,
	MdButtonModule,
	MdButtonToggleModule,
	MdCardModule,
	MdCheckboxModule,
	// MdChipsModule,
	MdCoreModule,
	MdTableModule,
	MdDatepickerModule,
	MdDialogModule,
	MdExpansionModule,
	MdFormFieldModule,
	MdGridListModule,
	MdIconModule,
	MdInputModule,
	MdListModule,
	MdMenuModule,
	MdNativeDateModule,
	MdPaginatorModule,
	MdProgressBarModule,
	MdProgressSpinnerModule,
	MdRadioModule,
	MdRippleModule,
	MdSelectModule,
	MdSidenavModule,
	MdSliderModule,
	MdSlideToggleModule,
	MdSnackBarModule,
	MdSortModule,
	MdTabsModule,
	MdToolbarModule,
	MdTooltipModule,
	StyleModule
} from '@angular/material';
import {FlexLayoutModule} from "@angular/flex-layout";
// import {CdkTableModule} from "@angular/cdk/typings/table";
import {CdkTableModule} from '@angular/cdk/table';

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
	exports: [
		MdAutocompleteModule,
		MdButtonModule,
		MdButtonToggleModule,
		MdCardModule,
		MdCheckboxModule,
		// MdChipsModule,
		MdTableModule,
		MdDatepickerModule,
		MdDialogModule,
		MdExpansionModule,
		MdFormFieldModule,
		MdGridListModule,
		MdIconModule,
		MdInputModule,
		MdListModule,
		MdMenuModule,
		MdCoreModule,
		MdPaginatorModule,
		MdProgressBarModule,
		MdProgressSpinnerModule,
		MdRadioModule,
		MdRippleModule,
		MdSelectModule,
		MdSidenavModule,
		MdSlideToggleModule,
		MdSliderModule,
		MdSnackBarModule,
		MdSortModule,
		MdTabsModule,
		MdToolbarModule,
		MdTooltipModule,
		MdNativeDateModule,

		FlexLayoutModule,
		CdkTableModule,
		StyleModule
	]
})
export class MaterialImportModule {}
