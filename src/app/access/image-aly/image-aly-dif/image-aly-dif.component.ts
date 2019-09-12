import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Diffusion} from "../../../models/diffusion";
import {ConfirmService} from "../../../components/confirm-dialog/confirm.service";
import {DiffusionService} from "../../../services/database-services/diffusion.service";

@Component({
	selector: 'app-image-aly-dif',
	templateUrl: './image-aly-dif.component.html',
	styleUrls: ['./image-aly-dif.component.css']
})
export class ImageAlyDifComponent implements OnInit {

	_diffusion: Diffusion;
	@Input() set diffusion(dif: Diffusion) {
		this._diffusion = dif;
	}

	editting: boolean = false;
	loading: boolean = false;

	schema: any = Diffusion.schema;

	@Output()
	difUpdate = new EventEmitter<Diffusion>();

	constructor(
		private confirmService: ConfirmService,
		private diffusionService: DiffusionService,
	) {
	}

	ngOnInit() {
	}

	saveDif() {
		this.loading = true;
		// setTimeout(() => {
		//	from data
		this.confirmService.openConfirm(`Are you sure to edit this content`, 'Edit Traverse',
			() => {
				// yes
				// let changes = this._diffusion.toFirebaseJsonObject();
				// delete changes['data_list'];
        let changes = this._diffusion;

        console.log(this._diffusion.$key, changes);
				this.diffusionService.updateDiffusionListDetail(this._diffusion.$key, changes, (_) => {
					this.loading = false;
					this.difUpdate.emit(this._diffusion);
				})
			}
		);

		// }, 1000);
	}

}
