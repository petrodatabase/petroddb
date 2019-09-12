import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageModel} from "../../../../models/image-model";
import {Sample} from "../../../../models/sample";
import {Diffusion} from "../../../../models/diffusion";
import {DiffusionCanvas} from "../../../fabric-classes/diffusion-canvas";

@Component({
	selector: 'app-dif-control',
	templateUrl: './dif-control.component.html',
	styleUrls: ['./dif-control.component.css']
})
export class DifControlComponent implements OnInit {

	@Input()
	sample: Sample;

	@Input()
	image: ImageModel;

	@Input()
	canvas: DiffusionCanvas;


	// emits is called when use press confirm!
	@Output()
	onCreated = new EventEmitter<Diffusion[]>();

	@Output()
	onEditted = new EventEmitter<Diffusion[]>();

	@Output()
	onDeleted = new EventEmitter<Diffusion[]>();

	constructor() {
	}

	ngOnInit() {
	}

}
