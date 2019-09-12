import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Sample} from "../../../../models/sample";
import {ImageModel} from "../../../../models/image-model";
import {Analysis} from "../../../../models/analysis";
import {PointAlyCanvas} from "../../../fabric-classes/point-aly-canvas";

@Component({
	selector: 'app-point-aly-control',
	templateUrl: './point-aly-control.component.html',
	styleUrls: ['./point-aly-control.component.css']
})
export class PointAlyControlComponent implements OnInit {

	@Input()
	sample: Sample;

	@Input()
	image: ImageModel;

	@Input()
	canvas: PointAlyCanvas;

	// emits is called when use press confirm!
	@Output()
	onCreated = new EventEmitter<Analysis[]>();

	@Output()
	onEditted = new EventEmitter<Analysis[]>();

	@Output()
	onDeleted = new EventEmitter<Analysis[]>();

	constructor() {
	}

	ngOnInit() {
	}

}
